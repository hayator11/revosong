import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create admin Supabase client for server-side operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Google Sheets APIの認証用の型定義
interface GoogleSheetsConfig {
  apiKey: string;
  sheetId: string;
  range: string;
}

// フォーム応答の型定義
interface FormResponse {
  timestamp: string;
  email: string;
  applicantName: string;
  username: string;
  applicationType: '自薦' | '他薦';
  themeTitle: string;
  themeDescription: string;
  supportType?: string;
  targetAudience?: string;
  referenceUrl?: string;
  additionalComments?: string;
}

// Helper: Parse Google Sheets response
async function fetchGoogleSheetData(config: GoogleSheetsConfig): Promise<any[][]> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${config.sheetId}/values/${encodeURIComponent(config.range)}?key=${config.apiKey}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Google Sheets API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.values || [];
}

// Helper: Map sheet row to FormResponse
function parseFormResponse(headers: string[], row: string[]): FormResponse | null {
  if (!row || row.length < 10) return null;

  // Google Sheets の構造（C列と E列をスキップ）:
  // A: タイムスタンプ
  // B: メールアドレス
  // C: 無題の質問（スキップ）
  // D: 申請者名
  // E: メールアドレス（重複、スキップ）
  // F: SNS アカウント
  // G: REVOSONGユーザー名
  // H: 申請タイプ
  // I: テーマタイトル
  // J: テーマ説明
  // K: 応援内容
  // L: 対象者やコミュニティ
  // M: 参考になる曲やURL
  // N: 追加コメント

  const response: FormResponse = {
    timestamp: row[0] || '',                    // A列
    email: row[1] || '',                        // B列
    applicantName: row[3] || '',                // D列（C列をスキップ）
    username: row[6] || '',                     // G列（E列をスキップ、F列のSNS）
    applicationType: (row[7] === '自薦' ? '自薦' : '他薦') as '自薦' | '他薦', // H列
    themeTitle: row[8] || '',                   // I列
    themeDescription: row[9] || '',             // J列
    supportType: row[10] || undefined,          // K列
    targetAudience: row[11] || undefined,       // L列
    referenceUrl: row[12] || undefined,         // M列
    additionalComments: row[13] || undefined,   // N列
  };

  // Validate required fields
  if (!response.timestamp || !response.email || !response.themeTitle) {
    return null;
  }

  return response;
}

// Helper: Sync response to campaign_themes
async function syncResponseToTheme(
  response: FormResponse,
  userEmail: string
): Promise<{ id: number; status: string }> {
  // Find user by email
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('email', userEmail)
    .single();

  if (!profile) {
    throw new Error(`User not found for email: ${userEmail}`);
  }

  // Check if theme already exists (by timestamp or title+email combination)
  const { data: existing } = await supabaseAdmin
    .from('campaign_themes')
    .select('id')
    .eq('submitted_by', profile.id)
    .eq('title', response.themeTitle)
    .eq('status', 'pending')
    .single();

  if (existing) {
    return { id: existing.id, status: 'already_exists' };
  }

  // Create or update campaign_theme
  const { data: theme, error } = await supabaseAdmin
    .from('campaign_themes')
    .insert({
      submitted_by: profile.id,
      title: response.themeTitle,
      description: response.themeDescription,
      application_type: response.applicationType,
      support_type: response.supportType,
      target_audience: response.targetAudience,
      reference_url: response.referenceUrl,
      additional_comments: response.additionalComments,
      status: 'pending', // Admin will review and approve
      form_submission_date: response.timestamp,
      votes_count: 0,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create theme: ${error.message}`);
  }

  return { id: theme.id, status: 'created' };
}

// GET: Sync status and recent submissions
export async function GET(request: NextRequest) {
  try {
    // Get pending themes (submitted via Google Form)
    const { data: pendingThemes } = await supabaseAdmin
      .from('campaign_themes')
      .select(
        `
        id,
        title,
        description,
        application_type,
        support_type,
        status,
        votes_count,
        created_at,
        submitter:profiles(username, email)
        `
      )
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(50);

    return NextResponse.json({
      pending_count: pendingThemes?.length || 0,
      recent_submissions: pendingThemes || [],
    });
  } catch (err) {
    console.error('Unexpected error in GET recruitment status:', err);
    return NextResponse.json(
      { error: 'Unexpected error' },
      { status: 500 }
    );
  }
}

// POST: Sync Google Sheet responses
export async function POST(request: NextRequest) {
  try {
    // Get Google Sheets config from environment
    const sheetId = process.env.GOOGLE_FORM_SHEET_ID;
    const apiKey = process.env.GOOGLE_SHEETS_API_KEY;

    if (!sheetId || !apiKey) {
      return NextResponse.json(
        {
          error: 'Google Sheets API not configured',
          message: 'GOOGLE_FORM_SHEET_ID and GOOGLE_SHEETS_API_KEY environment variables required'
        },
        { status: 500 }
      );
    }

    // Fetch Google Sheet data
    const config: GoogleSheetsConfig = {
      apiKey,
      sheetId,
      range: 'フォーム回答 1!A:N', // Google Forms sheet name with all columns (A-N)
    };

    const sheetData = await fetchGoogleSheetData(config);

    if (sheetData.length < 2) {
      return NextResponse.json(
        { message: 'No data found in Google Sheet' },
        { status: 200 }
      );
    }

    // Parse header and responses
    const headers = sheetData[0];
    const responses = sheetData.slice(1);

    let successCount = 0;
    let skipCount = 0;
    const errors: string[] = [];

    // Process each response
    for (let i = 0; i < responses.length; i++) {
      try {
        const formResponse = parseFormResponse(headers, responses[i]);
        if (!formResponse) {
          skipCount++;
          continue;
        }

        const result = await syncResponseToTheme(formResponse, formResponse.email);
        if (result.status === 'created') {
          successCount++;
        } else if (result.status === 'already_exists') {
          skipCount++;
        }
      } catch (error) {
        errors.push(`Row ${i + 2}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    return NextResponse.json({
      message: 'Sync completed',
      synced_count: successCount,
      skipped_count: skipCount,
      error_count: errors.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err) {
    console.error('Unexpected error in POST recruitment sync:', err);
    return NextResponse.json(
      {
        error: 'Unexpected error',
        message: err instanceof Error ? err.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

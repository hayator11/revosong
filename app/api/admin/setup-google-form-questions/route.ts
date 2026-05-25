import { NextRequest, NextResponse } from 'next/server';

// Google Forms API を使用して質問を自動追加
export async function POST(request: NextRequest) {
  try {
    // Google Cloud サービスアカウント認証情報を取得
    const apiKeyJson = process.env.GOOGLE_SHEETS_API_KEY;
    if (!apiKeyJson) {
      return NextResponse.json(
        { error: 'GOOGLE_SHEETS_API_KEY environment variable not set' },
        { status: 500 }
      );
    }

    const serviceAccount = JSON.parse(apiKeyJson);

    // サービスアカウントからアクセストークンを取得
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: createJWT(serviceAccount),
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error(`Failed to get token: ${tokenResponse.statusText}`);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Google Form ID
    const formId = '1Gj2AfmUkb6X6tFkJNKUvT4MgW0bUoRXp8TQzfSVrBL4';

    // フォームの現在の状態を取得
    const formRes = await fetch(`https://forms.googleapis.com/v1/forms/${formId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!formRes.ok) {
      const errorData = await formRes.json();
      throw new Error(`Failed to get form: ${JSON.stringify(errorData)}`);
    }

    const form = await formRes.json();

    // 既存の質問数を取得
    const existingItems = form.items || [];
    const existingCount = existingItems.filter((item: any) => item.questionItem).length;

    console.log(`✓ フォーム取得成功`);
    console.log(`  タイトル: ${form.info?.title}`);
    console.log(`  既存質問数: ${existingCount}`);

    // 追加する質問の定義
    const questionsToAdd = [
      {
        title: '申請者名',
        questionItem: {
          question: {
            required: true,
            textQuestion: {
              paragraph: false,
            },
          },
        },
      },
      {
        title: 'REVOSONGユーザー名',
        questionItem: {
          question: {
            required: true,
            textQuestion: {
              paragraph: false,
            },
          },
        },
      },
      {
        title: '申請タイプ',
        questionItem: {
          question: {
            required: true,
            choiceQuestion: {
              type: 'RADIO',
              options: [{ value: '自薦' }, { value: '他薦' }],
            },
          },
        },
      },
      {
        title: 'テーマタイトル',
        questionItem: {
          question: {
            required: true,
            textQuestion: {
              paragraph: false,
            },
          },
        },
      },
      {
        title: 'テーマ説明',
        questionItem: {
          question: {
            required: true,
            textQuestion: {
              paragraph: true,
            },
          },
        },
      },
      {
        title: 'どのような応援がしてほしいか / したいのか',
        questionItem: {
          question: {
            required: false,
            textQuestion: {
              paragraph: true,
            },
          },
        },
      },
      {
        title: '対象者やコミュニティ',
        questionItem: {
          question: {
            required: false,
            textQuestion: {
              paragraph: false,
            },
          },
        },
      },
      {
        title: '参考になる曲やURL',
        questionItem: {
          question: {
            required: false,
            textQuestion: {
              paragraph: false,
            },
          },
        },
      },
      {
        title: '追加コメント',
        questionItem: {
          question: {
            required: false,
            textQuestion: {
              paragraph: true,
            },
          },
        },
      },
    ];

    // 質問を追加
    const batchUpdateRequest = {
      requests: questionsToAdd.map((question, index) => ({
        createItem: {
          item: question,
          location: {
            index: existingCount + index,
          },
        },
      })),
    };

    const updateRes = await fetch(
      `https://forms.googleapis.com/v1/forms/${formId}:batchUpdate`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(batchUpdateRequest),
      }
    );

    if (!updateRes.ok) {
      const errorData = await updateRes.json();
      throw new Error(`Failed to update form: ${JSON.stringify(errorData)}`);
    }

    console.log(`✓ 質問項目を追加しました (${questionsToAdd.length}件)`);

    return NextResponse.json({
      success: true,
      message: `✓ Google Form を自動設定しました！`,
      questionsAdded: questionsToAdd.length,
      formUrl: `https://docs.google.com/forms/d/${formId}`,
      questions: questionsToAdd.map((q) => q.title),
    });
  } catch (error) {
    console.error('Error setting up Google Form:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// JWT トークンを作成する関数
function createJWT(serviceAccount: any): string {
  const header = { alg: 'RS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/forms',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };

  const headerEncoded = Buffer.from(JSON.stringify(header)).toString('base64url');
  const payloadEncoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = require('crypto')
    .createSign('RSA-SHA256')
    .update(`${headerEncoded}.${payloadEncoded}`)
    .sign(serviceAccount.private_key, 'base64url');

  return `${headerEncoded}.${payloadEncoded}.${signature}`;
}

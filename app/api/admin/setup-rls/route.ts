import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Use service role for setup operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    // Execute SQL statements one by one
    const statements = [
      `DROP POLICY IF EXISTS "campaign_themes_select_all" ON campaign_themes`,
      `DROP POLICY IF EXISTS "campaign_themes_insert_auth" ON campaign_themes`,
      `DROP POLICY IF EXISTS "campaign_themes_update_admin" ON campaign_themes`,
      `DROP POLICY IF EXISTS "campaign_themes_delete_admin" ON campaign_themes`,
      `CREATE POLICY "campaign_themes_select_all" ON campaign_themes FOR SELECT USING (true)`,
      `CREATE POLICY "campaign_themes_insert_auth" ON campaign_themes FOR INSERT WITH CHECK (auth.role() = 'authenticated')`,
      `CREATE POLICY "campaign_themes_update_admin" ON campaign_themes FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')) WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))`,
      `CREATE POLICY "campaign_themes_delete_admin" ON campaign_themes FOR DELETE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))`,
    ];

    const results = [];
    for (const sql of statements) {
      try {
        // Use the admin client's from() method to execute queries
        // We'll try executing through a function if it exists
        const { error } = await (supabaseAdmin as any).rpc('exec_sql', { sql });
        results.push({ sql, success: !error, error });
      } catch (e) {
        results.push({ sql, success: false, error: String(e) });
      }
    }

    const allSuccess = results.every((r) => r.success);

    if (allSuccess) {
      return NextResponse.json({
        success: true,
        message: '✓ RLS policies created successfully',
        results,
      });
    } else {
      // Return which statements failed
      const failedStatements = results
        .filter((r) => !r.success)
        .map((r) => `${r.sql}: ${r.error}`);

      return NextResponse.json({
        success: false,
        message:
          'Some RLS policies could not be created. Please run the migration SQL manually.',
        failedStatements,
        sql: `
DROP POLICY IF EXISTS "campaign_themes_select_all" ON campaign_themes;
DROP POLICY IF EXISTS "campaign_themes_insert_auth" ON campaign_themes;
DROP POLICY IF EXISTS "campaign_themes_update_admin" ON campaign_themes;
DROP POLICY IF EXISTS "campaign_themes_delete_admin" ON campaign_themes;

CREATE POLICY "campaign_themes_select_all" ON campaign_themes FOR SELECT USING (true);
CREATE POLICY "campaign_themes_insert_auth" ON campaign_themes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "campaign_themes_update_admin" ON campaign_themes FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')) WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "campaign_themes_delete_admin" ON campaign_themes FOR DELETE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
        `,
        instructions:
          'Copy the SQL above and run it in Supabase SQL Editor: https://supabase.com/dashboard → SQL Editor',
      });
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to setup RLS policies' },
      { status: 500 }
    );
  }
}

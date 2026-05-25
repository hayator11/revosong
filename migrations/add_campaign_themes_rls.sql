-- Add RLS policies for campaign_themes table
-- This migration ensures proper access control for campaign theme management

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "campaign_themes_select_all" ON campaign_themes;
DROP POLICY IF EXISTS "campaign_themes_insert_auth" ON campaign_themes;
DROP POLICY IF EXISTS "campaign_themes_update_admin" ON campaign_themes;
DROP POLICY IF EXISTS "campaign_themes_delete_admin" ON campaign_themes;

-- Policy 1: Anyone can SELECT
CREATE POLICY "campaign_themes_select_all" ON campaign_themes
  FOR SELECT
  USING (true);

-- Policy 2: Authenticated users can INSERT
CREATE POLICY "campaign_themes_insert_auth" ON campaign_themes
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Policy 3: Admin users can UPDATE (for status changes - approve/reject)
CREATE POLICY "campaign_themes_update_admin" ON campaign_themes
  FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Policy 4: Admin users can DELETE
CREATE POLICY "campaign_themes_delete_admin" ON campaign_themes
  FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

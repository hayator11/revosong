-- Add Google Form fields to campaign_themes table
-- This migration adds columns to support Google Form responses for theme applications

-- 1. Add application_type column (自薦 or 他薦)
ALTER TABLE campaign_themes
ADD COLUMN IF NOT EXISTS application_type VARCHAR(20), -- '自薦' (self-nomination) or '他薦' (other-nomination)
ADD COLUMN IF NOT EXISTS support_type TEXT, -- どのような応援がしてほしいのか / したいのか
ADD COLUMN IF NOT EXISTS target_audience TEXT, -- 誰を応援したいのか / に応援してほしいのか
ADD COLUMN IF NOT EXISTS reference_url TEXT, -- Reference songs or materials
ADD COLUMN IF NOT EXISTS additional_comments TEXT, -- Additional comments from applicant
ADD COLUMN IF NOT EXISTS form_submission_date TIMESTAMP, -- When the Google Form was submitted
ADD COLUMN IF NOT EXISTS applicant_email TEXT, -- Applicant's email from Google Form
ADD COLUMN IF NOT EXISTS applicant_name TEXT; -- Applicant's name from Google Form

-- 2. Ensure profiles table has role column
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user'; -- 'user', 'admin', or other roles

-- 3. Update indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_campaign_themes_application_type ON campaign_themes(application_type);
CREATE INDEX IF NOT EXISTS idx_campaign_themes_form_submission_date ON campaign_themes(form_submission_date DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(id);

-- 4. Create index for admin lookup (used in RLS policies)
CREATE INDEX IF NOT EXISTS idx_profiles_admin_lookup ON profiles(id) WHERE role = 'admin';

-- 5. Update the RLS policy to fix the admin check
-- First, drop the old policy if it exists
DROP POLICY IF EXISTS "campaigns_insert_admin" ON campaigns;
DROP POLICY IF EXISTS "campaigns_update_admin" ON campaigns;
DROP POLICY IF EXISTS "campaigns_delete_admin" ON campaigns;

-- Drop the old campaign_submissions admin policy
DROP POLICY IF EXISTS "campaign_submissions_delete_owner" ON campaign_submissions;

-- Drop the old campaign_likes admin policy
DROP POLICY IF EXISTS "campaign_likes_delete_owner" ON campaign_likes;

-- Recreate with better admin check
CREATE POLICY "campaigns_insert_admin" ON campaigns
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "campaigns_update_admin" ON campaigns
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "campaigns_delete_admin" ON campaigns
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Recreate campaign_submissions policies
CREATE POLICY "campaign_submissions_delete_owner_or_admin" ON campaign_submissions
  FOR DELETE USING (
    auth.uid() = submitted_by OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Recreate campaign_likes policies
CREATE POLICY "campaign_likes_delete_owner_or_admin" ON campaign_likes
  FOR DELETE USING (
    auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

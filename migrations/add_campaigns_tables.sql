-- Campaign Feature Tables
-- This migration adds the complete campaign system for community-driven themed music submissions

-- 1. campaign_themes - User-submitted campaign theme ideas
CREATE TABLE IF NOT EXISTS campaign_themes (
  id BIGSERIAL PRIMARY KEY,
  submitted_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  votes_count BIGINT DEFAULT 0,
  is_selected BOOLEAN DEFAULT false,
  campaign_id BIGINT, -- Will be set when selected as campaign theme
  status VARCHAR(20) DEFAULT 'pending', -- pending, approved, selected, archived
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. campaigns - Campaign metadata with award tracking
CREATE TABLE IF NOT EXISTS campaigns (
  id BIGSERIAL PRIMARY KEY,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  theme_id BIGINT REFERENCES campaign_themes(id),
  title TEXT NOT NULL,
  description TEXT,
  theme_image_url TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  submission_start TIMESTAMP WITH TIME ZONE,
  submission_end TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  -- Award selection and comment by theme proposer
  awarded_submission_id BIGINT, -- Will reference campaign_submissions
  awarded_at TIMESTAMP WITH TIME ZONE,
  theme_proposer_comment TEXT,
  ogp_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. campaign_submissions - Track submissions to campaigns
CREATE TABLE IF NOT EXISTS campaign_submissions (
  id BIGSERIAL PRIMARY KEY,
  campaign_id BIGINT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  campaign_theme_id BIGINT NOT NULL REFERENCES campaign_themes(id) ON DELETE CASCADE,
  track_id BIGINT NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
  submitted_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_selected_by_theme_author BOOLEAN DEFAULT false,
  UNIQUE(campaign_id, campaign_theme_id, track_id)
);

-- 4. campaign_likes - Likes within campaign period
CREATE TABLE IF NOT EXISTS campaign_likes (
  id BIGSERIAL PRIMARY KEY,
  campaign_id BIGINT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  track_id BIGINT NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  liked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(campaign_id, track_id, user_id)
);

-- Add foreign key for awarded_submission_id in campaigns
ALTER TABLE campaigns
ADD CONSTRAINT fk_campaigns_awarded_submission
FOREIGN KEY (awarded_submission_id)
REFERENCES campaign_submissions(id)
ON DELETE SET NULL;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_campaign_themes_submitted_by ON campaign_themes(submitted_by);
CREATE INDEX IF NOT EXISTS idx_campaign_themes_status ON campaign_themes(status);
CREATE INDEX IF NOT EXISTS idx_campaign_themes_campaign_id ON campaign_themes(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_created_by ON campaigns(created_by);
CREATE INDEX IF NOT EXISTS idx_campaigns_theme_id ON campaigns(theme_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_is_active ON campaigns(is_active);
CREATE INDEX IF NOT EXISTS idx_campaign_submissions_campaign_id ON campaign_submissions(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_submissions_theme_id ON campaign_submissions(campaign_theme_id);
CREATE INDEX IF NOT EXISTS idx_campaign_submissions_track_id ON campaign_submissions(track_id);
CREATE INDEX IF NOT EXISTS idx_campaign_submissions_submitted_by ON campaign_submissions(submitted_by);
CREATE INDEX IF NOT EXISTS idx_campaign_likes_campaign_id ON campaign_likes(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_likes_track_id ON campaign_likes(track_id);
CREATE INDEX IF NOT EXISTS idx_campaign_likes_user_id ON campaign_likes(user_id);

-- Enable RLS
ALTER TABLE campaign_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_likes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for campaign_themes
CREATE POLICY "campaign_themes_select_all" ON campaign_themes
  FOR SELECT USING (true);

CREATE POLICY "campaign_themes_insert_auth" ON campaign_themes
  FOR INSERT WITH CHECK (auth.uid() = submitted_by);

CREATE POLICY "campaign_themes_update_owner" ON campaign_themes
  FOR UPDATE USING (auth.uid() = submitted_by)
  WITH CHECK (auth.uid() = submitted_by);

CREATE POLICY "campaign_themes_delete_owner" ON campaign_themes
  FOR DELETE USING (auth.uid() = submitted_by);

-- RLS Policies for campaigns
CREATE POLICY "campaigns_select_all" ON campaigns
  FOR SELECT USING (true);

CREATE POLICY "campaigns_insert_admin" ON campaigns
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM profiles WHERE role = 'admin'
    )
  );

CREATE POLICY "campaigns_update_admin" ON campaigns
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT user_id FROM profiles WHERE role = 'admin'
    )
  )
  WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM profiles WHERE role = 'admin'
    )
  );

CREATE POLICY "campaigns_delete_admin" ON campaigns
  FOR DELETE USING (
    auth.uid() IN (
      SELECT user_id FROM profiles WHERE role = 'admin'
    )
  );

-- RLS Policies for campaign_submissions
CREATE POLICY "campaign_submissions_select_all" ON campaign_submissions
  FOR SELECT USING (true);

CREATE POLICY "campaign_submissions_insert_auth" ON campaign_submissions
  FOR INSERT WITH CHECK (auth.uid() = submitted_by);

CREATE POLICY "campaign_submissions_delete_owner" ON campaign_submissions
  FOR DELETE USING (
    auth.uid() = submitted_by OR
    auth.uid() IN (
      SELECT user_id FROM profiles WHERE role = 'admin'
    )
  );

-- RLS Policies for campaign_likes
CREATE POLICY "campaign_likes_select_all" ON campaign_likes
  FOR SELECT USING (true);

CREATE POLICY "campaign_likes_insert_auth" ON campaign_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "campaign_likes_delete_owner" ON campaign_likes
  FOR DELETE USING (
    auth.uid() = user_id OR
    auth.uid() IN (
      SELECT user_id FROM profiles WHERE role = 'admin'
    )
  );

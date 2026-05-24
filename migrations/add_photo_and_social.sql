-- Migration: Add photo_url to tracks and social media links to profiles
-- Date: 2026-05-24
-- Description: Add support for track thumbnails and artist social media links in ranking display

-- Add photo_url to tracks table
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- Add social media columns to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS twitter_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS instagram_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS facebook_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS threads_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS tiktok_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS youtube_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS discord_url TEXT;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tracks_photo_url ON tracks(photo_url);
CREATE INDEX IF NOT EXISTS idx_profiles_social ON profiles(twitter_url, instagram_url, youtube_url);

-- Add comments to explain the columns
COMMENT ON COLUMN tracks.photo_url IS 'Thumbnail image URL for the track';
COMMENT ON COLUMN profiles.twitter_url IS 'Artist Twitter/X profile URL';
COMMENT ON COLUMN profiles.instagram_url IS 'Artist Instagram profile URL';
COMMENT ON COLUMN profiles.facebook_url IS 'Artist Facebook profile URL';
COMMENT ON COLUMN profiles.threads_url IS 'Artist Threads profile URL';
COMMENT ON COLUMN profiles.tiktok_url IS 'Artist TikTok profile URL';
COMMENT ON COLUMN profiles.youtube_url IS 'Artist YouTube channel URL';
COMMENT ON COLUMN profiles.discord_url IS 'Artist Discord server URL';

-- Supabase Migration: SNS Links & Comments Feature
-- 実行場所：Supabase ダッシュボード → SQL エディタ

-- 1️⃣ tracks テーブルに SNS リンク用カラムを追加
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS artist_social_url TEXT;

-- 2️⃣ comments テーブルを新規作成
CREATE TABLE IF NOT EXISTS comments (
  id BIGSERIAL PRIMARY KEY,
  track_id BIGINT NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3️⃣ インデックスを作成（検索パフォーマンス向上）
CREATE INDEX IF NOT EXISTS idx_comments_track_id ON comments(track_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);

-- 4️⃣ RLS（Row Level Security）ポリシーを設定
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- 読み取り：誰でも可能
CREATE POLICY "Anyone can read comments" ON comments
  FOR SELECT USING (true);

-- 作成：認証ユーザーのみ
CREATE POLICY "Authenticated users can insert comments" ON comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 更新：自分のコメントのみ
CREATE POLICY "Users can update own comments" ON comments
  FOR UPDATE USING (auth.uid() = user_id);

-- 削除：自分のコメントのみ
CREATE POLICY "Users can delete own comments" ON comments
  FOR DELETE USING (auth.uid() = user_id);

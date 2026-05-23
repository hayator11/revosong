-- Supabase Migration: Comments Feature Setup
-- 実行場所：Supabase ダッシュボード → SQL エディタ

-- =====================================
-- 1️⃣ Comments Table 作成
-- =====================================
CREATE TABLE IF NOT EXISTS public.comments (
  id BIGSERIAL PRIMARY KEY,
  track_id BIGINT NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) > 0 AND char_length(content) <= 500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================
-- 2️⃣ Indexes for Performance
-- =====================================
CREATE INDEX IF NOT EXISTS idx_comments_track_id ON public.comments(track_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON public.comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_track_created ON public.comments(track_id, created_at DESC);

-- =====================================
-- 3️⃣ Profiles Table (for user info)
-- =====================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  username TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================
-- 4️⃣ Enable RLS on comments table
-- =====================================
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- 読み取り：誰でも可能
CREATE POLICY "Anyone can read comments" ON public.comments
  FOR SELECT USING (true);

-- 作成：認証ユーザーのみ
CREATE POLICY "Authenticated users can insert comments" ON public.comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 更新：自分のコメントのみ
CREATE POLICY "Users can update own comments" ON public.comments
  FOR UPDATE USING (auth.uid() = user_id);

-- 削除：自分のコメントのみ
CREATE POLICY "Users can delete own comments" ON public.comments
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================
-- 5️⃣ Enable RLS on profiles table
-- =====================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 読み取り：誰でも可能
CREATE POLICY "Profiles are readable by everyone" ON public.profiles
  FOR SELECT USING (true);

-- 作成/更新：自分のプロフィールのみ
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- =====================================
-- 6️⃣ Trigger to auto-create profile
-- =====================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- =====================================
-- 7️⃣ Helper View for Comments with User Info
-- =====================================
CREATE OR REPLACE VIEW public.comments_with_users AS
SELECT
  c.id,
  c.track_id,
  c.user_id,
  c.content,
  c.created_at,
  c.updated_at,
  COALESCE(p.email, 'Anonymous') as user_email
FROM public.comments c
LEFT JOIN public.profiles p ON c.user_id = p.id;

-- =====================================
-- 8️⃣ Verification Queries (optional)
-- =====================================
-- Check if comments table was created:
-- SELECT table_name FROM information_schema.tables
-- WHERE table_schema = 'public' AND table_name = 'comments';

-- Check if profiles table was created:
-- SELECT table_name FROM information_schema.tables
-- WHERE table_schema = 'public' AND table_name = 'profiles';

-- Check comments with user info:
-- SELECT * FROM public.comments_with_users LIMIT 5;

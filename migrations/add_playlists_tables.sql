-- ============================================================================
-- Personal Playlists Feature - Database Migration
-- ============================================================================
-- 実行場所：Supabase ダッシュボード → SQL エディタ
--
-- 以下の機能をセットアップします：
-- 1. Playlists テーブル - ユーザーのプレイリストメタデータ
-- 2. Playlist Items テーブル - プレイリスト内のアイテム（DB トラック＋外部 URL）
-- 3. Playlist Stats テーブル - プレイリストエンゲージメント統計
-- 4. RLS ポリシー
-- 5. インデックス
-- ============================================================================

-- ============================================================================
-- ステップ 1: Playlists テーブルを作成
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.playlists (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL CHECK (char_length(title) > 0 AND char_length(title) <= 255),
  description TEXT CHECK (char_length(description) <= 1000),
  cover_image_url TEXT,
  is_public BOOLEAN DEFAULT false,
  play_count BIGINT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- ステップ 2: Playlist Items テーブルを作成（ハイブリッドモデル）
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.playlist_items (
  id BIGSERIAL PRIMARY KEY,
  playlist_id BIGINT NOT NULL REFERENCES public.playlists(id) ON DELETE CASCADE,
  track_id BIGINT REFERENCES public.tracks(id) ON DELETE CASCADE,
  external_url TEXT,
  external_title TEXT CHECK (char_length(external_title) <= 255),
  external_artist TEXT CHECK (char_length(external_artist) <= 255),
  external_thumbnail_url TEXT,
  external_service TEXT CHECK (external_service IN ('youtube', 'spotify', 'soundcloud', 'niconico', 'bandcamp', 'audiomack')),
  music_type VARCHAR(20) CHECK (music_type IN ('audio', 'video')),
  order_index BIGINT NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- 制約：track_id と external_url のどちらか一方だけが null でない
  CONSTRAINT one_of_track_or_url CHECK (
    (track_id IS NOT NULL AND external_url IS NULL) OR
    (track_id IS NULL AND external_url IS NOT NULL)
  ),

  -- 制約：external_url が null でない場合、external_service は null でない
  CONSTRAINT external_requires_service CHECK (
    (external_url IS NULL) OR (external_service IS NOT NULL)
  ),

  -- 制約：同一プレイリスト内で同じアイテムは重複できない
  UNIQUE(playlist_id, track_id) WHERE track_id IS NOT NULL,
  UNIQUE(playlist_id, external_url) WHERE external_url IS NOT NULL
);

-- ============================================================================
-- ステップ 3: Playlist Stats テーブルを作成（オプション、アナリティクス用）
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.playlist_stats (
  id BIGSERIAL PRIMARY KEY,
  playlist_item_id BIGINT NOT NULL REFERENCES public.playlist_items(id) ON DELETE CASCADE,
  played_count BIGINT DEFAULT 0,
  likes_count BIGINT DEFAULT 0,
  last_played_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(playlist_item_id)
);

-- ============================================================================
-- ステップ 4: インデックスを作成（パフォーマンス向上）
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_playlists_user_id ON public.playlists(user_id);
CREATE INDEX IF NOT EXISTS idx_playlists_created_at ON public.playlists(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_playlists_is_public ON public.playlists(is_public) WHERE is_public = true;

CREATE INDEX IF NOT EXISTS idx_playlist_items_playlist_id ON public.playlist_items(playlist_id);
CREATE INDEX IF NOT EXISTS idx_playlist_items_track_id ON public.playlist_items(track_id);
CREATE INDEX IF NOT EXISTS idx_playlist_items_order ON public.playlist_items(playlist_id, order_index);
CREATE INDEX IF NOT EXISTS idx_playlist_items_music_type ON public.playlist_items(music_type);

CREATE INDEX IF NOT EXISTS idx_playlist_stats_playlist_item_id ON public.playlist_stats(playlist_item_id);

-- ============================================================================
-- ステップ 5: Playlists テーブルで RLS（Row Level Security）を有効化
-- ============================================================================
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;

-- ポリシー 1: 認証ユーザーは自分のプレイリストを読み取り
DROP POLICY IF EXISTS "Users can read own playlists" ON public.playlists;
CREATE POLICY "Users can read own playlists" ON public.playlists
  FOR SELECT USING (auth.uid() = user_id OR is_public = true);

-- ポリシー 2: 認証ユーザーは自分のプレイリストを作成
DROP POLICY IF EXISTS "Users can create own playlists" ON public.playlists;
CREATE POLICY "Users can create own playlists" ON public.playlists
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ポリシー 3: ユーザーは自分のプレイリストのみ更新
DROP POLICY IF EXISTS "Users can update own playlists" ON public.playlists;
CREATE POLICY "Users can update own playlists" ON public.playlists
  FOR UPDATE USING (auth.uid() = user_id);

-- ポリシー 4: ユーザーは自分のプレイリストのみ削除
DROP POLICY IF EXISTS "Users can delete own playlists" ON public.playlists;
CREATE POLICY "Users can delete own playlists" ON public.playlists
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- ステップ 6: Playlist Items テーブルで RLS を有効化
-- ============================================================================
ALTER TABLE public.playlist_items ENABLE ROW LEVEL SECURITY;

-- ポリシー 1: ユーザーはアクセス可能なプレイリストのアイテムを読み取り
DROP POLICY IF EXISTS "Users can read playlist items" ON public.playlist_items;
CREATE POLICY "Users can read playlist items" ON public.playlist_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.playlists
      WHERE playlists.id = playlist_id
      AND (playlists.user_id = auth.uid() OR playlists.is_public = true)
    )
  );

-- ポリシー 2: ユーザーは自分のプレイリストにアイテムを追加
DROP POLICY IF EXISTS "Users can add playlist items" ON public.playlist_items;
CREATE POLICY "Users can add playlist items" ON public.playlist_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.playlists
      WHERE playlists.id = playlist_id AND playlists.user_id = auth.uid()
    )
  );

-- ポリシー 3: ユーザーは自分のプレイリストのアイテムを更新
DROP POLICY IF EXISTS "Users can update playlist items" ON public.playlist_items;
CREATE POLICY "Users can update playlist items" ON public.playlist_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.playlists
      WHERE playlists.id = playlist_id AND playlists.user_id = auth.uid()
    )
  );

-- ポリシー 4: ユーザーは自分のプレイリストのアイテムを削除
DROP POLICY IF EXISTS "Users can delete playlist items" ON public.playlist_items;
CREATE POLICY "Users can delete playlist items" ON public.playlist_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.playlists
      WHERE playlists.id = playlist_id AND playlists.user_id = auth.uid()
    )
  );

-- ============================================================================
-- ステップ 7: Playlist Stats テーブルで RLS を有効化
-- ============================================================================
ALTER TABLE public.playlist_stats ENABLE ROW LEVEL SECURITY;

-- ポリシー 1: ユーザーはアクセス可能なプレイリストの統計を読み取り
DROP POLICY IF EXISTS "Users can read playlist stats" ON public.playlist_stats;
CREATE POLICY "Users can read playlist stats" ON public.playlist_stats
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.playlist_items pi
      JOIN public.playlists p ON pi.playlist_id = p.id
      WHERE pi.id = playlist_item_id
      AND (p.user_id = auth.uid() OR p.is_public = true)
    )
  );

-- ============================================================================
-- ステップ 8: ビューを作成（プレイリストアイテムの詳細情報）
-- ============================================================================
DROP VIEW IF EXISTS public.playlist_items_with_details CASCADE;
CREATE VIEW public.playlist_items_with_details AS
SELECT
  pi.id,
  pi.playlist_id,
  pi.track_id,
  pi.external_url,
  pi.external_title,
  pi.external_artist,
  pi.external_thumbnail_url,
  pi.external_service,
  pi.music_type,
  pi.order_index,
  pi.added_at,
  -- Track 情報（DB トラックの場合）
  COALESCE(t.title, pi.external_title) as title,
  COALESCE(t.artist_name, pi.external_artist) as artist,
  COALESCE(t.external_url, pi.external_url) as url,
  COALESCE(t.ai_tool, NULL) as ai_tool,
  COALESCE(t.genre, NULL) as genre,
  -- サムネイル（DB トラックの場合）
  t.id as track_photo_id,
  pi.external_thumbnail_url as thumbnail_url
FROM public.playlist_items pi
LEFT JOIN public.tracks t ON pi.track_id = t.id;

-- ============================================================================
-- ステップ 9: 更新トリガーを作成（updated_at の自動更新）
-- ============================================================================
CREATE OR REPLACE FUNCTION public.update_playlists_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_playlists_updated_at ON public.playlists;
CREATE TRIGGER update_playlists_updated_at
  BEFORE UPDATE ON public.playlists
  FOR EACH ROW
  EXECUTE FUNCTION public.update_playlists_updated_at();

-- ============================================================================
-- 完了メッセージ
-- ============================================================================
-- SELECT 'Playlists feature setup completed successfully!' as message;

-- ============================================================================
-- ユーザーアクティビティ追跡機能
-- ============================================================================
-- 実行場所：Supabase ダッシュボード → SQL エディタ
--
-- 以下の機能をセットアップします：
-- 1. user_sessions テーブル - ログイン/ログアウト時刻
-- 2. access_logs テーブル - API呼び出しログ
-- 3. profiles テーブルに last_activity カラム追加
-- ============================================================================

-- ============================================================================
-- ステップ 1: Profiles テーブルに last_activity を追加
-- ============================================================================
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- ============================================================================
-- ステップ 2: User Sessions テーブル作成
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_start TIMESTAMP WITH TIME ZONE NOT NULL,
  session_end TIMESTAMP WITH TIME ZONE,
  duration_minutes BIGINT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- ステップ 3: Access Logs テーブル作成
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.access_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  endpoint TEXT NOT NULL,
  method VARCHAR(10) NOT NULL,
  status_code INT,
  response_time_ms INT,
  ip_address TEXT,
  user_agent TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- ステップ 4: インデックス作成（パフォーマンス向上）
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_start ON public.user_sessions(session_start DESC);
CREATE INDEX IF NOT EXISTS idx_user_sessions_duration ON public.user_sessions(duration_minutes);

CREATE INDEX IF NOT EXISTS idx_access_logs_user_id ON public.access_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_access_logs_timestamp ON public.access_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_access_logs_endpoint ON public.access_logs(endpoint);

CREATE INDEX IF NOT EXISTS idx_profiles_last_activity ON public.profiles(last_activity DESC);

-- ============================================================================
-- ステップ 5: user_sessions テーブルで RLS を有効化
-- ============================================================================
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- ポリシー 1: 認証ユーザーは自分のセッションを見られる
DROP POLICY IF EXISTS "Users can read own sessions" ON public.user_sessions;
CREATE POLICY "Users can read own sessions" ON public.user_sessions
  FOR SELECT USING (auth.uid() = user_id);

-- ポリシー 2: システムが セッション作成（サービスロール用）
DROP POLICY IF EXISTS "Service role can insert sessions" ON public.user_sessions;
CREATE POLICY "Service role can insert sessions" ON public.user_sessions
  FOR INSERT WITH CHECK (true);

-- ============================================================================
-- ステップ 6: access_logs テーブルで RLS を有効化
-- ============================================================================
ALTER TABLE public.access_logs ENABLE ROW LEVEL SECURITY;

-- ポリシー 1: ユーザーは自分のログを見られない（管理者のみ）
-- このテーブルはシステムが自動的に記録するため、ユーザーは読み取り不可

-- ============================================================================
-- ステップ 7: ユーティリティ関数
-- ============================================================================

-- セッション終了関数
CREATE OR REPLACE FUNCTION public.end_user_session(
  session_id BIGINT,
  end_time TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
RETURNS VOID AS $$
BEGIN
  UPDATE public.user_sessions
  SET
    session_end = end_time,
    duration_minutes = EXTRACT(EPOCH FROM (end_time - session_start)) / 60
  WHERE id = session_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

-- last_activity を更新する関数
CREATE OR REPLACE FUNCTION public.update_user_activity(
  user_id_param UUID
)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles
  SET last_activity = NOW()
  WHERE id = user_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

-- ============================================================================
-- ステップ 8: ビュー作成（統計用）
-- ============================================================================

-- 日別セッション統計ビュー
DROP VIEW IF EXISTS public.daily_session_stats CASCADE;
CREATE VIEW public.daily_session_stats AS
SELECT
  DATE(session_start) as date,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(*) as total_sessions,
  ROUND(AVG(duration_minutes)::NUMERIC, 2) as avg_duration_minutes,
  MAX(duration_minutes) as max_duration_minutes,
  MIN(duration_minutes) as min_duration_minutes,
  ROUND(SUM(duration_minutes)::NUMERIC, 0) as total_duration_minutes
FROM public.user_sessions
WHERE session_end IS NOT NULL
GROUP BY DATE(session_start)
ORDER BY date DESC;

-- 日別アクセス統計ビュー
DROP VIEW IF EXISTS public.daily_access_stats CASCADE;
CREATE VIEW public.daily_access_stats AS
SELECT
  DATE(timestamp) as date,
  COUNT(*) as total_requests,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(DISTINCT endpoint) as endpoints,
  ROUND(AVG(response_time_ms)::NUMERIC, 2) as avg_response_time_ms
FROM public.access_logs
GROUP BY DATE(timestamp)
ORDER BY date DESC;

-- 現在のアクティブユーザー数（過去5分）
DROP VIEW IF EXISTS public.current_active_users CASCADE;
CREATE VIEW public.current_active_users AS
SELECT
  COUNT(DISTINCT id) as active_user_count,
  COUNT(DISTINCT CASE WHEN last_activity >= NOW() - INTERVAL '1 minute' THEN id END) as very_active_count
FROM public.profiles
WHERE last_activity >= NOW() - INTERVAL '5 minutes';

-- エンドポイント別統計ビュー
DROP VIEW IF EXISTS public.endpoint_stats CASCADE;
CREATE VIEW public.endpoint_stats AS
SELECT
  endpoint,
  method,
  COUNT(*) as request_count,
  ROUND(AVG(response_time_ms)::NUMERIC, 2) as avg_response_time_ms,
  COUNT(DISTINCT user_id) as unique_users,
  ROUND(COUNT(CASE WHEN status_code >= 400 THEN 1 END)::NUMERIC / COUNT(*) * 100, 2) as error_rate_percent
FROM public.access_logs
GROUP BY endpoint, method
ORDER BY request_count DESC;

-- ============================================================================
-- ステップ 9: 時系列統計関数
-- ============================================================================

-- 過去N日間のセッション統計を取得
CREATE OR REPLACE FUNCTION public.get_session_stats(days INT DEFAULT 30)
RETURNS TABLE(
  date DATE,
  unique_users BIGINT,
  total_sessions BIGINT,
  avg_duration_minutes NUMERIC,
  total_duration_minutes BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    DATE(us.session_start) as date,
    COUNT(DISTINCT us.user_id)::BIGINT as unique_users,
    COUNT(*)::BIGINT as total_sessions,
    ROUND(AVG(us.duration_minutes)::NUMERIC, 2) as avg_duration_minutes,
    ROUND(SUM(us.duration_minutes)::NUMERIC, 0)::BIGINT as total_duration_minutes
  FROM public.user_sessions us
  WHERE us.session_end IS NOT NULL
    AND DATE(us.session_start) >= CURRENT_DATE - INTERVAL '1 day' * days
  GROUP BY DATE(us.session_start)
  ORDER BY date DESC;
END;
$$ LANGUAGE plpgsql;

-- 過去N日間のアクセス統計を取得
CREATE OR REPLACE FUNCTION public.get_access_stats(days INT DEFAULT 30)
RETURNS TABLE(
  date DATE,
  total_requests BIGINT,
  unique_users BIGINT,
  avg_response_time_ms NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    DATE(al.timestamp) as date,
    COUNT(*)::BIGINT as total_requests,
    COUNT(DISTINCT al.user_id)::BIGINT as unique_users,
    ROUND(AVG(al.response_time_ms)::NUMERIC, 2) as avg_response_time_ms
  FROM public.access_logs al
  WHERE DATE(al.timestamp) >= CURRENT_DATE - INTERVAL '1 day' * days
  GROUP BY DATE(al.timestamp)
  ORDER BY date DESC;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- ステップ 10: 定期削除ジョブ（3ヶ月以上前のログを自動削除）
-- ============================================================================
CREATE OR REPLACE FUNCTION public.cleanup_old_logs()
RETURNS TABLE(
  sessions_deleted BIGINT,
  access_logs_deleted BIGINT
) AS $$
DECLARE
  v_sessions_deleted BIGINT;
  v_access_logs_deleted BIGINT;
BEGIN
  -- 90日以上前のセッションログを削除
  DELETE FROM public.user_sessions
  WHERE created_at < NOW() - INTERVAL '90 days';
  GET DIAGNOSTICS v_sessions_deleted = ROW_COUNT;

  -- 30日以上前のアクセスログを削除
  DELETE FROM public.access_logs
  WHERE timestamp < NOW() - INTERVAL '30 days';
  GET DIAGNOSTICS v_access_logs_deleted = ROW_COUNT;

  RETURN QUERY SELECT v_sessions_deleted, v_access_logs_deleted;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

-- ============================================================================
-- ステップ 11: 現在のアクティブユーザー数を取得する関数
-- ============================================================================
CREATE OR REPLACE FUNCTION public.get_active_users_count(
  minutes_threshold INT DEFAULT 5
)
RETURNS TABLE(
  active_count BIGINT,
  very_active_count BIGINT,
  idle_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(DISTINCT p.id)::BIGINT as active_count,
    COUNT(DISTINCT CASE WHEN p.last_activity >= NOW() - INTERVAL '1 minute' THEN p.id END)::BIGINT as very_active_count,
    COUNT(DISTINCT CASE WHEN p.last_activity < NOW() - INTERVAL '5 minutes' AND p.last_activity >= NOW() - INTERVAL '1 day' THEN p.id END)::BIGINT as idle_count
  FROM public.profiles p
  WHERE p.last_activity >= NOW() - INTERVAL '1 day' * minutes_threshold;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- ステップ 12: 使用時間統計関数
-- ============================================================================
CREATE OR REPLACE FUNCTION public.get_user_time_stats(days INT DEFAULT 30)
RETURNS TABLE(
  metric_name TEXT,
  metric_value NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 'Average Daily Usage Minutes'::TEXT as metric_name,
    ROUND(AVG(daily_total.total_duration)::NUMERIC, 2) as metric_value
  FROM (
    SELECT DATE(session_start) as date,
           SUM(duration_minutes) as total_duration
    FROM public.user_sessions
    WHERE session_end IS NOT NULL
      AND DATE(session_start) >= CURRENT_DATE - INTERVAL '1 day' * days
    GROUP BY DATE(session_start)
  ) daily_total
  UNION ALL
  SELECT 'Median Daily Usage Minutes'::TEXT as metric_name,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY total_duration)::NUMERIC as metric_value
  FROM (
    SELECT DATE(session_start) as date,
           SUM(duration_minutes) as total_duration
    FROM public.user_sessions
    WHERE session_end IS NOT NULL
      AND DATE(session_start) >= CURRENT_DATE - INTERVAL '1 day' * days
    GROUP BY DATE(session_start)
  ) daily_total
  UNION ALL
  SELECT 'Max Daily Usage Minutes'::TEXT as metric_name,
    MAX(total_duration)::NUMERIC as metric_value
  FROM (
    SELECT DATE(session_start) as date,
           SUM(duration_minutes) as total_duration
    FROM public.user_sessions
    WHERE session_end IS NOT NULL
      AND DATE(session_start) >= CURRENT_DATE - INTERVAL '1 day' * days
    GROUP BY DATE(session_start)
  ) daily_total;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 完了
-- ============================================================================
-- SELECT 'Activity tracking setup completed!' as message;

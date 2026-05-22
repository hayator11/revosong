"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

type Track = {
  id: number;
  title: string;
  artist_name: string;
  ai_tool: string;
  genre: string;
  prompt: string | null;
  external_url: string | null;
  play_count: number;
  created_at: string;
  like_count: number;
  liked: boolean;
};

type User = { id: string; email?: string } | null;

const AI_TOOLS = ["Suno", "Udio", "MusicLM", "Stable Audio"];
const GENRES = [
  "Synthwave", "Lo-Fi", "Cinematic", "City Pop", "Classical",
  "Future Bass", "Ambient", "J-Pop", "Rock", "EDM",
  "Hip Hop", "R&B", "Jazz", "Folk",
];
const FILTERS = ["すべて", "Suno", "Udio", "MusicLM", "Stable Audio"];

function formatNumber(n: number) {
  if (n >= 10000) return (n / 10000).toFixed(1) + "万";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toString();
}

export default function Home() {
  const [user, setUser] = useState<User>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [filter, setFilter] = useState("すべて");
  const [showUpload, setShowUpload] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser({ id: data.user.id, email: data.user.email ?? "" });
      }
    });
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser({ id: session.user.id, email: session.user.email ?? "" });
          setShowAuth(false);
        } else {
          setUser(null);
        }
      }
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  const fetchTracks = useCallback(async () => {
    setLoading(true);
    const { data: trackData } = await supabase
      .from("track_rankings")
      .select("*")
      .order("like_count", { ascending: false });

    if (trackData) {
      let likedIds: number[] = [];
      if (user) {
        const { data: likesData } = await supabase
          .from("likes")
          .select("track_id")
          .eq("user_id", user.id);
        likedIds = (likesData ?? []).map(
          (l: { track_id: number }) => l.track_id
        );
      }
      setTracks(
        trackData.map((t: Record<string, unknown>) => ({
          ...t,
          liked: likedIds.includes(t.id as number),
        })) as Track[]
      );
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchTracks();
  }, [fetchTracks]);

  const toggleLike = async (trackId: number) => {
    if (!user) {
      setShowAuth(true);
      return;
    }
    const track = tracks.find((t) => t.id === trackId);
    if (!track) return;

    if (track.liked) {
      await supabase
        .from("likes")
        .delete()
        .eq("user_id", user.id)
        .eq("track_id", trackId);
    } else {
      await supabase
        .from("likes")
        .insert({ user_id: user.id, track_id: trackId });
    }
    fetchTracks();
  };

  const filtered = tracks.filter(
    (t) => filter === "すべて" || t.ai_tool === filter
  );
  const totalPlays = tracks.reduce((s, t) => s + t.play_count, 0);
  const totalLikes = tracks.reduce((s, t) => s + t.like_count, 0);

  return (
    <div className="app-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&family=Noto+Sans+JP:wght@400;500;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #0a0a0f; }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .app-root {
          min-height: 100vh;
          background: #0a0a0f;
          color: #fff;
          font-family: 'Noto Sans JP', sans-serif;
        }
        .hero {
          position: relative;
          padding: 40px 24px 20px;
          text-align: center;
        }
        .hero-bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 50% 0%, rgba(255,45,85,0.15) 0%, transparent 60%);
          pointer-events: none;
        }
        .hero-title {
          font-family: 'Oswald', sans-serif;
          font-size: 36px;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          background: linear-gradient(135deg, #ff2d55, #ff9500, #5e5ce6, #ff2d55);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradientShift 6s ease infinite;
        }
        .hero-sub {
          margin-top: 6px;
          font-size: 13px;
          color: rgba(255,255,255,0.4);
          letter-spacing: 2px;
        }
        .top-buttons {
          position: absolute;
          top: 20px;
          right: 20px;
          display: flex;
          gap: 8px;
        }
        .btn-upload {
          padding: 8px 18px;
          border-radius: 24px;
          background: linear-gradient(135deg, #ff2d55, #ff6482);
          border: none;
          color: #fff;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'Noto Sans JP', sans-serif;
        }
        .btn-logout {
          padding: 8px 14px;
          border-radius: 24px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.6);
          font-size: 12px;
          cursor: pointer;
          font-family: 'Noto Sans JP', sans-serif;
        }
        .btn-login {
          padding: 8px 18px;
          border-radius: 24px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          color: #fff;
          font-size: 13px;
          cursor: pointer;
          font-family: 'Noto Sans JP', sans-serif;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          padding: 16px 24px;
        }
        .stat-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          padding: 14px 10px;
          text-align: center;
        }
        .stat-value {
          font-family: 'Oswald', sans-serif;
          font-size: 22px;
          font-weight: 700;
          background: linear-gradient(135deg, #ff2d55, #ff9500);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .stat-label {
          font-size: 10px;
          color: rgba(255,255,255,0.3);
          margin-top: 3px;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        .filters {
          display: flex;
          gap: 6px;
          padding: 12px 24px;
          overflow-x: auto;
        }
        .filter-chip {
          padding: 5px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
          flex-shrink: 0;
          transition: all 0.25s;
        }
        .filter-chip-off {
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.5);
        }
        .filter-chip-on {
          border: 1px solid rgba(255,45,85,0.5);
          background: rgba(255,45,85,0.15);
          color: #ff2d55;
        }
        .track-list {
          padding: 8px 16px 120px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .track-row {
          display: grid;
          grid-template-columns: 36px 1fr auto;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 12px;
          opacity: 0;
        }
        .track-row:hover {
          background: rgba(255,255,255,0.04);
        }
        .rank-medal {
          font-size: 28px;
          text-align: center;
          line-height: 1;
        }
        .rank-num {
          font-family: 'Oswald', sans-serif;
          font-size: 22px;
          font-weight: 700;
          color: rgba(255,255,255,0.2);
          text-align: center;
        }
        .track-title {
          font-size: 14px;
          font-weight: 700;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .track-meta {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 2px;
          font-size: 11px;
          color: rgba(255,255,255,0.35);
        }
        .ai-badge {
          padding: 1px 6px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 600;
          background: rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.5);
        }
        .like-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
        }
        .like-btn:hover {
          transform: scale(1.1);
        }
        .like-count {
          font-size: 12px;
          font-weight: 600;
          color: rgba(255,255,255,0.5);
        }
        .like-count-active {
          color: #ff2d55;
        }
        .empty-state {
          text-align: center;
          padding: 48px 24px;
          color: rgba(255,255,255,0.3);
        }
        .loading-state {
          text-align: center;
          padding: 48px;
          color: rgba(255,255,255,0.3);
        }
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          padding: 24px;
        }
        .modal-card {
          background: #1a1a24;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          width: 100%;
          max-width: 420px;
          max-height: 85vh;
          overflow-y: auto;
          padding: 24px;
        }
        .modal-title {
          font-size: 17px;
          font-weight: 700;
          margin-bottom: 16px;
        }
        .field-label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: rgba(255,255,255,0.5);
          margin: 14px 0 6px;
        }
        .field-input {
          width: 100%;
          padding: 10px 14px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          color: #fff;
          font-size: 14px;
          outline: none;
          font-family: 'Noto Sans JP', sans-serif;
        }
        .field-input:focus {
          border-color: rgba(255,45,85,0.5);
        }
        .field-input::placeholder {
          color: rgba(255,255,255,0.2);
        }
        .chip-select {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .select-chip {
          padding: 5px 12px;
          border-radius: 16px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .select-chip-off {
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.5);
        }
        .select-chip-on {
          border: 1px solid rgba(255,45,85,0.5);
          background: rgba(255,45,85,0.15);
          color: #ff2d55;
        }
        .btn-primary {
          padding: 12px;
          border-radius: 12px;
          background: linear-gradient(135deg, #ff2d55, #ff6482);
          border: none;
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'Noto Sans JP', sans-serif;
        }
        .btn-primary:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .btn-cancel {
          padding: 12px;
          border-radius: 12px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.7);
          font-size: 14px;
          cursor: pointer;
          font-family: 'Noto Sans JP', sans-serif;
        }
        .error-box {
          padding: 8px 12px;
          border-radius: 8px;
          background: rgba(255,59,48,0.15);
          color: #ff3b30;
          font-size: 13px;
          margin-bottom: 12px;
        }
        .success-box {
          padding: 8px 12px;
          border-radius: 8px;
          background: rgba(48,209,88,0.15);
          color: #30d158;
          font-size: 13px;
          margin-bottom: 12px;
        }
        .auth-switch {
          text-align: center;
          font-size: 13px;
          color: rgba(255,255,255,0.4);
          margin-top: 12px;
        }
        .auth-switch-link {
          color: #ff2d55;
          cursor: pointer;
          margin-left: 4px;
        }
      `}</style>

      <header className="hero">
        <div className="hero-bg" />
        <h1 className="hero-title">AI MUSIC CHARTS</h1>
        <p className="hero-sub">AI生成楽曲ランキング</p>
        <div className="top-buttons">
          {user ? (
            <>
              <button className="btn-upload" onClick={() => setShowUpload(true)}>
                + 投稿
              </button>
              <button
                className="btn-logout"
                onClick={async () => {
                  await supabase.auth.signOut();
                  setUser(null);
                }}
              >
                ログアウト
              </button>
            </>
          ) : (
            <button className="btn-login" onClick={() => setShowAuth(true)}>
              ログイン
            </button>
          )}
        </div>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{formatNumber(tracks.length)}</div>
          <div className="stat-label">楽曲数</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{formatNumber(totalPlays)}</div>
          <div className="stat-label">総再生数</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{formatNumber(totalLikes)}</div>
          <div className="stat-label">総いいね</div>
        </div>
      </div>

      <div className="filters">
        {FILTERS.map((f) => (
          <div
            key={f}
            className={`filter-chip ${filter === f ? "filter-chip-on" : "filter-chip-off"}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </div>
        ))}
      </div>

      <div className="track-list">
        {loading ? (
          <div className="loading-state">読み込み中...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎵</div>
            <div>まだ楽曲がありません</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>
              最初の投稿者になろう！
            </div>
          </div>
        ) : (
          filtered.map((track, i) => (
            <div
              key={track.id}
              className="track-row"
              style={{
                animation: `fadeIn 0.4s ease ${i * 0.05}s forwards`,
              }}
            >
              {i === 0 ? (
                <span className="rank-medal">🥇</span>
              ) : i === 1 ? (
                <span className="rank-medal">🥈</span>
              ) : i === 2 ? (
                <span className="rank-medal">🥉</span>
              ) : (
                <span className="rank-num">{i + 1}</span>
              )}
              <div style={{ minWidth: 0 }}>
                <div className="track-title">{track.title}</div>
                <div className="track-meta">
                  <span className="ai-badge">{track.ai_tool}</span>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>
                    {track.genre}
                  </span>
                  <span>·</span>
                  <span>{track.artist_name}</span>
                </div>
              </div>
              <button className="like-btn" onClick={() => toggleLike(track.id)}>
                <svg
                  width={18}
                  height={18}
                  viewBox="0 0 24 24"
                  fill={track.liked ? "#ff2d55" : "none"}
                  stroke={track.liked ? "#ff2d55" : "rgba(255,255,255,0.4)"}
                  strokeWidth={2}
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                <span
                  className={`like-count ${track.liked ? "like-count-active" : ""}`}
                >
                  {formatNumber(track.like_count)}
                </span>
              </button>
            </div>
          ))
        )}
      </div>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      {showUpload && user && (
        <UploadModal
          user={user}
          onClose={() => setShowUpload(false)}
          onDone={fetchTracks}
        />
      )}
    </div>
  );
}

function AuthModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    setError("");
    setMessage("");
    if (isSignUp) {
      const { error: err } = await supabase.auth.signUp({ email, password });
      if (err) setError(err.message);
      else setMessage("確認メールを送信しました！メールを確認してください。");
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (err) setError(err.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">
          {isSignUp ? "新規登録" : "ログイン"}
        </h3>
        {error && <div className="error-box">{error}</div>}
        {message && <div className="success-box">{message}</div>}

        <div className="field-label">メールアドレス</div>
        <input
          className="field-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />

        <div className="field-label" style={{ marginTop: 12 }}>
          パスワード
        </div>
        <input
          className="field-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="6文字以上"
        />

        <button
          className="btn-primary"
          onClick={handleSubmit}
          style={{ width: "100%", marginTop: 16 }}
        >
          {isSignUp ? "登録する" : "ログイン"}
        </button>

        <div className="auth-switch">
          {isSignUp ? "アカウントをお持ちの方は" : "アカウントがない方は"}
          <span
            className="auth-switch-link"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError("");
              setMessage("");
            }}
          >
            {isSignUp ? "ログイン" : "新規登録"}
          </span>
        </div>
      </div>
    </div>
  );
}

function UploadModal({
  user,
  onClose,
  onDone,
}: {
  user: { id: string };
  onClose: () => void;
  onDone: () => void;
}) {
  const [form, setForm] = useState({
    title: "",
    artist_name: "",
    ai_tool: "Suno",
    genre: "Synthwave",
    prompt: "",
    external_url: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const update = (k: string, v: string) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const handleSubmit = async () => {
    if (!form.title || !form.artist_name) return;
    setSubmitting(true);
    await supabase.from("tracks").insert({
      user_id: user.id,
      title: form.title,
      artist_name: form.artist_name,
      ai_tool: form.ai_tool,
      genre: form.genre,
      prompt: form.prompt || null,
      external_url: form.external_url || null,
    });
    setSubmitting(false);
    setDone(true);
    onDone();
    setTimeout(onClose, 1500);
  };

  if (done) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div
          className="modal-card"
          style={{ textAlign: "center", padding: "48px 24px" }}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>投稿完了！</div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">楽曲を投稿</h3>

        <div className="field-label">曲名 *</div>
        <input
          className="field-input"
          placeholder="例: Neon Drift"
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
        />

        <div className="field-label">アーティスト名 *</div>
        <input
          className="field-input"
          placeholder="例: あなたのニックネーム"
          value={form.artist_name}
          onChange={(e) => update("artist_name", e.target.value)}
        />

        <div className="field-label">使用AIツール</div>
        <div className="chip-select">
          {AI_TOOLS.map((t) => (
            <div
              key={t}
              className={`select-chip ${form.ai_tool === t ? "select-chip-on" : "select-chip-off"}`}
              onClick={() => update("ai_tool", t)}
            >
              {t}
            </div>
          ))}
        </div>

        <div className="field-label">ジャンル</div>
        <div className="chip-select">
          {GENRES.map((g) => (
            <div
              key={g}
              className={`select-chip ${form.genre === g ? "select-chip-on" : "select-chip-off"}`}
              onClick={() => update("genre", g)}
            >
              {g}
            </div>
          ))}
        </div>

        <div className="field-label">URL（YouTube / SoundCloud等）</div>
        <input
          className="field-input"
          placeholder="https://..."
          value={form.external_url}
          onChange={(e) => update("external_url", e.target.value)}
        />

        <div className="field-label">使用したプロンプト（任意）</div>
        <textarea
          className="field-input"
          style={{ minHeight: 60, resize: "vertical" }}
          placeholder="どんなプロンプトで生成しましたか？"
          value={form.prompt}
          onChange={(e) => update("prompt", e.target.value)}
        />

        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button className="btn-cancel" onClick={onClose} style={{ flex: 1 }}>
            キャンセル
          </button>
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={!form.title || !form.artist_name || submitting}
            style={{ flex: 1 }}
          >
            {submitting ? "投稿中..." : "投稿する 🎵"}
          </button>
        </div>
      </div>
    </div>
  );
}

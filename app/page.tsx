"use client";
// Force redeploy trigger v3
import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { checkCommentSafety } from "@/lib/comment-filter";
import { EmbedPlayer, getYouTubeId, isSoundCloudUrl, getNiconicoId, getSpotifyId, getServiceName } from "@/app/components/EmbedPlayer";
import { CategoryFilter } from "@/app/components/CategoryFilter";

type Track = {
  id: number;
  user_id: string;
  title: string;
  artist_name: string;
  ai_tool: string;
  genre: string;
  music_type: string;
  prompt: string | null;
  external_url: string | null;
  play_count: number;
  created_at: string;
  like_count: number;
  liked: boolean;
  last_play_count_at: string | null;
  artist_social_url: string | null;
  social_links?: Record<string, string>;
  username?: string | null;
  comment_count?: number;
  photo_url?: string | null;
};

type Comment = {
  id: number;
  track_id: number;
  user_id: string;
  content: string;
  created_at: string;
};

type CommentWithUserInfo = Comment & {
  user_email?: string;
  username?: string | null;
  avatar_url?: string | null;
  twitter_url?: string | null;
  discord_url?: string | null;
  instagram_url?: string | null;
  youtube_url?: string | null;
  tiktok_url?: string | null;
  threads_url?: string | null;
};

type User = { id: string; email?: string } | null;

const AI_TOOLS = ["Suno", "Udio", "MusicLM", "Stable Audio"];
const GENRES = [
  "Synthwave", "Lo-Fi", "Cinematic", "City Pop", "Classical",
  "Future Bass", "Ambient", "J-Pop", "Rock", "EDM",
  "Hip Hop", "R&B", "Jazz", "Folk",
];
const FILTERS = ["すべて", "Suno", "Udio", "MusicLM", "Stable Audio"];
const PERIODS = ["日間", "週間", "月間", "全期間"];
const MUSIC_TYPES = ["すべて", "AI生成", "オリジナル"];
const SITE_URL = "https://revosong-charts.vercel.app";

function formatNumber(n: number) {
  if (n >= 10000) return (n / 10000).toFixed(1) + "万";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toString();
}

// All URL parsing and service detection functions are now imported from EmbedPlayer component

// Component for individual SNS avatar link
function SocialAvatarLink({ platform, url }: { platform: string; url: string }) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const platformLabels: Record<string, string> = {
    'x': 'X',
    'twitter': 'X',
    'instagram': 'Instagram',
    'facebook': 'Facebook',
    'youtube': 'YouTube',
    'tiktok': 'TikTok',
    'discord': 'Discord',
    'threads': 'Threads'
  };

  // Fallback emoji icons in case avatar fails to load
  const fallbackIcons: Record<string, string> = {
    'x': '𝕏',
    'twitter': '𝕏',
    'instagram': '📷',
    'facebook': 'f',
    'youtube': '▶️',
    'tiktok': '♪',
    'discord': '💬',
    'threads': '@'
  };

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const response = await fetch('/api/get-social-avatar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ url, platform })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.avatarUrl) {
            setAvatarUrl(data.avatarUrl);
            setError(false);
          } else {
            setError(true);
          }
        } else {
          setError(true);
        }
      } catch (err) {
        console.error(`Failed to fetch avatar for ${platform}:`, err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAvatar();
  }, [url, platform]);

  const label = platformLabels[platform] || platform;
  const fallbackIcon = fallbackIcons[platform] || '🔗';

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.1)',
        textDecoration: 'none',
        transition: 'all 0.2s',
        border: '1px solid rgba(255,255,255,0.2)',
        flexShrink: 0,
        overflow: 'hidden',
        fontSize: '14px'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
        e.currentTarget.style.transform = 'scale(1.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
        e.currentTarget.style.transform = 'scale(1)';
      }}
      title={label}
    >
      {!loading && avatarUrl && !error ? (
        <img
          src={avatarUrl}
          alt={label}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '50%'
          }}
          onError={() => setError(true)}
        />
      ) : (
        <span style={{ fontWeight: 'bold', color: '#fff' }}>{fallbackIcon}</span>
      )}
    </a>
  );
}

// Component to display SNS links with profile avatars
function SocialLinksWithAvatars({ socialLinks }: { socialLinks: Record<string, string> }) {
  if (Object.keys(socialLinks).length === 0) return null;

  return (
    <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
      {Object.entries(socialLinks).map(([platform, url]: [string, any]) => {
        if (!url) return null;
        return (
          <SocialAvatarLink
            key={platform}
            platform={platform}
            url={url}
          />
        );
      })}
    </div>
  );
}

// Component for player bar artist follow section
function ArtistFollowSection({ socialLinks, artist_social_url }: { socialLinks: Record<string, string>; artist_social_url: string | null }) {
  const getPlatformLabel = (platform: string) => {
    const labels: Record<string, string> = {
      'x': 'X',
      'twitter': 'X',
      'instagram': 'Instagram',
      'facebook': 'Facebook',
      'youtube': 'YouTube',
      'tiktok': 'TikTok',
      'discord': 'Discord',
      'threads': 'Threads'
    };
    return labels[platform] || platform;
  };

  const getSocialIcon = (platform: string) => {
    const icons: Record<string, string> = {
      'x': '𝕏',
      'twitter': '𝕏',
      'instagram': '📷',
      'facebook': 'f',
      'youtube': '▶️',
      'tiktok': '♪',
      'discord': '💬',
      'threads': '@'
    };
    return icons[platform] || '🔗';
  };

  const hasSocial = Object.keys(socialLinks).length > 0 || artist_social_url;
  if (!hasSocial) return null;

  return (
    <div style={{
      padding: "16px",
      background: "rgba(255,255,255,0.03)",
      borderTop: "1px solid rgba(255,255,255,0.1)"
    }}>
      <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", marginBottom: "10px", fontWeight: 600 }}>
        アーティストをフォロー
      </div>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
        {Object.entries(socialLinks).map(([platform, url]: [string, any]) => {
          if (!url) return null;
          const label = getPlatformLabel(platform);
          const icon = getSocialIcon(platform);

          return (
            <a
              key={platform}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                background: "rgba(255,45,85,0.2)",
                border: "1px solid rgba(255,45,85,0.4)",
                borderRadius: "16px",
                color: "#ff2d55",
                textDecoration: "none",
                fontSize: "11px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = "rgba(255,45,85,0.3)")}
              onMouseOut={(e) => (e.currentTarget.style.background = "rgba(255,45,85,0.2)")}
            >
              <span>{icon}</span>
              <span>{label}</span>
            </a>
          );
        })}
        {artist_social_url && (
          <a
            href={artist_social_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "6px 12px",
              background: "rgba(255,45,85,0.2)",
              border: "1px solid rgba(255,45,85,0.4)",
              borderRadius: "16px",
              color: "#ff2d55",
              textDecoration: "none",
              fontSize: "11px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s"
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "rgba(255,45,85,0.3)")}
            onMouseOut={(e) => (e.currentTarget.style.background = "rgba(255,45,85,0.2)")}
          >
            <span>🔗</span>
            <span>プロフィール</span>
          </a>
        )}
      </div>
    </div>
  );
}

function ShareButtons({ track }: { track: Track }) {
  const [copied, setCopied] = useState(false);
  const trackUrl = SITE_URL + "/?track=" + track.id;
  const shareText = "🎵 AI生成楽曲「" + track.title + "」by " + track.artist_name + " を聴いてみて！ #AIMusic #AI音楽ランキング";
  const encodedText = encodeURIComponent(shareText + "\n" + trackUrl);
  const encodedUrl = encodeURIComponent(trackUrl);

  const xUrl = "https://x.com/intent/post?text=" + encodedText;
  const lineUrl = "https://social-plugins.line.me/lineit/share?url=" + encodedUrl + "&text=" + encodeURIComponent(shareText);
  const fbUrl = "https://www.facebook.com/sharer/sharer.php?u=" + encodedUrl;

  const copyLink = () => {
    navigator.clipboard?.writeText(trackUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="share-container">
      <div className="share-row">
        <a href={xUrl} target="_blank" rel="noopener noreferrer" className="share-sns-btn share-sns-x">
          <svg className="share-sns-icon" viewBox="0 0 24 24" fill="#fff"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        </a>
        <a href={lineUrl} target="_blank" rel="noopener noreferrer" className="share-sns-btn share-sns-line">
          <svg className="share-sns-icon" viewBox="0 0 24 24" fill="#fff"><path d="M12 2C6.48 2 2 5.82 2 10.5c0 3.69 3.08 6.79 7.24 7.84.28.06.66.19.75.43.09.22.06.56.03.78l-.12.73c-.04.22-.17.86.75.47s4.98-2.94 6.8-5.03C19.62 13.27 22 11.18 22 10.5 22 5.82 17.52 2 12 2zm-3.5 11.5h-2a.5.5 0 01-.5-.5V8.5a.5.5 0 011 0V12h1.5a.5.5 0 010 1zm1.5-.5a.5.5 0 01-1 0v-4a.5.5 0 011 0v4zm4.5.5h-2a.5.5 0 01-.5-.5V8.5a.5.5 0 011 0v3.29l1.78-2.54a.5.5 0 01.82.58L13.5 11.5l1.6 2.28a.5.5 0 01-.82.58L12.5 12v1a.5.5 0 01-.5.5zm4-3h-1V12h1a.5.5 0 010 1h-1.5a.5.5 0 01-.5-.5v-4a.5.5 0 01.5-.5H17a.5.5 0 010 1h-1v1h1a.5.5 0 010 1z"/></svg>
        </a>
        <a href={fbUrl} target="_blank" rel="noopener noreferrer" className="share-sns-btn share-sns-fb">
          <svg className="share-sns-icon" viewBox="0 0 24 24" fill="#fff"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
        </a>
        <button onClick={copyLink} className="share-sns-btn share-sns-copy">
          {copied ? (
            <svg className="share-sns-icon" viewBox="0 0 24 24" fill="#fff" stroke="#fff" strokeWidth="0"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
          ) : (
            <svg className="share-sns-icon" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
          )}
        </button>
      </div>
    </div>
  );
}

function AboutSection() {
  const [open, setOpen] = useState(false);
  const [showServices, setShowServices] = useState(false);
  return (
    <div className="about-section">
      <button className="about-toggle" onClick={() => setOpen(!open)}>
        <span>Information</span>
        <span style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s", display: "inline-block" }}>▼</span>
      </button>
      {open && (
        <div className="about-content">
          <p className="about-text">
            <strong>AI生成楽曲もオリジナル楽曲も</strong>、みんなの「いいね」で順位が決まるランキングサイトです。
            誰でも無料で投稿・視聴・投票ができます。
          </p>
          <div className="about-steps">
            <div className="about-step">
              <div className="about-step-icon">🎵</div>
              <div className="about-step-title">1. 投稿する</div>
              <div className="about-step-desc">楽曲のURLを登録するだけ</div>
            </div>
            <div className="about-step">
              <div className="about-step-icon">❤️</div>
              <div className="about-step-title">2. いいね</div>
              <div className="about-step-desc">気に入った曲に投票しよう</div>
            </div>
            <div className="about-step">
              <div className="about-step-icon">🏆</div>
              <div className="about-step-title">3. ランキング</div>
              <div className="about-step-desc">いいね数で順位が決定！</div>
            </div>
          </div>

          <button className="services-toggle" onClick={() => setShowServices(!showServices)}>
            <span>🔗 対応サービス・投稿方法を見る</span>
            <span style={{ transform: showServices ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s", display: "inline-block", fontSize: 10 }}>▼</span>
          </button>

          {showServices && (
            <div className="services-list">
              <div className="service-card">
                <div className="service-header">
                  <span className="service-icon">🔴</span>
                  <span className="service-name">YouTube</span>
                  <span className="service-free">無料</span>
                </div>
                <div className="service-desc">動画として楽曲をアップロード。最も手軽で利用者が多い。アカウント作成後すぐに投稿可能。</div>
                <div className="service-url">youtube.com</div>
              </div>
              <div className="service-card">
                <div className="service-header">
                  <span className="service-icon">🟠</span>
                  <span className="service-name">SoundCloud</span>
                  <span className="service-free">無料枠あり</span>
                </div>
                <div className="service-desc">音楽特化のプラットフォーム。無料プランで最大3時間分アップロード可能。音楽クリエイターに人気。</div>
                <div className="service-url">soundcloud.com</div>
              </div>
              <div className="service-card">
                <div className="service-header">
                  <span className="service-icon">🟢</span>
                  <span className="service-name">Spotify</span>
                  <span className="service-free">配信サービス経由</span>
                </div>
                <div className="service-desc">DistroKid・TuneCore等の配信サービスを通じてアップロード。世界最大の音楽ストリーミング。</div>
                <div className="service-url">open.spotify.com</div>
              </div>
              <div className="service-card">
                <div className="service-header">
                  <span className="service-icon">⚪</span>
                  <span className="service-name">ニコニコ動画</span>
                  <span className="service-free">無料</span>
                </div>
                <div className="service-desc">日本発の動画プラットフォーム。ボカロ・DTM文化が根付いており、日本の音楽クリエイターに最適。</div>
                <div className="service-url">nicovideo.jp</div>
              </div>
              <div className="service-how">
                <div className="service-how-title">📝 投稿の手順</div>
                <div className="service-how-text">
                  1. 上記サービスに楽曲をアップロード → 2. 楽曲ページのURLをコピー → 3. 本サイトで「+ 投稿」からURLを貼り付け
                </div>
              </div>
            </div>
          )}

          <div style={{ marginTop: "30px", textAlign: "center" }}>
            <img
              src="/revosong-ecosystem.png"
              alt="REVOSONG Ecosystem"
              style={{ maxWidth: "100%", height: "auto", borderRadius: "8px" }}
            />
          </div>

          <p className="about-cta">あなたの楽曲を世界に届けよう！</p>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [user, setUser] = useState<User>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [filter, setFilter] = useState("すべて");
  const [typeFilter, setTypeFilter] = useState("すべて");
  const [musicTypeFilter, setMusicTypeFilter] = useState("すべて");
  const [period, setPeriod] = useState("全期間");
  const [showUpload, setShowUpload] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [editTrack, setEditTrack] = useState<Track | null>(null);

  // コメント管理用のState
  const [comments, setComments] = useState<CommentWithUserInfo[]>([]);
  const [commentInput, setCommentInput] = useState("");
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [submitComment, setSubmitComment] = useState(false);

  // 再生回数カウント済みトラックを追跡（1回のみ実行）
  const playCountedTrackIds = useRef<Set<number>>(new Set());

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

  const getPeriodStart = (p: string): string => {
    const now = new Date();
    if (p === "日間") now.setDate(now.getDate() - 1);
    else if (p === "週間") now.setDate(now.getDate() - 7);
    else if (p === "月間") now.setMonth(now.getMonth() - 1);
    else return "2000-01-01T00:00:00Z";
    return now.toISOString();
  };

  const fetchTracks = useCallback(async () => {
    setLoading(true);
    const periodStart = getPeriodStart(period);
    const { data: trackData, error } = await supabase
      .rpc("get_rankings_by_period", { period_start: periodStart });

    if (error) {
      console.error("RPC Error:", error);
    }

    if (trackData && trackData.length > 0) {
      console.log("Sample track data:", trackData[0]);
      console.log("Social links in first track:", (trackData[0] as any).social_links);
    }

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

      // ユーザー名、コメント数を取得
      const tracksWithExtra = await Promise.all(
        trackData.map(async (t: Record<string, unknown>) => {
          // ユーザー名を取得
          const { data: profileData } = await supabase
            .from("profiles")
            .select("username")
            .eq("id", t.user_id as string)
            .single();

          // コメント数を取得
          const { count: commentCount } = await supabase
            .from("comments")
            .select("*", { count: "exact", head: true })
            .eq("track_id", t.id as number);

          // YouTubeのサムネイル自動抽出
          let photoUrl = t.photo_url;
          if (!photoUrl && t.external_url) {
            const ytId = getYouTubeId(t.external_url as string);
            if (ytId) {
              photoUrl = `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`;
            }
          }

          return {
            ...t,
            liked: likedIds.includes(t.id as number),
            username: profileData?.username,
            comment_count: commentCount || 0,
            photo_url: photoUrl
          };
        })
      );

      setTracks(tracksWithExtra as Track[]);
    }
    setLoading(false);
  }, [user, period]);

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

  // 再生回数カウント（1時間おき）
  const incrementPlayCount = useCallback(
    async (trackId: number) => {
      const track = tracks.find((t) => t.id === trackId);
      if (!track) return;

      // 既にカウント済みならスキップ
      if (playCountedTrackIds.current.has(trackId)) {
        console.log(`再生回数カウント: ${track.title} は既にカウント済みなのでスキップ`);
        return;
      }

      const now = new Date();
      const lastPlayTime = track.last_play_count_at ? new Date(track.last_play_count_at) : null;

      // 最後のカウントから1時間以上経過しているかチェック
      if (lastPlayTime) {
        const hoursDiff = (now.getTime() - lastPlayTime.getTime()) / (1000 * 60 * 60);
        if (hoursDiff < 1) {
          // 1時間以内 → カウント無し
          console.log(`再生回数カウント: ${track.title} は1時間以内なのでスキップ (${hoursDiff.toFixed(2)}時間)`);
          playCountedTrackIds.current.add(trackId);
          return;
        }
      }

      // カウント対象に追加
      playCountedTrackIds.current.add(trackId);

      // 1時間以上経過 → play_count +1 & last_play_count_atを更新
      console.log(`再生回数カウント: ${track.title} を +1 (${track.play_count} → ${track.play_count + 1})`);

      const { error } = await supabase
        .from("tracks")
        .update({
          play_count: track.play_count + 1,
          last_play_count_at: now.toISOString(),
        })
        .eq("id", trackId);

      if (error) {
        console.error("再生回数更新エラー:", error);
      } else {
        console.log("再生回数が正常に更新されました");
        fetchTracks();
      }
    },
    [tracks]
  );

  const deleteTrack = async (trackId: number) => {
    if (!confirm("この楽曲を削除しますか？")) return;
    await supabase.from("tracks").delete().eq("id", trackId);
    setSelectedTrack(null);
    fetchTracks();
  };

  // コメント機能関連
  const fetchComments = async (trackId: number) => {
    setCommentsLoading(true);
    try {
      // コメントを取得
      const { data: commentsData } = await supabase
        .from("comments")
        .select("*")
        .eq("track_id", trackId)
        .order("created_at", { ascending: false });

      if (commentsData) {
        // 各コメントのユーザー情報を取得（SNS情報を含む）
        const withUserInfo = await Promise.all(
          commentsData.map(async (comment) => {
            const { data: profileData } = await supabase
              .from("profiles")
              .select("email, username, avatar_url, twitter_url, discord_url, instagram_url, youtube_url, tiktok_url, threads_url")
              .eq("id", comment.user_id)
              .single();

            return {
              ...comment,
              user_email: profileData?.email || "Anonymous",
              username: profileData?.username,
              avatar_url: profileData?.avatar_url,
              twitter_url: profileData?.twitter_url,
              discord_url: profileData?.discord_url,
              instagram_url: profileData?.instagram_url,
              youtube_url: profileData?.youtube_url,
              tiktok_url: profileData?.tiktok_url,
              threads_url: profileData?.threads_url,
            };
          })
        );
        setComments(withUserInfo);
      }
    } catch (error) {
      console.error("コメント取得エラー:", error);
    }
    setCommentsLoading(false);
  };

  const handleSubmitComment = async () => {
    if (!user || !selectedTrack || !commentInput.trim()) return;

    setSubmitComment(true);
    try {
      const commentContent = commentInput.trim();

      // ステップ 1: 無料フィルタで安全性を判定
      console.log("コメント安全性を判定中...");
      const safetyCheck = checkCommentSafety(commentContent);

      // ステップ 2: 判定結果に基づいて処理
      if (!safetyCheck.is_appropriate) {
        // 不適切なコメント → 警告表示
        alert(
          `⚠️ 申し訳ございません\n\n理由: ${safetyCheck.reason}\n\nコメント内容を修正してください`
        );
        console.warn("不適切なコメント検出:", safetyCheck);
        setSubmitComment(false);
        return;
      }

      // ステップ 3: 適切なコメントを投稿
      const { error } = await supabase.from("comments").insert({
        track_id: selectedTrack.id,
        user_id: user.id,
        content: commentContent,
      });

      if (!error) {
        setCommentInput("");
        console.log("✅ コメントが正常に投稿されました");
        fetchComments(selectedTrack.id);
      } else {
        console.error("❌ コメント保存エラー:", error);
        alert("コメント投稿に失敗しました");
      }
    } catch (error) {
      console.error("❌ コメント投稿エラー:", error);
      alert("エラーが発生しました。もう一度お試しください。");
    }
    setSubmitComment(false);
  };

  // selectedTrackが変わったらコメントを再取得
  useEffect(() => {
    if (selectedTrack) {
      fetchComments(selectedTrack.id);
    } else {
      setComments([]);
      setCommentInput("");
    }
  }, [selectedTrack?.id]);

  // トラック詳細が表示されたときに再生回数をカウント
  // (プレイヤーがマウントされた時点で、ユーザーが再生する意図があると判断)
  // 1回のみ実行される（同じトラックに対して複数回呼ばれることを防止）
  useEffect(() => {
    if (selectedTrack?.external_url) {
      // 短いディレイを設定（プレイヤーがマウントされるのを待つ）
      const timer = setTimeout(() => {
        incrementPlayCount(selectedTrack.id);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [selectedTrack?.id, incrementPlayCount]);

  // Helper function to detect music type (audio/video) based on URL
  const getMusicContentType = (track: Track): string => {
    if (!track.external_url) return "audio";
    if (getYouTubeId(track.external_url)) return "video";
    if (getNiconicoId(track.external_url)) return "video";
    return "audio";
  };

  const filtered = tracks.filter(
    (t) => (filter === "すべて" || t.ai_tool === filter) &&
           (typeFilter === "すべて" || (typeFilter === "AI生成" ? t.music_type === "ai" : t.music_type === "original")) &&
           (musicTypeFilter === "すべて" ||
            (musicTypeFilter === "🎵 音源" ? getMusicContentType(t) === "audio" : getMusicContentType(t) === "video"))
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
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(100%); }
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
          padding: 48px 24px 24px;
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
          font-size: 42px;
          font-weight: 700;
          letter-spacing: 4px;
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
          color: rgba(255,255,255,0.75);
          letter-spacing: 2px;
        }
        .hero-type-badges {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: 12px;
        }
        .hero-type-badge {
          padding: 5px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.5px;
        }
        .hero-badge-ai {
          background: rgba(94,92,230,0.18);
          border: 1px solid rgba(94,92,230,0.35);
          color: #a5a3f5;
        }
        .hero-badge-orig {
          background: rgba(255,149,0,0.15);
          border: 1px solid rgba(255,149,0,0.35);
          color: #ff9500;
        }
        .top-buttons {
          position: absolute;
          top: 20px;
          right: 20px;
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .top-menu {
          display: flex;
          gap: 4px;
          margin-right: 12px;
        }
        .menu-link {
          padding: 6px 12px;
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          font-size: 12px;
          border-radius: 16px;
          transition: all 0.2s;
          cursor: pointer;
        }
        .menu-link:hover {
          color: rgba(255,255,255,0.8);
          background: rgba(255,255,255,0.05);
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
        .about-section {
          margin: 0 24px 8px;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          overflow: hidden;
          background: rgba(255,255,255,0.02);
        }
        .about-toggle {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px;
          background: none;
          border: none;
          color: #ff2d55;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'Noto Sans JP', sans-serif;
        }
        .about-content {
          padding: 0 18px 18px;
          animation: fadeIn 0.3s ease;
        }
        .about-text {
          font-size: 13px;
          line-height: 1.8;
          color: rgba(255,255,255,0.8);
          margin-bottom: 16px;
        }
        .about-text strong {
          color: #fff;
        }
        .about-steps {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-bottom: 16px;
        }
        .about-step {
          text-align: center;
          padding: 14px 8px;
          border-radius: 12px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
        }
        .about-step-icon {
          font-size: 28px;
          margin-bottom: 8px;
        }
        .about-step-title {
          font-size: 12px;
          font-weight: 700;
          color: rgba(255,255,255,0.9);
          margin-bottom: 4px;
        }
        .about-step-desc {
          font-size: 10px;
          color: rgba(255,255,255,0.7);
          line-height: 1.5;
        }
        .services-section {
          margin-top: 16px;
          padding: 14px;
          border-radius: 12px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
        }
        .services-title {
          font-size: 13px;
          font-weight: 700;
          color: rgba(255,255,255,0.7);
          margin-bottom: 4px;
        }
        .services-desc {
          font-size: 11px;
          color: rgba(255,255,255,0.35);
          margin-bottom: 12px;
          line-height: 1.6;
        }
        .services-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }
        .service-card {
          text-align: center;
          padding: 10px 6px;
          border-radius: 10px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
        }
        .service-icon {
          font-size: 22px;
          margin-bottom: 4px;
        }
        .service-name {
          font-size: 11px;
          font-weight: 700;
          color: rgba(255,255,255,0.7);
        }
        .service-note {
          font-size: 9px;
          color: rgba(255,255,255,0.3);
          margin-top: 2px;
        }
        .about-cta {
          text-align: center;
          font-size: 14px;
          font-weight: 700;
          color: #ff2d55;
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
        .stat-label-placeholder { display: none; }
        .filters {
          display: flex;
          gap: 6px;
          padding: 6px 24px 12px;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .filters::-webkit-scrollbar { display: none; }
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
          padding: 4px 16px 200px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .track-row {
          display: grid;
          grid-template-columns: 36px 1fr auto;
          align-items: center;
          gap: 12px;
          padding: 13px 14px;
          border-radius: 12px;
          opacity: 0;
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid rgba(255,255,255,0.05);
          background: rgba(255,255,255,0.02);
        }
        .track-row:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.09);
        }
        .track-row-active {
          background: rgba(255,45,85,0.08);
          border-color: rgba(255,45,85,0.2);
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
          color: rgba(255,255,255,0.55);
          text-align: center;
        }
        .track-title {
          font-size: 15px;
          font-weight: 700;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .track-title-playing {
          color: #ff2d55;
        }
        .track-meta {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 3px;
          font-size: 11px;
          color: rgba(255,255,255,0.5);
        }
        .ai-badge {
          padding: 1px 6px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 600;
          background: rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.5);
        }
        .url-badge {
          padding: 1px 6px;
          border-radius: 4px;
          font-size: 9px;
          font-weight: 600;
          background: rgba(255,45,85,0.15);
          color: #ff2d55;
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
        .player-bar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: #1a1a24;
          border-top: 1px solid rgba(255,255,255,0.08);
          padding: 16px;
          z-index: 50;
          animation: slideUp 0.3s ease;
        }
        .player-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .player-title {
          font-size: 14px;
          font-weight: 700;
        }
        .player-artist {
          font-size: 12px;
          color: rgba(255,255,255,0.4);
          margin-top: 2px;
        }
        .player-buttons {
          display: flex;
          gap: 6px;
          align-items: center;
        }
        .player-close {
          background: rgba(255,255,255,0.08);
          border: none;
          color: rgba(255,255,255,0.6);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .player-close:hover {
          background: rgba(255,255,255,0.15);
        }
        .player-edit-btn {
          background: rgba(255,255,255,0.08);
          border: none;
          color: rgba(255,255,255,0.6);
          padding: 6px 12px;
          border-radius: 16px;
          cursor: pointer;
          font-size: 12px;
          font-family: 'Noto Sans JP', sans-serif;
        }
        .player-edit-btn:hover {
          background: rgba(255,255,255,0.15);
        }
        .player-delete-btn {
          background: rgba(255,59,48,0.1);
          border: none;
          color: #ff3b30;
          padding: 6px 12px;
          border-radius: 16px;
          cursor: pointer;
          font-size: 12px;
          font-family: 'Noto Sans JP', sans-serif;
        }
        .player-delete-btn:hover {
          background: rgba(255,59,48,0.2);
        }
        .player-prompt {
          margin-top: 12px;
          padding: 10px 12px;
          border-radius: 8px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
          font-size: 12px;
          color: rgba(255,255,255,0.5);
          line-height: 1.5;
        }
        .player-prompt-label {
          font-size: 10px;
          color: rgba(255,255,255,0.3);
          margin-bottom: 4px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .no-url-msg {
          padding: 24px 16px;
          text-align: center;
          color: rgba(255,255,255,0.3);
          font-size: 13px;
          background: rgba(255,255,255,0.03);
          border-radius: 12px;
        }
        .share-container {
          margin: 12px 0 4px;
        }
        .share-row {
          display: flex;
          gap: 10px;
          justify-content: center;
        }
        .share-sns-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
          text-decoration: none;
        }
        .share-sns-btn:hover {
          transform: scale(1.12);
          box-shadow: 0 4px 16px rgba(0,0,0,0.3);
        }
        .share-sns-btn:active {
          transform: scale(0.95);
        }
        .share-sns-icon {
          width: 20px;
          height: 20px;
        }
        .share-sns-x {
          background: #000;
          border: 1px solid rgba(255,255,255,0.2);
        }
        .share-sns-line {
          background: #06C755;
        }
        .share-sns-fb {
          background: #1877F2;
        }
        .share-sns-copy {
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.2);
        }
        .share-sns-copy:hover {
          background: rgba(255,255,255,0.25);
        }
        .period-bar {
          display: flex;
          gap: 4px;
          padding: 4px 24px 12px;
          justify-content: center;
        }
        .period-chip {
          padding: 6px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
          font-family: 'Noto Sans JP', sans-serif;
        }
        .period-chip-off {
          background: transparent;
          color: rgba(255,255,255,0.35);
        }
        .period-chip-off:hover {
          color: rgba(255,255,255,0.7);
        }
        .period-chip-on {
          background: rgba(255,255,255,0.1);
          color: #fff;
          font-weight: 700;
        }
        .services-toggle {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
          margin: 12px 0 0;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          color: rgba(255,255,255,0.6);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          font-family: 'Noto Sans JP', sans-serif;
        }
        .services-toggle:hover {
          background: rgba(255,255,255,0.06);
        }
        .services-list {
          margin-top: 10px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          animation: fadeIn 0.3s ease;
        }
        .service-card {
          padding: 12px 14px;
          border-radius: 10px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
        }
        .service-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }
        .service-icon {
          font-size: 16px;
        }
        .service-name {
          font-size: 14px;
          font-weight: 700;
          color: rgba(255,255,255,0.85);
        }
        .service-free {
          font-size: 10px;
          padding: 2px 8px;
          border-radius: 10px;
          background: rgba(48,209,88,0.15);
          color: #30d158;
          font-weight: 600;
        }
        .service-desc {
          font-size: 12px;
          color: rgba(255,255,255,0.45);
          line-height: 1.6;
        }
        .service-url {
          font-size: 11px;
          color: rgba(255,45,85,0.6);
          margin-top: 4px;
        }
        .service-how {
          padding: 12px 14px;
          border-radius: 10px;
          background: rgba(255,45,85,0.06);
          border: 1px solid rgba(255,45,85,0.15);
        }
        .service-how-title {
          font-size: 13px;
          font-weight: 700;
          color: rgba(255,255,255,0.7);
          margin-bottom: 6px;
        }
        .service-how-text {
          font-size: 12px;
          color: rgba(255,255,255,0.5);
          line-height: 1.7;
        }
        .type-filters {
          display: flex;
          gap: 8px;
          padding: 4px 24px 12px;
          justify-content: center;
        }
        .type-chip {
          padding: 8px 16px;
          border-radius: 24px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s;
        }
        .type-chip-off {
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.5);
        }
        .type-chip-on {
          border: 1px solid rgba(255,149,0,0.5);
          background: rgba(255,149,0,0.15);
          color: #ff9500;
        }
        .type-badge-ai {
          padding: 1px 6px;
          border-radius: 4px;
          font-size: 9px;
          font-weight: 700;
          background: rgba(94,92,230,0.2);
          color: #5e5ce6;
        }
        .type-badge-original {
          padding: 1px 6px;
          border-radius: 4px;
          font-size: 9px;
          font-weight: 700;
          background: rgba(255,149,0,0.2);
          color: #ff9500;
        }
        .type-select {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .type-select-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 16px 12px;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 13px;
          font-weight: 600;
        }
        .type-select-off {
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.03);
          color: rgba(255,255,255,0.4);
        }
        .type-select-on {
          border: 1px solid rgba(255,45,85,0.5);
          background: rgba(255,45,85,0.1);
          color: #ff2d55;
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
        .url-hint {
          font-size: 11px;
          color: rgba(255,255,255,0.3);
          margin-top: 4px;
          line-height: 1.5;
        }
        .page-wrapper {
          max-width: 640px;
          margin: 0 auto;
          width: 100%;
        }
        .filter-section-label {
          font-size: 10px;
          font-weight: 700;
          color: rgba(255,255,255,0.28);
          letter-spacing: 1.5px;
          text-transform: uppercase;
          padding: 10px 24px 0;
        }
        .ranking-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 24px 6px;
          font-size: 11px;
          font-weight: 700;
          color: rgba(255,255,255,0.3);
          letter-spacing: 1.5px;
          text-transform: uppercase;
          border-top: 1px solid rgba(255,255,255,0.05);
          margin: 4px 16px 0;
        }
        .ranking-count {
          font-size: 11px;
          color: rgba(255,255,255,0.22);
          font-weight: 400;
          letter-spacing: 0;
          text-transform: none;
        }
        .stat-label {
          font-size: 11px;
          color: rgba(255,255,255,0.5);
          margin-top: 3px;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        .footer {
          text-align: center;
          padding: 28px 24px;
          font-size: 11px;
          color: rgba(255,255,255,0.2);
          border-top: 1px solid rgba(255,255,255,0.05);
          margin: 8px 16px 0;
        }
      `}</style>

      <div className="page-wrapper">
      <header className="hero">
        <div className="hero-bg" />
        <h1 className="hero-title">MUSIC CHARTS</h1>
        <p style={{ margin: "4px 0 12px", fontSize: "18px", fontWeight: "bold", color: "#00d4ff" }}>REVOSONG</p>
        <p className="hero-sub">みんなの音楽ランキング</p>
        <div className="hero-type-badges">
          <span className="hero-type-badge hero-badge-ai">🤖 AI生成楽曲</span>
          <span className="hero-type-badge hero-badge-orig">🎤 オリジナル楽曲</span>
        </div>
        <div className="top-buttons">
          <div className="top-menu">
            <a href="/about" className="menu-link">About</a>
            <a href="/information" className="menu-link">Information</a>
            <a href="/playlists" className="menu-link">Playlist</a>
          </div>
          {/* Navigation menu updated */}
          {user ? (
            <>
              <button className="btn-upload" onClick={() => setShowUpload(true)}>
                + 投稿
              </button>
              <button
                className="btn-profile"
                onClick={() => (window.location.href = "/profile")}
                style={{
                  padding: "10px 16px",
                  background: "rgba(100,200,255,0.2)",
                  border: "1px solid rgba(100,200,255,0.4)",
                  borderRadius: "8px",
                  color: "#64c8ff",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                👤 プロフィール
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

      <AboutSection />

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

      <div className="filter-section-label">AIツール</div>
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

      <div className="filter-section-label">タイプ</div>
      <div className="type-filters">
        {MUSIC_TYPES.map((t) => (
          <div
            key={t}
            className={`type-chip ${typeFilter === t ? "type-chip-on" : "type-chip-off"}`}
            onClick={() => setTypeFilter(t)}
          >
            {t === "AI生成" ? "🤖 AI生成" : t === "オリジナル" ? "🎤 オリジナル" : "🎵 すべて"}
          </div>
        ))}
      </div>

      <div className="filter-section-label">コンテンツ</div>
      <div style={{ paddingBottom: '12px' }}>
        <CategoryFilter
          onFilterChange={(category) => {
            setMusicTypeFilter(category);
          }}
          initialFilter={musicTypeFilter}
        />
      </div>

      <div className="filter-section-label">期間</div>
      <div className="period-bar">
        {PERIODS.map((p) => (
          <button
            key={p}
            className={`period-chip ${period === p ? "period-chip-on" : "period-chip-off"}`}
            onClick={() => setPeriod(p)}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="ranking-header">
        <span>Ranking</span>
        <span className="ranking-count">{filtered.length}曲</span>
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
              className={`track-row ${selectedTrack?.id === track.id ? "track-row-active" : ""}`}
              style={{
                animation: `fadeIn 0.4s ease ${i * 0.05}s forwards`,
              }}
              onClick={() => {
                if (selectedTrack?.id === track.id) {
                  setSelectedTrack(null);
                } else {
                  setSelectedTrack(track);
                  // 再生回数カウントは useEffect で自動実行
                }
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

              {/* Thumbnail */}
              {track.photo_url && (
                <img
                  src={track.photo_url}
                  alt={track.title}
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '6px',
                    objectFit: 'cover',
                    flexShrink: 0
                  }}
                />
              )}

              <div style={{ minWidth: 0 }}>
                <div className={`track-title ${selectedTrack?.id === track.id ? "track-title-playing" : ""}`}>
                  {track.title}
                </div>
                <div className="track-meta">
                  {track.music_type === "ai" && track.ai_tool && <span className="ai-badge">{track.ai_tool}</span>}
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>
                    {track.genre}
                  </span>
                  <span>·</span>
                  <span>{track.artist_name}</span>
                  {track.username && (
                    <>
                      <span>·</span>
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>
                        👤 {track.username}
                      </span>
                    </>
                  )}
                  {track.external_url && <span className="url-badge">♪ 再生可</span>}
                  {track.comment_count !== undefined && (
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", gap: "3px" }}>
                      💬 {track.comment_count}
                    </span>
                  )}
                  <span className={track.music_type === "ai" ? "type-badge-ai" : "type-badge-original"}>
                    {track.music_type === "ai" ? "AI" : "Original"}
                  </span>

                  {/* Artist Social Links with Profile Images */}
                  <SocialLinksWithAvatars socialLinks={(track as any).social_links || {}} />
                </div>
              </div>
              <button
                className="like-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLike(track.id);
                }}
              >
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

      <div className="footer">
        <div style={{ marginBottom: 10 }}>
          MUSIC CHARTS — みんなの音楽ランキング
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 20, marginBottom: 6 }}>
          <a href="/services" style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none", fontSize: 12 }}>
            🎵 対応サービス一覧
          </a>
          <a href="/about" style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none", fontSize: 12 }}>
            👤 運営者情報
          </a>
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.18)", marginTop: 4 }}>
          運営：<a href="https://onokun.com/" rel="author" target="_blank" style={{ color: "rgba(255,45,85,0.5)", textDecoration: "none" }}>おのくん</a>
        </div>
      </div>
      </div>

      {selectedTrack && (
        <div className="player-bar">
          <div className="player-header">
            <div>
              <div className="player-title">{selectedTrack.title}</div>
              <div className="player-artist">
                {selectedTrack.artist_name} · {selectedTrack.music_type === "ai" && selectedTrack.ai_tool ? selectedTrack.ai_tool : (selectedTrack.external_url ? getServiceName(selectedTrack.external_url) : "")}
              </div>
            </div>
            <div className="player-buttons">
              {user && user.id === selectedTrack.user_id && (
                <>
                  <button
                    className="player-edit-btn"
                    onClick={() => setEditTrack(selectedTrack)}
                  >
                    ✏️ 編集
                  </button>
                  <button
                    className="player-delete-btn"
                    onClick={() => deleteTrack(selectedTrack.id)}
                  >
                    🗑 削除
                  </button>
                </>
              )}
              <button
                className="player-close"
                onClick={() => setSelectedTrack(null)}
              >
                ✕
              </button>
            </div>
          </div>
          {selectedTrack.external_url ? (
            <EmbedPlayer url={selectedTrack.external_url} />
          ) : (
            <div className="no-url-msg">
              この楽曲にはURLが設定されていません
            </div>
          )}
          <ShareButtons track={selectedTrack} />

          {/* アーティストのSNSリンク */}
          {selectedTrack && (
            <ArtistFollowSection
              socialLinks={(selectedTrack as any).social_links || {}}
              artist_social_url={selectedTrack.artist_social_url}
            />
          )}

          {selectedTrack.prompt && (
            <div className="player-prompt">
              <div className="player-prompt-label">Prompt</div>
              {selectedTrack.prompt}
            </div>
          )}

          {/* コメント機能 */}
          <div style={{
            padding: "16px",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.02)"
          }}>
            <div style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#fff",
              marginBottom: "12px"
            }}>
              💬 コメント ({comments.length})
            </div>

            {/* コメント入力フォーム */}
            {user ? (
              <div style={{
                marginBottom: "16px",
                display: "flex",
                gap: "8px",
                flexDirection: "column"
              }}>
                <textarea
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="コメントを入力..."
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: "6px",
                    color: "#fff",
                    fontSize: "12px",
                    fontFamily: "inherit",
                    resize: "vertical",
                    minHeight: "60px",
                    outline: "none",
                    transition: "all 0.2s"
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                    e.currentTarget.style.borderColor = "rgba(255,45,85,0.4)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                  }}
                />
                <button
                  onClick={handleSubmitComment}
                  disabled={submitComment || !commentInput.trim()}
                  style={{
                    padding: "8px 16px",
                    background: commentInput.trim() ? "rgba(255,45,85,0.8)" : "rgba(255,45,85,0.3)",
                    border: "none",
                    borderRadius: "6px",
                    color: "#fff",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: commentInput.trim() ? "pointer" : "not-allowed",
                    transition: "all 0.2s",
                    opacity: submitComment ? 0.6 : 1
                  }}
                  onMouseOver={(e) => {
                    if (commentInput.trim() && !submitComment) {
                      e.currentTarget.style.background = "rgba(255,45,85,1)";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (commentInput.trim() && !submitComment) {
                      e.currentTarget.style.background = "rgba(255,45,85,0.8)";
                    }
                  }}
                >
                  {submitComment ? "投稿中..." : "コメントを投稿"}
                </button>
              </div>
            ) : (
              <div style={{
                marginBottom: "16px",
                padding: "12px",
                background: "rgba(255,45,85,0.1)",
                border: "1px solid rgba(255,45,85,0.3)",
                borderRadius: "6px",
                fontSize: "12px",
                color: "rgba(255,45,85,0.8)",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onClick={() => setShowAuth(true)}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "rgba(255,45,85,0.15)";
                e.currentTarget.style.borderColor = "rgba(255,45,85,0.4)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "rgba(255,45,85,0.1)";
                e.currentTarget.style.borderColor = "rgba(255,45,85,0.3)";
              }}>
                ログインしてコメントを投稿
              </div>
            )}

            {/* コメントリスト */}
            <div style={{
              maxHeight: "300px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "8px"
            }}>
              {commentsLoading ? (
                <div style={{
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.5)",
                  textAlign: "center",
                  padding: "8px"
                }}>
                  コメント読み込み中...
                </div>
              ) : comments.length === 0 ? (
                <div style={{
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.4)",
                  textAlign: "center",
                  padding: "8px"
                }}>
                  コメントはまだありません
                </div>
              ) : (
                comments.map((comment) => {
                  // SNSプラットフォームのマッピング
                  const snsLinks = [
                    { platform: "X", url: comment.twitter_url, icon: "𝕏" },
                    { platform: "Discord", url: comment.discord_url, icon: "💜" },
                    { platform: "Instagram", url: comment.instagram_url, icon: "📷" },
                    { platform: "YouTube", url: comment.youtube_url, icon: "🎬" },
                    { platform: "TikTok", url: comment.tiktok_url, icon: "🎵" },
                    { platform: "Threads", url: comment.threads_url, icon: "@" },
                  ].filter((s): s is { platform: string; url: string; icon: string } => !!s.url);

                  return (
                    <div
                      key={comment.id}
                      style={{
                        padding: "10px 10px",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "4px",
                        fontSize: "11px"
                      }}
                    >
                      {/* ユーザー情報ヘッダー（アバター + 名前 + SNS + 日付） */}
                      <div style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        marginBottom: "6px",
                        gap: "8px"
                      }}>
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          flex: 1
                        }}>
                          {/* アバター画像 */}
                          {comment.avatar_url && (
                            <img
                              src={comment.avatar_url}
                              alt="avatar"
                              style={{
                                width: "24px",
                                height: "24px",
                                borderRadius: "50%",
                                objectFit: "cover",
                                flexShrink: 0
                              }}
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          )}
                          {/* ユーザー名 */}
                          <span style={{
                            fontWeight: 600,
                            color: "#ff2d55"
                          }}>
                            {comment.username || comment.user_email?.split("@")[0] || "Anonymous"}
                          </span>
                        </div>

                        {/* 日付（右寄せ） */}
                        <span style={{
                          color: "rgba(255,255,255,0.4)",
                          fontSize: "10px",
                          whiteSpace: "nowrap"
                        }}>
                          {new Date(comment.created_at).toLocaleDateString("ja-JP")}
                        </span>
                      </div>

                      {/* SNSアイコン表示 */}
                      {snsLinks.length > 0 && (
                        <div style={{
                          display: "flex",
                          gap: "4px",
                          marginBottom: "6px",
                          flexWrap: "wrap"
                        }}>
                          {snsLinks.map(({ platform, url, icon }) => (
                            <a
                              key={platform}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              title={platform}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "18px",
                                height: "18px",
                                fontSize: "11px",
                                background: "rgba(255,45,85,0.2)",
                                borderRadius: "3px",
                                textDecoration: "none",
                                cursor: "pointer",
                                transition: "all 0.2s"
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.background = "rgba(255,45,85,0.4)";
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.background = "rgba(255,45,85,0.2)";
                              }}
                            >
                              {icon}
                            </a>
                          ))}
                        </div>
                      )}

                      {/* コメント内容 */}
                      <div style={{
                        color: "rgba(255,255,255,0.8)",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        lineHeight: "1.4"
                      }}>
                        {comment.content}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      {showUpload && user && (
        <UploadModal
          user={user}
          onClose={() => setShowUpload(false)}
          onDone={fetchTracks}
        />
      )}
      {editTrack && (
        <EditModal
          track={editTrack}
          onClose={() => setEditTrack(null)}
          onDone={() => {
            setEditTrack(null);
            setSelectedTrack(null);
            fetchTracks();
          }}
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

  const handleGoogleSignIn = async () => {
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: typeof window !== 'undefined'
          ? `${window.location.origin}/auth/callback`
          : 'http://localhost:3000/auth/callback'
      }
    });
    if (error) setError(error.message);
  };

  const handleXSignIn = async () => {
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'x',
      options: {
        redirectTo: typeof window !== 'undefined'
          ? `${window.location.origin}/auth/callback`
          : 'http://localhost:3000/auth/callback'
      }
    });
    if (error) setError(error.message);
  };


  const handleDiscordSignIn = async () => {
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        redirectTo: typeof window !== 'undefined'
          ? `${window.location.origin}/auth/callback`
          : 'http://localhost:3000/auth/callback'
      }
    });
    if (error) setError(error.message);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">
          {isSignUp ? "新規登録" : "ログイン"}
        </h3>
        {error && <div className="error-box">{error}</div>}
        {message && <div className="success-box">{message}</div>}

        <button
          className="btn-primary"
          onClick={handleGoogleSignIn}
          style={{ width: "100%", marginTop: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
        >
          <span>🔵</span> Google でログイン
        </button>

        <button
          className="btn-primary"
          onClick={handleXSignIn}
          style={{ width: "100%", marginTop: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
        >
          <span>𝕏</span> X でログイン
        </button>

        <button
          className="btn-primary"
          onClick={handleDiscordSignIn}
          style={{ width: "100%", marginTop: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
        >
          <span>💜</span> Discord でログイン
        </button>

        <div style={{ textAlign: "center", margin: "16px 0", color: "rgba(255,255,255,0.5)", fontSize: 12 }}>
          または
        </div>

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
    music_type: "ai",
    prompt: "",
    external_url: "",
    artist_social_url: "",
    copyright_acknowledged: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const update = (k: string, v: string) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const handleSubmit = async () => {
    if (!form.title || !form.artist_name) return;

    // 最終確認ダイアログ
    const confirmed = window.confirm(
      "⚠️ 最終確認\n\n" +
      "この楽曲について、以下の内容を確認しましたか？\n\n" +
      "✓ ご自身が作成したAI生成楽曲、または作曲したオリジナル楽曲である\n" +
      "✓ 歌ってみた、カバー、他人の作品ではない\n" +
      "✓ 著作権侵害の恐れがない\n\n" +
      "著作権侵害がある場合、運営サイドで予告なく削除されます。\n\n" +
      "「OK」をクリックして投稿します。"
    );

    if (!confirmed) return;

    setSubmitting(true);
    await supabase.from("tracks").insert({
      user_id: user.id,
      title: form.title,
      artist_name: form.artist_name,
      ai_tool: form.music_type === "ai" ? form.ai_tool : "",
      genre: form.genre,
      music_type: form.music_type,
      prompt: form.music_type === "ai" ? (form.prompt || null) : null,
      external_url: form.external_url || null,
      artist_social_url: form.artist_social_url || null,
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

        {/* 著作権警告 */}
        <div style={{
          background: "linear-gradient(135deg, rgba(220,20,60,0.2), rgba(255,69,0,0.2))",
          border: "2px solid #ff4500",
          borderRadius: "10px",
          padding: "14px 16px",
          marginBottom: "20px",
          fontSize: "12px",
          lineHeight: 1.7,
          color: "#fff"
        }}>
          <div style={{ fontWeight: 700, color: "#ff6482", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
            ⚠️ 著作権に関する重要なお知らせ
          </div>
          <p style={{ margin: "0 0 8px 0", fontSize: "11px" }}>
            <strong>投稿できるもの：</strong>
          </p>
          <p style={{ margin: "0 0 8px 0", fontSize: "11px", paddingLeft: "12px" }}>
            ✅ ご自身が作成したAI生成楽曲<br/>
            ✅ ご自身が作曲・作成したオリジナル楽曲
          </p>
          <p style={{ margin: "0 0 8px 0", fontSize: "11px" }}>
            <strong>投稿できないもの：</strong>
          </p>
          <p style={{ margin: "0 0 8px 0", fontSize: "11px", paddingLeft: "12px", color: "#ffb3ba" }}>
            ❌ 著作権のある既存楽曲<br/>
            ❌ 他人のAI生成楽曲<br/>
            ❌ 歌ってみた動画・音源<br/>
            ❌ カバー音源<br/>
            ❌ 他人の作品の二次創作
          </p>
          <p style={{ margin: "0 0 8px 0", fontSize: "11px", color: "#ffb3ba" }}>
            ⚠️ 著作権侵害の疑いがある楽曲を投稿した場合、<strong>運営サイドで予告なく削除される可能性があります。</strong>
          </p>
          <p style={{ margin: 0, fontSize: "11px", color: "rgba(255,255,255,0.85)" }}>
            違反が判明した場合の責任は投稿者が負担します。必ず著作権を確認してから投稿してください。
          </p>
        </div>

        <div className="field-label">楽曲タイプ *</div>
        <div className="type-select">
          <div
            className={`type-select-btn ${form.music_type === "ai" ? "type-select-on" : "type-select-off"}`}
            onClick={() => update("music_type", "ai")}
          >
            <span style={{fontSize: 20}}>🤖</span>
            <span>AI生成</span>
          </div>
          <div
            className={`type-select-btn ${form.music_type === "original" ? "type-select-on" : "type-select-off"}`}
            onClick={() => update("music_type", "original")}
          >
            <span style={{fontSize: 20}}>🎤</span>
            <span>オリジナル</span>
          </div>
        </div>

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

        {form.music_type === "ai" && (
          <>
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
          </>
        )}

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

        <div className="field-label">音楽URL *</div>
        <input
          className="field-input"
          placeholder="https://www.youtube.com/watch?v=..."
          value={form.external_url}
          onChange={(e) => update("external_url", e.target.value)}
        />
        <div className="url-hint">
          YouTube・SoundCloud・ニコニコ動画・Spotify・Bandcamp・Audiomack に対応
        </div>

        {form.music_type === "ai" && (
          <>
            <div className="field-label">使用したプロンプト（任意）</div>
            <textarea
              className="field-input"
              style={{ minHeight: 60, resize: "vertical" }}
              placeholder="どんなプロンプトで生成しましたか？"
              value={form.prompt}
              onChange={(e) => update("prompt", e.target.value)}
            />
          </>
        )}

        <div className="field-label">あなたのSNS（任意）</div>
        <input
          className="field-input"
          placeholder="https://twitter.com/... または https://www.youtube.com/... など"
          value={form.artist_social_url}
          onChange={(e) => update("artist_social_url", e.target.value)}
        />
        <div className="url-hint">
          あなたの Twitter/X、YouTube、Spotify などのプロフィールリンクを貼ると、リスナーがあなたをフォロー・応援できます
        </div>

        {/* 著作権確認チェックボックス */}
        <div style={{
          background: "rgba(255,69,0,0.1)",
          border: "1px solid rgba(255,69,0,0.3)",
          borderRadius: "8px",
          padding: "14px",
          marginTop: "24px",
          marginBottom: "20px"
        }}>
          <label style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
            cursor: "pointer",
            fontSize: "13px",
            color: "#fff",
            lineHeight: 1.5
          }}>
            <input
              type="checkbox"
              checked={form.copyright_acknowledged === "true"}
              onChange={(e) => update("copyright_acknowledged", e.target.checked ? "true" : "false")}
              style={{
                marginTop: "3px",
                width: "18px",
                height: "18px",
                cursor: "pointer",
                accentColor: "#ff4500"
              }}
            />
            <span>
              <strong>著作権確認：</strong> この楽曲は、ご自身が作成したAI生成楽曲またはご自身が作曲したオリジナル楽曲です。歌ってみた・カバー・他人の作品ではありません。著作権侵害がある場合、運営サイドで予告なく削除される可能性があることに同意します。
            </span>
          </label>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button className="btn-cancel" onClick={onClose} style={{ flex: 1 }}>
            キャンセル
          </button>
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={!form.title || !form.artist_name || form.copyright_acknowledged !== "true" || submitting}
            style={{ flex: 1 }}
            title={form.copyright_acknowledged !== "true" ? "著作権の確認チェックボックスにチェックしてください" : ""}
          >
            {submitting ? "投稿中..." : "投稿する 🎵"}
          </button>
        </div>
      </div>
    </div>
  );
}

function EditModal({
  track,
  onClose,
  onDone,
}: {
  track: Track;
  onClose: () => void;
  onDone: () => void;
}) {
  const [form, setForm] = useState({
    title: track.title,
    artist_name: track.artist_name,
    ai_tool: track.ai_tool,
    genre: track.genre,
    prompt: track.prompt || "",
    external_url: track.external_url || "",
    artist_social_url: track.artist_social_url || "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const update = (k: string, v: string) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const handleSubmit = async () => {
    if (!form.title || !form.artist_name) return;
    setSubmitting(true);
    await supabase
      .from("tracks")
      .update({
        title: form.title,
        artist_name: form.artist_name,
        ai_tool: form.ai_tool,
        genre: form.genre,
        prompt: form.prompt || null,
        external_url: form.external_url || null,
        artist_social_url: form.artist_social_url || null,
      })
      .eq("id", track.id);
    setSubmitting(false);
    setDone(true);
    setTimeout(onDone, 1200);
  };

  if (done) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div
          className="modal-card"
          style={{ textAlign: "center", padding: "48px 24px" }}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>更新しました！</div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">楽曲を編集</h3>

        <div className="field-label">曲名 *</div>
        <input
          className="field-input"
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
        />

        <div className="field-label">アーティスト名 *</div>
        <input
          className="field-input"
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

        <div className="field-label">音楽URL</div>
        <input
          className="field-input"
          placeholder="https://www.youtube.com/watch?v=..."
          value={form.external_url}
          onChange={(e) => update("external_url", e.target.value)}
        />

        <div className="field-label">使用したプロンプト</div>
        <textarea
          className="field-input"
          style={{ minHeight: 60, resize: "vertical" }}
          value={form.prompt}
          onChange={(e) => update("prompt", e.target.value)}
        />

        <div className="field-label">あなたのSNS</div>
        <input
          className="field-input"
          placeholder="https://twitter.com/... または https://www.youtube.com/... など"
          value={form.artist_social_url}
          onChange={(e) => update("artist_social_url", e.target.value)}
        />
        <div className="url-hint">
          リスナーがあなたをフォロー・応援できるようにしましょう
        </div>

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
            {submitting ? "保存中..." : "保存する ✓"}
          </button>
        </div>
      </div>
    </div>
  );
}

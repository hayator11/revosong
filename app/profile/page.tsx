"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type UserProfile = {
  id: string;
  email: string;
  twitter_url: string | null;
  github_url: string | null;
  discord_url: string | null;
  instagram_url: string | null;
  youtube_url: string | null;
  tiktok_url: string | null;
  threads_url: string | null;
  avatar_url: string | null;
};

export default function ProfilePage() {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    twitter_url: "",
    github_url: "",
    discord_url: "",
    instagram_url: "",
    youtube_url: "",
    tiktok_url: "",
    threads_url: "",
    avatar_url: "",
  });

  // OAuth handlers
  const handleXSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "x",
      options: { redirectTo: window.location.origin + "/profile" }
    });
    if (error) console.error("X Sign-In Error:", error);
  };

  const handleGitHubSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: window.location.origin + "/profile" }
    });
    if (error) console.error("GitHub Sign-In Error:", error);
  };

  const handleDiscordSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: { redirectTo: window.location.origin + "/profile" }
    });
    if (error) console.error("Discord Sign-In Error:", error);
  };

  // ユーザー情報を取得
  useEffect(() => {
    const initializeUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (data.user) {
          setUser({ id: data.user.id, email: data.user.email || "" });

          // OAuth から来た場合、SNS URL を自動入力
          if (data.user.user_metadata) {
            const userData = data.user;
            const handle = userData.user_metadata.user_name || userData.user_metadata.preferred_username;

            // プロバイダーを特定
            const isX = userData.identities?.some((i: any) => i.provider === 'x' || i.provider === 'twitter');
            const isGitHub = userData.identities?.some((i: any) => i.provider === 'github');
            const isDiscord = userData.identities?.some((i: any) => i.provider === 'discord');

            let snsData: Record<string, string> = {};

            if (isX && handle) {
              snsData.twitter_url = `https://x.com/${handle}`;
            }
            if (isGitHub && handle) {
              snsData.github_url = `https://github.com/${handle}`;
            }
            if (isDiscord && userData.user_metadata.sub) {
              snsData.discord_url = `https://discord.com/users/${userData.user_metadata.sub}`;
            }

            // API route でプロフィール作成（service role key を使用）
            if (Object.keys(snsData).length > 0) {
              try {
                const res = await fetch('/api/profile/auto-setup', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    userId: userData.id,
                    email: userData.email,
                    snsData,
                  }),
                });

                if (!res.ok) {
                  const error = await res.json();
                  console.error('Profile auto-setup error:', error);
                } else {
                  console.log('Profile auto-setup successful');
                }
              } catch (error) {
                console.error('Profile auto-setup fetch error:', error);
              }
            }
          }

          // プロフィール取得
          fetchProfile(data.user.id);
        } else {
          window.location.href = "/";
        }
      } catch (error) {
        console.error('User initialization error:', error);
        window.location.href = "/";
      }
    };

    initializeUser();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (data) {
      setProfile(data);
      setFormData({
        twitter_url: data.twitter_url || "",
        github_url: data.github_url || "",
        discord_url: data.discord_url || "",
        instagram_url: data.instagram_url || "",
        youtube_url: data.youtube_url || "",
        tiktok_url: data.tiktok_url || "",
        threads_url: data.threads_url || "",
        avatar_url: data.avatar_url || "",
      });
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update(formData)
        .eq("id", user.id);

      if (error) {
        alert("保存に失敗しました");
        console.error(error);
      } else {
        alert("✅ プロフィールが更新されました");
        fetchProfile(user.id);
      }
    } catch (error) {
      console.error(error);
      alert("エラーが発生しました");
    }
    setSaving(false);
  };

  if (loading) return <div style={{ textAlign: "center", padding: "40px" }}>読み込み中...</div>;
  if (!user) return null;

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "40px 20px",
        fontFamily: "'Noto Sans JP', sans-serif",
        background: "#0a0a0f",
        minHeight: "100vh",
        color: "#fff",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>📋 プロフィール設定</h1>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", fontSize: "14px", color: "#ccc", marginBottom: "5px" }}>
          メールアドレス
        </label>
        <input
          type="text"
          value={user.email}
          disabled
          style={{
            width: "100%",
            padding: "10px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "6px",
            color: "#999",
          }}
        />
      </div>

      {/* SNS リンク入力 */}
      <div style={{ marginTop: "30px", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "20px" }}>
        <h3 style={{ marginBottom: "20px", fontSize: "16px" }}>🔗 SNS アカウントを登録</h3>

        {/* OAuth ボタン */}
        <div style={{ marginBottom: "20px", padding: "15px", background: "rgba(100,200,255,0.1)", borderRadius: "8px", border: "1px solid rgba(100,200,255,0.2)" }}>
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", marginBottom: "12px" }}>
            外部アカウントでログインして、プロフィール情報を登録できます
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <button
              onClick={handleXSignIn}
              style={{
                padding: "10px",
                background: "rgba(0,0,0,0.3)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "6px",
                color: "#fff",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.5)")}
              onMouseOut={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.3)")}
            >
              𝕏 X
            </button>
            <button
              onClick={handleGitHubSignIn}
              style={{
                padding: "10px",
                background: "rgba(0,0,0,0.3)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "6px",
                color: "#fff",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.5)")}
              onMouseOut={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.3)")}
            >
              🐙 GitHub
            </button>
            <button
              onClick={handleDiscordSignIn}
              style={{
                padding: "10px",
                background: "rgba(0,0,0,0.3)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "6px",
                color: "#fff",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.5)")}
              onMouseOut={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.3)")}
            >
              💜 Discord
            </button>
          </div>
        </div>

        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginBottom: "15px" }}>
          または、手動で URL を入力：
        </p>

        {[
          { key: "twitter_url", label: "𝕏 X", placeholder: "https://x.com/username" },
          { key: "github_url", label: "🐙 GitHub", placeholder: "https://github.com/username" },
          { key: "discord_url", label: "💜 Discord", placeholder: "https://discord.com/users/userid" },
          { key: "instagram_url", label: "📷 Instagram", placeholder: "https://instagram.com/username" },
          { key: "youtube_url", label: "🎬 YouTube", placeholder: "https://youtube.com/@username" },
          { key: "tiktok_url", label: "🎵 TikTok", placeholder: "https://tiktok.com/@username" },
          { key: "threads_url", label: "@ Threads", placeholder: "https://threads.net/@username" },
          { key: "avatar_url", label: "🖼️ アバター画像 URL", placeholder: "https://example.com/avatar.jpg" },
        ].map((field) => (
          <div key={field.key} style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", fontSize: "13px", color: "#aaa", marginBottom: "5px" }}>
              {field.label}
            </label>
            <input
              type="text"
              placeholder={field.placeholder}
              value={formData[field.key as keyof typeof formData]}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  [field.key]: e.target.value,
                })
              }
              style={{
                width: "100%",
                padding: "10px",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,45,85,0.2)",
                borderRadius: "6px",
                color: "#fff",
                fontSize: "13px",
              }}
            />
          </div>
        ))}
      </div>

      {/* プレビュー */}
      <div
        style={{
          marginTop: "30px",
          padding: "20px",
          background: "rgba(255,45,85,0.05)",
          border: "1px solid rgba(255,45,85,0.2)",
          borderRadius: "8px",
        }}
      >
        <h4 style={{ marginBottom: "15px", fontSize: "14px" }}>👀 プレビュー</h4>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "10px",
          }}
        >
          {formData.avatar_url && (
            <img
              src={formData.avatar_url}
              alt="avatar"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          )}
          <span style={{ fontWeight: 600, color: "#ff2d55" }}>{user.email.split("@")[0]}</span>
        </div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {formData.twitter_url && <span style={{ fontSize: "18px", cursor: "pointer" }}>𝕏</span>}
          {formData.github_url && <span style={{ fontSize: "18px", cursor: "pointer" }}>🐙</span>}
          {formData.discord_url && <span style={{ fontSize: "18px", cursor: "pointer" }}>💜</span>}
          {formData.instagram_url && <span style={{ fontSize: "18px", cursor: "pointer" }}>📷</span>}
          {formData.youtube_url && <span style={{ fontSize: "18px", cursor: "pointer" }}>🎬</span>}
          {formData.tiktok_url && <span style={{ fontSize: "18px", cursor: "pointer" }}>🎵</span>}
          {formData.threads_url && <span style={{ fontSize: "18px", cursor: "pointer" }}>@</span>}
        </div>
      </div>

      {/* 保存ボタン */}
      <button
        onClick={handleSave}
        disabled={saving}
        style={{
          width: "100%",
          padding: "12px",
          marginTop: "30px",
          background: saving ? "rgba(255,45,85,0.3)" : "rgba(255,45,85,0.8)",
          border: "none",
          borderRadius: "6px",
          color: "#fff",
          fontWeight: 600,
          fontSize: "14px",
          cursor: saving ? "not-allowed" : "pointer",
          transition: "all 0.2s",
        }}
        onMouseOver={(e) => {
          if (!saving) e.currentTarget.style.background = "rgba(255,45,85,1)";
        }}
        onMouseOut={(e) => {
          if (!saving) e.currentTarget.style.background = "rgba(255,45,85,0.8)";
        }}
      >
        {saving ? "保存中..." : "💾 プロフィールを保存"}
      </button>

      {/* 戻るボタン */}
      <button
        onClick={() => (window.location.href = "/")}
        style={{
          width: "100%",
          padding: "10px",
          marginTop: "10px",
          background: "transparent",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: "6px",
          color: "#aaa",
          fontWeight: "600",
          fontSize: "13px",
          cursor: "pointer",
        }}
      >
        ← 戻る
      </button>
    </div>
  );
}

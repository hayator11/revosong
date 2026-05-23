import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About | MUSIC CHARTS - AI生成・オリジナル楽曲ランキング",
  description:
    "MUSIC CHARTS（REVOSONG）について。AI生成楽曲とオリジナル楽曲を、みんなの「いいね」でランキング。YouTube、SoundCloud、Spotifyなど複数プラットフォームに対応。誰でも無料で投稿・視聴・投票できるオープンなプラットフォーム。",
  keywords: ["MUSIC CHARTS", "REVOSONG", "AI音楽", "AI生成楽曲", "音楽ランキング", "DTM", "ランキングサイト"],
  authors: [{ name: "おのくん", url: "https://onokun.com/" }],
  openGraph: {
    title: "About | MUSIC CHARTS",
    description: "AI生成・オリジナル楽曲のランキングプラットフォーム「MUSIC CHARTS」について。",
    url: "https://revosong-charts.vercel.app/about",
    siteName: "MUSIC CHARTS",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://onokun.com/#person",
      name: "おのくん",
      alternateName: "onokun",
      url: "https://onokun.com/",
      sameAs: ["https://onokun.com/"],
      description:
        "AI音楽・DTM・クリエイティブ分野で活動するクリエイター。AI生成楽曲ランキングサイト「MUSIC CHARTS」の運営者。",
    },
    {
      "@type": "WebSite",
      "@id": "https://revosong-charts.vercel.app/#website",
      name: "MUSIC CHARTS",
      url: "https://revosong-charts.vercel.app/",
      description: "AI生成・オリジナル楽曲のランキングサイト",
      author: {
        "@id": "https://onokun.com/#person",
      },
      publisher: {
        "@id": "https://onokun.com/#person",
      },
    },
    {
      "@type": "WebPage",
      "@id": "https://revosong-charts.vercel.app/about",
      url: "https://revosong-charts.vercel.app/about",
      name: "運営者情報・おのくん | MUSIC CHARTS",
      isPartOf: { "@id": "https://revosong-charts.vercel.app/#website" },
      about: { "@id": "https://onokun.com/#person" },
    },
  ],
};

export default function AboutPage() {
  return (
    <div className="page-root">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&family=Noto+Sans+JP:wght@400;500;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #0a0a0f; }
        .page-root {
          min-height: 100vh;
          background: #0a0a0f;
          color: #fff;
          font-family: 'Noto Sans JP', sans-serif;
        }
        .page-wrapper {
          max-width: 680px;
          margin: 0 auto;
          padding: 0 16px 80px;
        }
        .page-header {
          padding: 40px 0 24px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          margin-bottom: 24px;
        }
        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: rgba(255,255,255,0.4);
          text-decoration: none;
          font-size: 13px;
          margin-bottom: 20px;
          transition: color 0.2s;
        }
        .back-link:hover { color: rgba(255,255,255,0.8); }
        .page-title {
          font-family: 'Oswald', sans-serif;
          font-size: 28px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          background: linear-gradient(135deg, #ff2d55, #ff9500);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 8px;
        }
        .page-desc {
          font-size: 14px;
          color: rgba(255,255,255,0.55);
          line-height: 1.7;
        }

        /* --- プロフィールカード --- */
        .profile-card {
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          background: rgba(255,255,255,0.02);
          overflow: hidden;
          margin-bottom: 24px;
        }
        .profile-card-header {
          position: relative;
          background: linear-gradient(135deg, rgba(255,45,85,0.12), rgba(94,92,230,0.12));
          padding: 32px 24px 24px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          text-align: center;
        }
        .profile-avatar {
          width: 240px;
          height: 240px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          background: #ffffff;
          border-radius: 50%;
          filter: drop-shadow(0 12px 32px rgba(255,45,85,0.2));
          padding: 20px;
          box-sizing: border-box;
        }
        .profile-avatar img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center;
        }
        .profile-name {
          font-family: 'Oswald', sans-serif;
          font-size: 26px;
          font-weight: 700;
          color: #fff;
          letter-spacing: 1px;
          margin-bottom: 4px;
        }
        .profile-name-en {
          font-size: 13px;
          color: rgba(255,255,255,0.4);
          letter-spacing: 2px;
        }
        .profile-body {
          padding: 24px;
        }
        .profile-bio {
          font-size: 14px;
          line-height: 1.9;
          color: rgba(255,255,255,0.75);
          margin-bottom: 24px;
        }
        .profile-bio strong { color: #fff; }

        /* --- 公式サイトリンク（SEOキーリンク） --- */
        .official-link-section {
          margin-bottom: 24px;
        }
        .section-label {
          font-size: 10px;
          font-weight: 700;
          color: rgba(255,255,255,0.3);
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 10px;
        }
        .official-link-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 18px 20px;
          background: rgba(255,45,85,0.06);
          border: 1px solid rgba(255,45,85,0.25);
          border-radius: 14px;
          text-decoration: none;
          color: inherit;
          transition: all 0.25s;
        }
        .official-link-card:hover {
          background: rgba(255,45,85,0.1);
          border-color: rgba(255,45,85,0.45);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(255,45,85,0.1);
        }
        .official-link-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: linear-gradient(135deg, #ff2d55, #ff6482);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          flex-shrink: 0;
        }
        .official-link-text { flex: 1; min-width: 0; }
        .official-link-name {
          font-size: 16px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 4px;
        }
        .official-link-url {
          font-size: 12px;
          color: rgba(255,45,85,0.8);
        }
        .official-link-arrow {
          font-size: 18px;
          color: rgba(255,45,85,0.6);
          flex-shrink: 0;
        }

        /* --- 活動情報 --- */
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 24px;
        }
        .info-card {
          padding: 16px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
        }
        .info-card-label {
          font-size: 10px;
          font-weight: 700;
          color: rgba(255,255,255,0.3);
          letter-spacing: 1.2px;
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .info-card-value {
          font-size: 13px;
          color: rgba(255,255,255,0.8);
          line-height: 1.5;
        }

        /* --- サイト概要 --- */
        .site-section {
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 18px;
          background: rgba(255,255,255,0.02);
          overflow: hidden;
          margin-bottom: 20px;
        }
        .site-section-header {
          padding: 18px 20px 14px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .site-section-title {
          font-family: 'Oswald', sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: #fff;
          letter-spacing: 1px;
        }
        .site-section-body {
          padding: 18px 20px;
        }
        .site-detail-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .site-detail-item {
          display: flex;
          gap: 12px;
          font-size: 13px;
          color: rgba(255,255,255,0.65);
          line-height: 1.6;
        }
        .site-detail-key {
          color: rgba(255,255,255,0.35);
          font-size: 12px;
          white-space: nowrap;
          flex-shrink: 0;
          width: 72px;
        }

        /* --- フッター --- */
        .page-footer {
          margin-top: 40px;
          padding: 20px 0;
          border-top: 1px solid rgba(255,255,255,0.05);
          text-align: center;
          font-size: 11px;
          color: rgba(255,255,255,0.2);
        }
        .page-footer a {
          color: rgba(255,255,255,0.35);
          text-decoration: none;
        }
        .page-footer a:hover { color: rgba(255,255,255,0.7); }
      `}</style>

      <div className="page-wrapper">
        <header className="page-header">
          <Link href="/" className="back-link">
            ← トップページへ戻る
          </Link>
          <h1 className="page-title">About MUSIC CHARTS</h1>
          <p className="page-desc">
            MUSIC CHARTS / REVOSONG について。サービスの紹介と利用ガイド。
          </p>
        </header>


        {/* おのくんプロフィール */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ width: "240px", height: "240px", margin: "0 auto 16px", background: "#ffffff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", boxSizing: "border-box", filter: "drop-shadow(0 12px 32px rgba(255,45,85,0.2))" }}>
            <img src="/onokun.jpg" alt="おのくん" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
          <h2 style={{ fontSize: "26px", fontWeight: 700, color: "#fff", letterSpacing: "1px", marginBottom: "4px" }}>おのくん</h2>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", letterSpacing: "2px", marginBottom: "16px" }}>onokun</p>
          <a
            href="https://onokun.com/"
            rel="author"
            target="_blank"
            style={{ display: "inline-block", padding: "8px 16px", background: "rgba(255,45,85,0.08)", border: "1px solid rgba(255,45,85,0.25)", borderRadius: "16px", color: "#ff2d55", textDecoration: "none", fontSize: "13px", fontWeight: 600 }}
          >
            🌐 onokun.com
          </a>
        </div>

        {/* サイト概要 */}
        <section className="site-section">
          <div className="site-section-header">
            <div className="site-section-title">MUSIC CHARTS について</div>
          </div>
          <div className="site-section-body">
            <ul className="site-detail-list">
              <li className="site-detail-item">
                <span className="site-detail-key">サービス名</span>
                <span>MUSIC CHARTS — AI生成＆オリジナル楽曲ランキング</span>
              </li>
              <li className="site-detail-item">
                <span className="site-detail-key">URL</span>
                <span>https://revosong-charts.vercel.app/</span>
              </li>
              <li className="site-detail-item">
                <span className="site-detail-key">コンセプト</span>
                <span>AI生成楽曲・オリジナル楽曲を「いいね」数でランキング。誰でも無料で投稿・視聴・投票できるオープンなプラットフォーム</span>
              </li>
              <li className="site-detail-item">
                <span className="site-detail-key">対応サービス</span>
                <span>YouTube・SoundCloud・Spotify・ニコニコ動画・Bandcamp・Audiomack</span>
              </li>
              <li className="site-detail-item">
                <span className="site-detail-key">運営者</span>
                <span>
                  <a
                    href="https://onokun.com/"
                    rel="author"
                    target="_blank"
                    style={{ color: "#ff2d55", textDecoration: "none" }}
                  >
                    おのくん（onokun.com）
                  </a>
                </span>
              </li>
            </ul>
          </div>
        </section>


        {/* 運営情報へのCTAブロック */}
        <section
          style={{
            padding: "28px 24px",
            background: "linear-gradient(135deg, rgba(255,45,85,0.08), rgba(94,92,230,0.08))",
            border: "1px solid rgba(255,45,85,0.2)",
            borderRadius: "18px",
            textAlign: "center",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              color: "rgba(255,255,255,0.5)",
              marginBottom: "6px",
              letterSpacing: "1px",
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            運営者について
          </div>
          <div
            style={{
              fontFamily: "'Oswald', sans-serif",
              fontSize: "22px",
              fontWeight: 700,
              color: "#fff",
              marginBottom: "8px",
            }}
          >
            運営情報ページ
          </div>
          <div
            style={{
              fontSize: "13px",
              color: "rgba(255,255,255,0.55)",
              lineHeight: 1.7,
              marginBottom: "20px",
            }}
          >
            おのくんの紹介と関連プロジェクト・サービス一覧をご覧ください。
          </div>
          <a
            href="/information"
            style={{
              display: "inline-block",
              padding: "13px 36px",
              background: "linear-gradient(135deg, #ff2d55, #ff6482)",
              borderRadius: "28px",
              color: "#fff",
              textDecoration: "none",
              fontSize: "15px",
              fontWeight: 700,
              letterSpacing: "0.5px",
            }}
          >
            👤 運営情報を見る
          </a>
        </section>

        {/* 著作権について - 重要な注意事項 */}
        <section
          style={{
            background: "linear-gradient(135deg, rgba(220,20,60,0.15), rgba(255,69,0,0.15))",
            border: "2px solid #dc143c",
            borderRadius: "16px",
            padding: "28px 24px",
            marginBottom: "48px",
          }}
        >
          <h2
            style={{
              fontSize: "22px",
              fontWeight: 700,
              color: "#ff4500",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            ⚠️ 著作権について - 重要なお知らせ
          </h2>

          <div
            style={{
              background: "rgba(220,20,60,0.08)",
              border: "1px solid rgba(220,20,60,0.3)",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "16px",
            }}
          >
            <p
              style={{
                fontSize: "14px",
                color: "rgba(255,255,255,0.9)",
                lineHeight: 1.9,
                fontWeight: 600,
                margin: "0 0 12px 0",
              }}
            >
              🚫 このプラットフォームに投稿できる楽曲について
            </p>
            <ul
              style={{
                fontSize: "13px",
                color: "rgba(255,255,255,0.85)",
                lineHeight: 1.8,
                margin: "0 0 0 20px",
                paddingLeft: "10px",
              }}
            >
              <li style={{ marginBottom: "8px" }}>
                <strong>AI生成楽曲</strong>：Suno、Udio、MusicLM、Stable Audio など AI音楽ツールで生成した楽曲（著作権フリー）
              </li>
              <li style={{ marginBottom: "8px" }}>
                <strong>オリジナル楽曲</strong>：ご自身が作成・著作権を保有する楽曲のみ
              </li>
              <li>
                <strong style={{ color: "#ff6482" }}>
                  著作権のある既存楽曲の投稿は厳禁です
                </strong>
              </li>
            </ul>
          </div>

          <div
            style={{
              background: "rgba(255,69,0,0.08)",
              border: "1px solid rgba(255,69,0,0.3)",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "16px",
            }}
          >
            <p
              style={{
                fontSize: "14px",
                color: "rgba(255,255,255,0.9)",
                lineHeight: 1.9,
                fontWeight: 600,
                margin: "0 0 12px 0",
              }}
            >
              📋 投稿時のガイドライン
            </p>
            <ul
              style={{
                fontSize: "13px",
                color: "rgba(255,255,255,0.85)",
                lineHeight: 1.8,
                margin: "0 0 0 20px",
                paddingLeft: "10px",
              }}
            >
              <li style={{ marginBottom: "8px" }}>
                投稿楽曲の著作権はご自身に帰属することを確認の上、投稿してください
              </li>
              <li style={{ marginBottom: "8px" }}>
                既存アーティストの楽曲、カバー曲、サンプリング楽曲の投稿はお断りしています
              </li>
              <li>
                楽曲のプロンプト、ジャンル、アーティスト名は正確に記入してください
              </li>
            </ul>
          </div>

          <div
            style={{
              background: "rgba(220,20,60,0.1)",
              border: "1px solid rgba(220,20,60,0.4)",
              borderRadius: "12px",
              padding: "16px",
            }}
          >
            <p
              style={{
                fontSize: "14px",
                color: "rgba(255,255,255,0.9)",
                lineHeight: 1.9,
                fontWeight: 600,
                margin: "0 0 12px 0",
              }}
            >
              🔍 違反が判明した場合
            </p>
            <p
              style={{
                fontSize: "13px",
                color: "rgba(255,255,255,0.85)",
                lineHeight: 1.8,
                margin: 0,
              }}
            >
              著作権侵害の投稿が判明した場合、<strong>運営サイド判断により予告なく削除</strong>いたします。著作権の侵害にあたる投稿の責任は投稿者に帰属します。当プラットフォームは著作権侵害への一切の責任を負いません。
            </p>
          </div>
        </section>

        <footer className="page-footer">
          <p>
            &copy; 2025 MUSIC CHARTS — 運営：
            <a href="https://onokun.com/" rel="author" target="_blank">
              おのくん
            </a>
          </p>
          <p style={{ marginTop: 8 }}>
            <Link href="/">トップ</Link>
            {" · "}
            <Link href="/services">対応サービス</Link>
            {" · "}
            <Link href="/about">About</Link>
            {" · "}
            <Link href="/information">運営情報</Link>
          </p>
        </footer>
      </div>
    </div>
  );
}

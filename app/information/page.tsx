import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "運営情報・おのくん | MUSIC CHARTS",
  description:
    "MUSIC CHARTSの運営者、おのくん（onokun）のプロフィールページ。AI音楽・DTM・クリエイティブ分野で活動するおのくんが運営するAI生成楽曲ランキングサイトです。",
  keywords: ["おのくん", "onokun", "AI音楽", "DTM", "AI生成楽曲", "MUSIC CHARTS", "運営者"],
  authors: [{ name: "おのくん", url: "https://onokun.com/" }],
  openGraph: {
    title: "運営情報・おのくん | MUSIC CHARTS",
    description: "MUSIC CHARTSの運営者、おのくんのプロフィールと活動紹介。",
    url: "https://ai-music-charts.vercel.app/information",
    siteName: "MUSIC CHARTS",
    type: "profile",
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
      "@id": "https://ai-music-charts.vercel.app/#website",
      name: "MUSIC CHARTS",
      url: "https://ai-music-charts.vercel.app/",
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
      "@id": "https://ai-music-charts.vercel.app/information",
      url: "https://ai-music-charts.vercel.app/information",
      name: "運営情報・おのくん | MUSIC CHARTS",
      isPartOf: { "@id": "https://ai-music-charts.vercel.app/#website" },
      about: { "@id": "https://onokun.com/#person" },
    },
  ],
};

export default function InformationPage() {
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

        /* --- プロジェクト・サービスリスト --- */
        .project-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }
        .project-card {
          padding: 16px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          text-decoration: none;
          color: inherit;
          transition: all 0.25s;
          cursor: pointer;
          display: block;
        }
        .project-card:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.15);
          transform: translateY(-2px);
        }
        .project-name {
          font-size: 14px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 4px;
        }
        .project-desc {
          font-size: 12px;
          color: rgba(255,255,255,0.55);
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
          <h1 className="page-title">Information / 運営情報</h1>
          <p className="page-desc">
            MUSIC CHARTS の運営者とサイトについてご紹介します。
          </p>
        </header>

        {/* プロフィールカード */}
        <section className="profile-card">
          <div className="profile-card-header">
            <div className="profile-avatar">
            <img src="/onokun.jpg" alt="おのくん" />
          </div>
            <div className="profile-name">おのくん</div>
            <div className="profile-name-en">onokun</div>
          </div>
          <div className="profile-body">
            <p className="profile-bio">
              はじめまして、<strong>おのくん</strong>です。
              AI音楽・DTM・デジタルクリエイティブの分野で活動しています。
              <br /><br />
              AI技術が音楽制作にもたらす可能性に魅了され、AI生成楽曲や純粋に音楽が好きな人たちのためのアーティストコミュニティの発展を目指してMUSIC CHARTS<strong>「REVOSONG」</strong>を立ち上げました。
              誰もが自分の楽曲を気軽に投稿・共有できる場所を作りたいという想いで運営しています。
              <br /><br />
              音楽・AI・テクノロジーに関する情報は、公式サイトでも発信しています。ぜひご覧ください。
            </p>

            {/* 公式サイトリンク（SEOの核心 - dofollow） */}
            <div className="official-link-section">
              <div className="section-label">公式サイト</div>
              <a
                href="https://onokun.com/"
                rel="author"
                target="_blank"
                className="official-link-card"
                aria-label="おのくん公式ホームページ"
              >
                <div className="official-link-icon">🌐</div>
                <div className="official-link-text">
                  <div className="official-link-name">おのくん公式ホームページ</div>
                  <div className="official-link-url">https://onokun.com/</div>
                </div>
                <div className="official-link-arrow">→</div>
              </a>
            </div>

            {/* 活動情報グリッド */}
            <div className="section-label">活動情報</div>
            <div className="info-grid">
              <div className="info-card">
                <div className="info-card-label">活動分野</div>
                <div className="info-card-value">AI音楽 / DTM / デジタルクリエイティブ</div>
              </div>
              <div className="info-card">
                <div className="info-card-label">運営サービス</div>
                <div className="info-card-value">MUSIC CHARTS（AI音楽ランキング）</div>
              </div>
              <div className="info-card">
                <div className="info-card-label">公式サイト</div>
                <div className="info-card-value">
                  <a
                    href="https://onokun.com/"
                    rel="author"
                    target="_blank"
                    style={{ color: "#ff2d55", textDecoration: "none" }}
                  >
                    onokun.com
                  </a>
                </div>
              </div>
              <div className="info-card">
                <div className="info-card-label">サービス開始</div>
                <div className="info-card-value">2025年</div>
              </div>
            </div>
          </div>
        </section>

        {/* おのくんの関連プロジェクト・サービス一覧 */}
        <section className="site-section">
          <div className="site-section-header">
            <div className="site-section-title">おのくんの プロジェクト・サービス</div>
          </div>
          <div className="site-section-body">
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.65)", marginBottom: "16px", lineHeight: 1.7 }}>
              <strong>ドメインランク向上戦略：</strong> 複数の関連サービスを運営し、相互にリンクを張ることで、検索エンジンからの信頼性を高め、ドメイン全体の認知度とランキングを向上させます。
            </p>
            <div className="project-grid">
              {/* MUSIC CHARTS - REVOSONG */}
              <a
                href="https://revosong-charts.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="project-card"
                style={{
                  background: "rgba(0,212,255,0.08)",
                  borderColor: "rgba(0,212,255,0.3)"
                }}
              >
                <div className="project-name">🎵 MUSIC CHARTS / REVOSONG</div>
                <div className="project-desc">AI生成・オリジナル楽曲ランキングサイト</div>
              </a>

              {/* レボリストLab */}
              <a
                href="https://revolist.earth/revolist-lab"
                target="_blank"
                rel="noopener noreferrer"
                className="project-card"
                style={{
                  background: "rgba(255,165,0,0.08)",
                  borderColor: "rgba(255,165,0,0.3)"
                }}
              >
                <div className="project-name">🔬 レボリストLab</div>
                <div className="project-desc">revolist.earth / X @REVOLIST11</div>
              </a>

              {/* 防災×帽祭 */}
              <a
                href="https://revolist.earth/bosai-bosai"
                target="_blank"
                rel="noopener noreferrer"
                className="project-card"
                style={{
                  background: "rgba(220,20,60,0.08)",
                  borderColor: "rgba(220,20,60,0.3)"
                }}
              >
                <div className="project-name">🎩 防災×帽祭</div>
                <div className="project-desc">revolist.earth / X @Bosai_Bosai_</div>
              </a>

              {/* レボリンク */}
              <a
                href="https://onokun.com/socially-responsible-sponsorship/"
                target="_blank"
                rel="noopener noreferrer"
                className="project-card"
                style={{
                  background: "rgba(50,205,50,0.08)",
                  borderColor: "rgba(50,205,50,0.3)"
                }}
              >
                <div className="project-name">🔗 レボリンク</div>
                <div className="project-desc">Socially Responsible Sponsorship</div>
              </a>

              {/* レボファンディング */}
              <a
                href="https://hayator11.github.io/revofunding/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="project-card"
                style={{
                  background: "rgba(138,43,226,0.08)",
                  borderColor: "rgba(138,43,226,0.3)"
                }}
              >
                <div className="project-name">💰 レボファンディング</div>
                <div className="project-desc">Crowdfunding Platform</div>
              </a>

              {/* レボアート */}
              <a
                href="https://hayator11.github.io/revofunding/revo-art.html"
                target="_blank"
                rel="noopener noreferrer"
                className="project-card"
                style={{
                  background: "rgba(255,20,147,0.08)",
                  borderColor: "rgba(255,20,147,0.3)"
                }}
              >
                <div className="project-name">🎨 レボアート</div>
                <div className="project-desc">Digital Art & Creator Platform</div>
              </a>

              {/* レボハット */}
              <a
                href="https://onokun.com/hat-model-academy/"
                target="_blank"
                rel="noopener noreferrer"
                className="project-card"
                style={{
                  background: "rgba(0,191,255,0.08)",
                  borderColor: "rgba(0,191,255,0.3)"
                }}
              >
                <div className="project-name">🎓 レボハット</div>
                <div className="project-desc">Hat Model Academy</div>
              </a>

              {/* 代表 @hayator */}
              <a
                href="https://hayator.socialimagine.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="project-card"
                style={{
                  background: "rgba(255,192,203,0.08)",
                  borderColor: "rgba(255,192,203,0.3)"
                }}
              >
                <div className="project-name">👤 代表 @hayator</div>
                <div className="project-desc">hayator.socialimagine.com / X @Hayator</div>
              </a>
            </div>
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

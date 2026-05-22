import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "運営情報・おのくん | MUSIC CHARTS",
  description: "MUSIC CHARTS の運営者おのくんのプロフィール、関連プロジェクト、サービス一覧。",
  keywords: ["おのくん", "onokun", "MUSIC CHARTS", "REVOSONG", "運営者"],
};

export default function InformationPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#fff", fontFamily: "'Noto Sans JP', sans-serif", padding: "40px 16px 80px" }}>
      <div style={{ maxWidth: "680px", margin: "0 auto" }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "rgba(255,255,255,0.4)", textDecoration: "none", fontSize: "13px", marginBottom: "20px" }}>
          ← トップページへ戻る
        </Link>

        <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>運営情報</h1>
        <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginBottom: "32px" }}>
          MUSIC CHARTS の運営者とサービスについてご紹介します。
        </p>

        {/* プロフィールセクション */}
        <section style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", background: "rgba(255,255,255,0.02)", overflow: "hidden", marginBottom: "24px" }}>
          <div style={{ background: "linear-gradient(135deg, rgba(255,45,85,0.12), rgba(94,92,230,0.12))", padding: "32px 24px 24px", textAlign: "center" }}>
            <div style={{ width: "240px", height: "240px", margin: "0 auto 16px", background: "#ffffff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", boxSizing: "border-box" }}>
              <img src="/onokun.jpg" alt="おのくん" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </div>
            <div style={{ fontSize: "26px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>おのくん</div>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", letterSpacing: "2px" }}>onokun</div>
          </div>

          <div style={{ padding: "24px" }}>
            <p style={{ fontSize: "14px", lineHeight: 1.9, color: "rgba(255,255,255,0.75)", marginBottom: "24px" }}>
              はじめまして、<strong>おのくん</strong>です。<br />
              音楽制作・DTM・デジタルクリエイティブの分野で活動しています。
              <br /><br />
              AI生成楽曲やオリジナル楽曲など、すべてのクリエイターたちが自分の音楽を発表できるアーティストコミュニティを作りたいという想いで、MUSIC CHARTS<strong>「REVOSONG」</strong>を立ち上げました。
              ジャンルやツールを問わず、誰もが気軽に投稿・共有・応援できるオープンなプラットフォームを目指しています。
            </p>

            <div style={{ marginBottom: "16px" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "10px" }}>公式サイト</div>
              <a href="https://onokun.com/" target="_blank" rel="author" style={{ display: "flex", alignItems: "center", gap: "16px", padding: "18px 20px", background: "rgba(255,45,85,0.06)", border: "1px solid rgba(255,45,85,0.25)", borderRadius: "14px", textDecoration: "none", color: "inherit", transition: "all 0.25s" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "linear-gradient(135deg, #ff2d55, #ff6482)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>🌐</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "16px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>おのくん公式ホームページ</div>
                  <div style={{ fontSize: "12px", color: "rgba(255,45,85,0.8)" }}>https://onokun.com/</div>
                </div>
                <div style={{ fontSize: "18px", color: "rgba(255,45,85,0.6)" }}>→</div>
              </a>
            </div>
          </div>
        </section>

        {/* プロジェクトセクション */}
        <section style={{ border: "1px solid rgba(255,255,255,0.07)", borderRadius: "18px", background: "rgba(255,255,255,0.02)", overflow: "hidden", marginBottom: "24px" }}>
          <div style={{ padding: "18px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "#fff", letterSpacing: "1px" }}>プロジェクト・サービス</div>
          </div>
          <div style={{ padding: "18px 20px" }}>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.65)", marginBottom: "16px", lineHeight: 1.7 }}>
              <strong>ドメインランク向上戦略：</strong> 複数の関連サービスを運営し、相互にリンクを張ることで、検索エンジンからの信頼性を高め、ドメイン全体の認知度とランキングを向上させます。
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}>
              <a href="https://revosong-charts.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ padding: "16px", background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.3)", borderRadius: "12px", color: "#00d4ff", textDecoration: "none", transition: "all 0.25s", cursor: "pointer", display: "block" }}>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>🎵 MUSIC CHARTS / REVOSONG</div>
                <div style={{ fontSize: "12px", color: "rgba(0,212,255,0.7)" }}>AI生成・オリジナル楽曲ランキングサイト</div>
              </a>

              <a href="https://revolist.earth/revolist-lab" target="_blank" rel="noopener noreferrer" style={{ padding: "16px", background: "rgba(255,165,0,0.08)", border: "1px solid rgba(255,165,0,0.3)", borderRadius: "12px", color: "#ffa500", textDecoration: "none", transition: "all 0.25s", cursor: "pointer", display: "block" }}>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>🔬 レボリストLab</div>
                <div style={{ fontSize: "12px", color: "rgba(255,165,0,0.7)" }}>revolist.earth / X @REVOLIST11</div>
              </a>

              <a href="https://revolist.earth/bosai-bosai" target="_blank" rel="noopener noreferrer" style={{ padding: "16px", background: "rgba(220,20,60,0.08)", border: "1px solid rgba(220,20,60,0.3)", borderRadius: "12px", color: "#dc143c", textDecoration: "none", transition: "all 0.25s", cursor: "pointer", display: "block" }}>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>🎩 防災×帽祭</div>
                <div style={{ fontSize: "12px", color: "rgba(220,20,60,0.7)" }}>revolist.earth / X @Bosai_Bosai_</div>
              </a>

              <a href="https://onokun.com/socially-responsible-sponsorship/" target="_blank" rel="noopener noreferrer" style={{ padding: "16px", background: "rgba(50,205,50,0.08)", border: "1px solid rgba(50,205,50,0.3)", borderRadius: "12px", color: "#32cd32", textDecoration: "none", transition: "all 0.25s", cursor: "pointer", display: "block" }}>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>🔗 レボリンク</div>
                <div style={{ fontSize: "12px", color: "rgba(50,205,50,0.7)" }}>Socially Responsible Sponsorship</div>
              </a>

              <a href="https://hayator11.github.io/revofunding/index.html" target="_blank" rel="noopener noreferrer" style={{ padding: "16px", background: "rgba(138,43,226,0.08)", border: "1px solid rgba(138,43,226,0.3)", borderRadius: "12px", color: "#8a2be2", textDecoration: "none", transition: "all 0.25s", cursor: "pointer", display: "block" }}>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>💰 レボファンディング</div>
                <div style={{ fontSize: "12px", color: "rgba(138,43,226,0.7)" }}>Crowdfunding Platform</div>
              </a>

              <a href="https://hayator11.github.io/revofunding/revo-art.html" target="_blank" rel="noopener noreferrer" style={{ padding: "16px", background: "rgba(255,20,147,0.08)", border: "1px solid rgba(255,20,147,0.3)", borderRadius: "12px", color: "#ff1493", textDecoration: "none", transition: "all 0.25s", cursor: "pointer", display: "block" }}>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>🎨 レボアート</div>
                <div style={{ fontSize: "12px", color: "rgba(255,20,147,0.7)" }}>Digital Art & Creator Platform</div>
              </a>

              <a href="https://onokun.com/hat-model-academy/" target="_blank" rel="noopener noreferrer" style={{ padding: "16px", background: "rgba(0,191,255,0.08)", border: "1px solid rgba(0,191,255,0.3)", borderRadius: "12px", color: "#00bfff", textDecoration: "none", transition: "all 0.25s", cursor: "pointer", display: "block" }}>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>🎓 レボハット</div>
                <div style={{ fontSize: "12px", color: "rgba(0,191,255,0.7)" }}>Hat Model Academy</div>
              </a>

              <a href="https://hayator.socialimagine.com/" target="_blank" rel="noopener noreferrer" style={{ padding: "16px", background: "rgba(255,192,203,0.08)", border: "1px solid rgba(255,192,203,0.3)", borderRadius: "12px", color: "#ffc0cb", textDecoration: "none", transition: "all 0.25s", cursor: "pointer", display: "block" }}>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>👤 代表 @hayator</div>
                <div style={{ fontSize: "12px", color: "rgba(255,192,203,0.7)" }}>hayator.socialimagine.com / X @Hayator</div>
              </a>
            </div>
          </div>
        </section>

        {/* フッター */}
        <footer style={{ marginTop: "40px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.05)", textAlign: "center", fontSize: "11px", color: "rgba(255,255,255,0.2)" }}>
          <p>&copy; 2025 MUSIC CHARTS — 運営: <a href="https://onokun.com/" target="_blank" rel="author" style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>おのくん</a></p>
          <p style={{ marginTop: "8px" }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>トップ</Link>
            {" · "}
            <Link href="/services" style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>対応サービス</Link>
            {" · "}
            <Link href="/about" style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>About</Link>
            {" · "}
            <Link href="/information" style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>運営情報</Link>
          </p>
        </footer>
      </div>
    </div>
  );
}

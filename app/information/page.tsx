import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "運営情報・おのくん | MUSIC CHARTS REVOSONG",
  description: "MUSIC CHARTS（REVOSONG）の運営者おのくんが展開する複数のクリエイティブプロジェクト・社会貢献事業。防災、アート、音楽、ファッションを通じた創造的コミュニティの発展を目指しています。",
  keywords: ["おのくん", "onokun", "REVOSONG", "MUSIC CHARTS", "社会貢献", "クリエイティブ", "コミュニティ", "防災", "音楽", "ドメインランク"],
};

export default function InformationPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#fff", fontFamily: "'Noto Sans JP', sans-serif", padding: "40px 16px 80px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "rgba(255,255,255,0.4)", textDecoration: "none", fontSize: "13px", marginBottom: "20px" }}>
          ← トップページへ戻る
        </Link>

        <h1 style={{ fontSize: "32px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>運営情報</h1>
        <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginBottom: "32px" }}>
          MUSIC CHARTS（REVOSONG）の運営者と関連プロジェクトについてご紹介します。
        </p>

        {/* ビジョンセクション */}
        <section style={{ border: "1px solid rgba(255,45,85,0.25)", borderRadius: "18px", background: "rgba(255,45,85,0.06)", padding: "28px 24px", marginBottom: "32px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#fff", marginBottom: "16px" }}>🌟 おのくんのビジョン</h2>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)", lineHeight: 2, marginBottom: "16px" }}>
            <strong>「創造性」「社会貢献」「つながり」「自己表現」</strong>を軸に、複数のプロジェクトを展開しています。
          </p>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.75)", lineHeight: 1.9 }}>
            AI生成楽曲やオリジナル楽曲、防災教育、ファッション、アート、クラウドファンディングなど、様々な分野を通じて、すべてのクリエイターや活動家が自分の可能性を発揮できるオープンで包括的なコミュニティの構築を目指しています。<br /><br />
            これらのプロジェクトは独立しながらも相互に支援し合い、社会全体への良い影響を波及させていく「創造的エコシステム」として機能します。
          </p>
        </section>

        {/* プロフィールセクション */}
        <section style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", background: "rgba(255,255,255,0.02)", overflow: "hidden", marginBottom: "32px" }}>
          <div style={{ background: "linear-gradient(135deg, rgba(255,45,85,0.12), rgba(94,92,230,0.12))", padding: "32px 24px 24px", textAlign: "center" }}>
            <div style={{ width: "200px", height: "200px", margin: "0 auto 16px", background: "#ffffff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", boxSizing: "border-box" }}>
              <img src="/onokun.jpg" alt="おのくん" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </div>
            <div style={{ fontSize: "26px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>おのくん</div>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", letterSpacing: "2px" }}>onokun</div>
          </div>

          <div style={{ padding: "28px" }}>
            <p style={{ fontSize: "14px", lineHeight: 2, color: "rgba(255,255,255,0.8)", marginBottom: "24px" }}>
              クリエイター、起業家として、音楽制作・DTM・デジタルクリエイティブの分野で活動しています。<br /><br />
              <strong>東日本大震災後のボランティア経験</strong>から社会課題解決への関心が深まり、従来の枠組みではカバーできない社会課題に対して、創造的でカジュアルなアプローチで取り組むことを信条としています。<br /><br />
              <strong>「防災を、かろやかに」「イメージできれば何でも出来る」</strong>という哲学の下、複数のプロジェクトを通じて、クリエイターたちのつながりと社会への貢献を実現しています。
            </p>

            <div style={{ marginBottom: "24px" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "10px" }}>公式サイト</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "10px" }}>
                <a href="https://onokun.com/" target="_blank" rel="author" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 16px", background: "rgba(255,45,85,0.06)", border: "1px solid rgba(255,45,85,0.25)", borderRadius: "12px", textDecoration: "none", color: "inherit", transition: "all 0.25s" }}>
                  <div style={{ fontSize: "18px" }}>🌐</div>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>onokun.com</div>
                    <div style={{ fontSize: "11px", color: "rgba(255,45,85,0.7)" }}>Official Homepage</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ドメインランク戦略セクション */}
        <section style={{ border: "1px solid rgba(0,212,255,0.25)", borderRadius: "18px", background: "rgba(0,212,255,0.06)", padding: "28px 24px", marginBottom: "32px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#00d4ff", marginBottom: "16px" }}>🔗 相互支援エコシステムとドメインランク戦略</h2>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)", lineHeight: 2 }}>
            複数の関連サービスを運営し、<strong>相互にリンク</strong>することで、検索エンジンからの信頼性を高め、ドメイン全体の認知度を向上させます。<br /><br />
            <strong>各プロジェクトの特徴：</strong><br />
            • 独立した専門領域（音楽、防災、社会貢献、アート、ファッション）を持つ<br />
            • すべて「創造性」「社会貢献」「つながり」の理念で一貫している<br />
            • 相互参照と連携により、訪問者の滞在時間・エンゲージメントが向上<br />
            • E-E-A-T（経験、専門性、権威性、信頼性）の強化につながる
          </p>
        </section>

        {/* プロジェクトセクション */}
        <section style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#fff", marginBottom: "20px" }}>📌 プロジェクト・サービス一覧</h2>

          {/* MUSIC CHARTS */}
          <div style={{ border: "1px solid rgba(0,212,255,0.3)", borderRadius: "14px", background: "rgba(0,212,255,0.05)", padding: "20px", marginBottom: "24px" }}>
            <a href="https://revosong-charts.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ display: "block", textDecoration: "none", color: "inherit" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#00d4ff", marginBottom: "8px" }}>🎵 MUSIC CHARTS / REVOSONG</h3>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", lineHeight: 1.8 }}>
                <strong>AI生成楽曲・オリジナル楽曲のランキングサイト。</strong>Suno、Udio、MusicLM、Stable Audio などのAI音楽ツールで生成した楽曲から、純粋に音楽が好きなクリエイターたちが投稿したオリジナル楽曲まで、すべてのアーティストが自分の作品を発表できるオープンなプラットフォーム。YouTube、SoundCloud、Spotify、ニコニコ動画など複数のプラットフォームに対応。
              </p>
            </a>
          </div>

          {/* レボリスト関連プロジェクト群 */}
          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: 700, color: "rgba(255,255,255,0.6)", marginBottom: "16px", paddingLeft: "4px", borderLeft: "3px solid rgba(255,165,0,0.6)" }}>
              🚀 おのくんのボランティア活動から生まれた「レボリスト」プロジェクト群
            </h3>

            {/* レボリストLab */}
            <div style={{ border: "1px solid rgba(255,165,0,0.3)", borderRadius: "14px", background: "rgba(255,165,0,0.05)", padding: "20px", marginBottom: "12px" }}>
              <a href="https://revolist.earth/revolist-lab" target="_blank" rel="noopener noreferrer" style={{ display: "block", textDecoration: "none", color: "inherit" }}>
                <h4 style={{ fontSize: "15px", fontWeight: 700, color: "#ffa500", marginBottom: "6px" }}>🔬 レボリストLab</h4>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}>
                  <strong>「防災を、かろやかに」というコンセプト</strong>から生まれた組織。インタビュー企画、ハットランウェイ、ものづくりLab、防災×帽祭など多様なプロジェクトを通じて、社会課題に創造的に取り組みます。個人の力を活かして社会変革をもたらすことがビジョン。
                </p>
              </a>
            </div>

            {/* 防災×帽祭 */}
            <div style={{ border: "1px solid rgba(220,20,60,0.3)", borderRadius: "14px", background: "rgba(220,20,60,0.05)", padding: "20px", marginBottom: "12px" }}>
              <a href="https://revolist.earth/bosai-bosai" target="_blank" rel="noopener noreferrer" style={{ display: "block", textDecoration: "none", color: "inherit" }}>
                <h4 style={{ fontSize: "15px", fontWeight: 700, color: "#dc143c", marginBottom: "6px" }}>🎩 防災×帽祭（Bosai×Bosai）</h4>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}>
                  <strong>ハットを通じた防災意識向上プロジェクト。</strong>華やかでカラフルなハットをかぶることで心理的な変容をもたらし、堅苦しい避難訓練をエンターテインメント化。全国約20万校、605万人の小学生へのリーチを目指し、災害時の相互支援体制構築を推進しています。
                </p>
              </a>
            </div>

            {/* レボリンク */}
            <div style={{ border: "1px solid rgba(50,205,50,0.3)", borderRadius: "14px", background: "rgba(50,205,50,0.05)", padding: "20px", marginBottom: "12px" }}>
              <a href="https://onokun.com/socially-responsible-sponsorship/" target="_blank" rel="noopener noreferrer" style={{ display: "block", textDecoration: "none", color: "inherit" }}>
                <h4 style={{ fontSize: "15px", fontWeight: 700, color: "#32cd32", marginBottom: "6px" }}>🔗 レボリンク</h4>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}>
                  <strong>社会貢献型広告収益スポンサープログラム。</strong>「普通の買い物が、誰かの応援になる仕組み」を実現。消費者が特別なコストを負担せず、日常の購買行為が防災教育やコミュニティ事業を支援。透明性、日常性、循環を三つの核心価値としています。
                </p>
              </a>
            </div>

            {/* レボファンディング */}
            <div style={{ border: "1px solid rgba(138,43,226,0.3)", borderRadius: "14px", background: "rgba(138,43,226,0.05)", padding: "20px", marginBottom: "12px" }}>
              <a href="https://hayator11.github.io/revofunding/index.html" target="_blank" rel="noopener noreferrer" style={{ display: "block", textDecoration: "none", color: "inherit" }}>
                <h4 style={{ fontSize: "15px", fontWeight: 700, color: "#8a2be2", marginBottom: "6px" }}>💰 レボファンディング</h4>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}>
                  クラウドファンディングプラットフォーム。創造的で社会貢献的なプロジェクトの資金調達を支援し、アイデアを実現させるための仕組みを提供します。
                </p>
              </a>
            </div>

            {/* レボアート */}
            <div style={{ border: "1px solid rgba(255,20,147,0.3)", borderRadius: "14px", background: "rgba(255,20,147,0.05)", padding: "20px", marginBottom: "12px" }}>
              <a href="https://hayator11.github.io/revofunding/revo-art.html" target="_blank" rel="noopener noreferrer" style={{ display: "block", textDecoration: "none", color: "inherit" }}>
                <h4 style={{ fontSize: "15px", fontWeight: 700, color: "#ff1493", marginBottom: "6px" }}>🎨 レボアート</h4>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}>
                  デジタルアートとクリエイター向けプラットフォーム。アーティストの作品発表と相互支援を通じて、創造的コミュニティを育成します。
                </p>
              </a>
            </div>

            {/* レボハット */}
            <div style={{ border: "1px solid rgba(0,191,255,0.3)", borderRadius: "14px", background: "rgba(0,191,255,0.05)", padding: "20px" }}>
              <a href="https://onokun.com/hat-model-academy/" target="_blank" rel="noopener noreferrer" style={{ display: "block", textDecoration: "none", color: "inherit" }}>
                <h4 style={{ fontSize: "15px", fontWeight: 700, color: "#00bfff", marginBottom: "6px" }}>🎓 レボハット（Hat Model Academy）</h4>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}>
                  <strong>日本初の「ハットモデル・アカデミー」。</strong>帽子を「表現の武器」として、身体表現とハットの融合を探求。ゼロから新しい文化を共に創造する開拓者を募集。ハットランウェイ、パフォーマンス、セルフブランディングを通じて新しい働き方を実践しています。
                </p>
              </a>
            </div>
          </div>

          {/* @hayator */}
          <div style={{ padding: "12px 16px", background: "rgba(255,192,203,0.05)", border: "1px solid rgba(255,192,203,0.15)", borderRadius: "12px", marginTop: "16px" }}>
            <a href="https://hayator.socialimagine.com/" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", color: "inherit" }}>
              <span style={{ fontSize: "14px" }}>👤</span>
              <span style={{ fontSize: "12px", color: "rgba(255,192,203,0.8)" }}>
                <strong>@hayator</strong> — Representative Blog / Philosophy & Thoughts
              </span>
            </a>
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

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "運営情報 | MUSIC CHARTS REVOSONG",
  description: "REVOSONGとレボリストシリーズ、おのくんの社会貢献活動について。東日本大震災後のボランティア経験から生まれた、創造性と社会貢献を両立させるプロジェクト群。",
  keywords: ["おのくん", "REVOSONG", "レボリスト", "社会貢献", "防災", "音楽", "クリエイティブ"],
};

export default function InformationPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#fff", fontFamily: "'Noto Sans JP', sans-serif", padding: "40px 16px 80px" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "rgba(255,255,255,0.4)", textDecoration: "none", fontSize: "13px", marginBottom: "20px" }}>
          ← トップページへ戻る
        </Link>

        {/* レボリストLabロゴ */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <img src="/revolist-lab.jpg" alt="レボリストLab" style={{ height: "140px", width: "auto", objectFit: "contain" }} />
        </div>

        <h1 style={{ fontSize: "36px", fontWeight: 700, color: "#fff", marginBottom: "12px", letterSpacing: "2px", textAlign: "center" }}>運営情報</h1>
        <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginBottom: "40px", textAlign: "center" }}>
          REVOSONG、レボリストシリーズ、そしておのくんの社会貢献活動について
        </p>

        {/* SVG図解 */}
        <div style={{ background: "rgba(255,45,85,0.08)", border: "1px solid rgba(255,45,85,0.2)", borderRadius: "20px", padding: "40px 20px", marginBottom: "48px", overflow: "auto" }}>
          <svg viewBox="0 0 800 700" style={{ width: "100%", height: "auto", minHeight: "500px" }}>
            {/* タイトル */}
            <text x="400" y="40" fontSize="24" fontWeight="700" textAnchor="middle" fill="#fff">
              REVOSONG エコシステム
            </text>

            {/* REVOSONG */}
            <circle cx="400" cy="100" r="45" fill="rgba(0,212,255,0.3)" stroke="#00d4ff" strokeWidth="2" />
            <text x="400" y="110" fontSize="16" fontWeight="700" textAnchor="middle" fill="#00d4ff">
              REVOSONG
            </text>

            {/* 矢印（下） */}
            <line x1="400" y1="145" x2="400" y2="190" stroke="rgba(255,255,255,0.3)" strokeWidth="2" markerEnd="url(#arrowhead)" />

            {/* レボシリーズ */}
            <g>
              {/* 背景ボックス */}
              <rect x="120" y="190" width="560" height="120" fill="rgba(255,165,0,0.1)" stroke="rgba(255,165,0,0.4)" strokeWidth="2" rx="10" />

              {/* タイトル */}
              <text x="400" y="215" fontSize="14" fontWeight="700" textAnchor="middle" fill="#ffa500">
                レボリストシリーズ
              </text>

              {/* 各プロジェクト */}
              <circle cx="160" cy="270" r="28" fill="rgba(255,165,0,0.3)" stroke="#ffa500" strokeWidth="1" />
              <text x="160" y="275" fontSize="11" textAnchor="middle" fill="#fff">Lab</text>

              <circle cx="240" cy="270" r="28" fill="rgba(220,20,60,0.3)" stroke="#dc143c" strokeWidth="1" />
              <text x="240" y="275" fontSize="11" textAnchor="middle" fill="#fff">防災</text>

              <circle cx="320" cy="270" r="28" fill="rgba(50,205,50,0.3)" stroke="#32cd32" strokeWidth="1" />
              <text x="320" y="275" fontSize="11" textAnchor="middle" fill="#fff">リンク</text>

              <circle cx="400" cy="270" r="28" fill="rgba(138,43,226,0.3)" stroke="#8a2be2" strokeWidth="1" />
              <text x="400" y="275" fontSize="11" textAnchor="middle" fill="#fff">ファン</text>

              <circle cx="480" cy="270" r="28" fill="rgba(255,20,147,0.3)" stroke="#ff1493" strokeWidth="1" />
              <text x="480" y="275" fontSize="11" textAnchor="middle" fill="#fff">アート</text>

              <circle cx="560" cy="270" r="28" fill="rgba(0,191,255,0.3)" stroke="#00bfff" strokeWidth="1" />
              <text x="560" y="275" fontSize="11" textAnchor="middle" fill="#fff">ハット</text>
            </g>

            {/* 矢印（上からおのくん） */}
            <line x1="400" y1="310" x2="400" y2="360" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />

            {/* おのくん */}
            <circle cx="400" cy="420" r="50" fill="rgba(255,45,85,0.2)" stroke="#ff2d55" strokeWidth="3" />
            <text x="400" y="420" fontSize="18" fontWeight="700" textAnchor="middle" textAnchor="middle" fill="#ff2d55">
              おのくん
            </text>

            {/* 矢印（下） */}
            <line x1="400" y1="470" x2="400" y2="510" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />

            {/* 活動 + 防災×帽祭 */}
            <g>
              <rect x="150" y="510" width="500" height="100" fill="rgba(255,192,203,0.1)" stroke="rgba(255,192,203,0.4)" strokeWidth="2" rx="10" />
              <text x="400" y="535" fontSize="14" fontWeight="700" textAnchor="middle" fill="#fff">
                各種の社会貢献活動
              </text>
              <text x="400" y="560" fontSize="12" textAnchor="middle" fill="rgba(255,255,255,0.8)">
                防災×帽祭 / ボランティア / コミュニティ など
              </text>
              <text x="400" y="585" fontSize="11" textAnchor="middle" fill="rgba(255,192,203,0.9)" fontStyle="italic">
                ✨ すべてが社会貢献型の取り組み
              </text>
            </g>

            {/* 矢印（下） */}
            <line x1="400" y1="610" x2="400" y2="650" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />

            {/* @hayator */}
            <circle cx="400" cy="680" r="35" fill="rgba(255,192,203,0.2)" stroke="#ff1493" strokeWidth="2" />
            <text x="400" y="690" fontSize="13" fontWeight="700" textAnchor="middle" fill="#ff1493">
              @hayator
            </text>

            {/* 矢印の定義 */}
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                <polygon points="0 0, 10 3, 0 6" fill="rgba(255,255,255,0.3)" />
              </marker>
            </defs>
          </svg>
        </div>

        {/* REVOSONG */}
        <section style={{ marginBottom: "48px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#00d4ff", marginBottom: "16px" }}>🎵 REVOSONG / MUSIC CHARTS</h2>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)", lineHeight: 1.9, marginBottom: "16px" }}>
            <strong>AI生成楽曲とオリジナル楽曲のランキングプラットフォーム。</strong>Suno、Udio、MusicLM、Stable Audio などのAI音楽ツールで生成した楽曲から、純粋に音楽が好きなクリエイターたちが投稿したオリジナル楽曲まで、すべてのアーティストが自分の作品を発表できるオープンなコミュニティです。
          </p>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)", lineHeight: 1.9 }}>
            YouTube、SoundCloud、Spotify、ニコニコ動画、Bandcamp、Audiomack など複数のプラットフォームに対応。誰でも無料で投稿・視聴・投票できます。
          </p>
        </section>

        {/* レボリストシリーズ */}
        <section style={{ marginBottom: "48px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#ffa500", marginBottom: "20px" }}>🚀 レボリストシリーズ</h2>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.75)", lineHeight: 1.8, marginBottom: "24px" }}>
            おのくんが展開する複数のクリエイティブ＆社会貢献プロジェクト。それぞれが独立した専門領域を持ちながらも、共通のビジョンで一貫しています。
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}>
            <div style={{ border: "1px solid rgba(255,165,0,0.3)", borderRadius: "12px", background: "rgba(255,165,0,0.05)", padding: "16px" }}>
              <a href="https://revolist.earth/revolist-lab" target="_blank" rel="noopener noreferrer" style={{ display: "block", textDecoration: "none", color: "inherit" }}>
                <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#ffa500", marginBottom: "6px" }}>🔬 レボリストLab</h3>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)", lineHeight: 1.7 }}>
                  「防災を、かろやかに」というコンセプトから生まれた組織。インタビュー企画、ハットランウェイ、ものづくりLab などを通じて社会課題に創造的に取り組みます。
                </p>
              </a>
            </div>

            <div style={{ border: "1px solid rgba(220,20,60,0.3)", borderRadius: "12px", background: "rgba(220,20,60,0.05)", padding: "16px" }}>
              <a href="https://revolist.earth/bosai-bosai" target="_blank" rel="noopener noreferrer" style={{ display: "block", textDecoration: "none", color: "inherit" }}>
                <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#dc143c", marginBottom: "6px" }}>🎩 防災×帽祭</h3>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)", lineHeight: 1.7 }}>
                  ハットを通じた防災意識向上プロジェクト。華やかでカラフルなハットで心理的な変容をもたらし、避難訓練をエンターテインメント化。全国約20万校、605万人の小学生へのリーチを目指しています。
                </p>
              </a>
            </div>

            <div style={{ border: "1px solid rgba(50,205,50,0.3)", borderRadius: "12px", background: "rgba(50,205,50,0.05)", padding: "16px" }}>
              <a href="https://onokun.com/socially-responsible-sponsorship/" target="_blank" rel="noopener noreferrer" style={{ display: "block", textDecoration: "none", color: "inherit" }}>
                <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#32cd32", marginBottom: "6px" }}>🔗 レボリンク</h3>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)", lineHeight: 1.7 }}>
                  社会貢献型広告収益スポンサープログラム。「普通の買い物が、誰かの応援になる仕組み」を実現。消費者が特別なコストを負担せず、日常の購買行為が防災教育やコミュニティ事業を支援します。
                </p>
              </a>
            </div>

            <div style={{ border: "1px solid rgba(138,43,226,0.3)", borderRadius: "12px", background: "rgba(138,43,226,0.05)", padding: "16px" }}>
              <a href="https://hayator11.github.io/revofunding/index.html" target="_blank" rel="noopener noreferrer" style={{ display: "block", textDecoration: "none", color: "inherit" }}>
                <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#8a2be2", marginBottom: "6px" }}>💰 レボファンディング</h3>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)", lineHeight: 1.7 }}>
                  クラウドファンディングプラットフォーム。創造的で社会貢献的なプロジェクトの資金調達を支援し、アイデアを実現させるための仕組みを提供します。
                </p>
              </a>
            </div>

            <div style={{ border: "1px solid rgba(255,20,147,0.3)", borderRadius: "12px", background: "rgba(255,20,147,0.05)", padding: "16px" }}>
              <a href="https://hayator11.github.io/revofunding/revo-art.html" target="_blank" rel="noopener noreferrer" style={{ display: "block", textDecoration: "none", color: "inherit" }}>
                <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#ff1493", marginBottom: "6px" }}>🎨 レボアート</h3>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)", lineHeight: 1.7 }}>
                  デジタルアートとクリエイター向けプラットフォーム。アーティストの作品発表と相互支援を通じて、創造的コミュニティを育成します。
                </p>
              </a>
            </div>

            <div style={{ border: "1px solid rgba(0,191,255,0.3)", borderRadius: "12px", background: "rgba(0,191,255,0.05)", padding: "16px" }}>
              <a href="https://onokun.com/hat-model-academy/" target="_blank" rel="noopener noreferrer" style={{ display: "block", textDecoration: "none", color: "inherit" }}>
                <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#00bfff", marginBottom: "6px" }}>🎓 レボハット（Hat Model Academy）</h3>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)", lineHeight: 1.7 }}>
                  日本初の「ハットモデル・アカデミー」。帽子を「表現の武器」として、身体表現とハットの融合を探求。新しい文化を共に創造する開拓者を募集しています。
                </p>
              </a>
            </div>
          </div>
        </section>

        {/* レボリストとは */}
        <section style={{ background: "rgba(255,45,85,0.08)", border: "1px solid rgba(255,45,85,0.2)", borderRadius: "16px", padding: "28px 24px", marginBottom: "48px" }}>
          <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#fff", marginBottom: "16px" }}>「レボリスト」とは</h2>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)", lineHeight: 1.9, marginBottom: "16px" }}>
            「レボリスト」（Revolution List）は、創造性と社会貢献を両立させる複数のプロジェクトの総称です。それぞれが異なる分野で活動しながらも、共通の理念「創造性」「社会貢献」「つながり」「自己表現」で一貫しています。
          </p>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.75)", lineHeight: 1.9 }}>
            音楽、防災、アート、ファッション、スポンサーシップなど、様々な分野で「革新的でカジュアルなソリューション」を展開し、社会全体への良い影響を波及させていく「創造的エコシステム」として機能しています。
          </p>
        </section>

        {/* おのくんの活動 */}
        <section style={{ marginBottom: "48px", display: "grid", gridTemplateColumns: "1fr 100px", gap: "20px", alignItems: "start" }}>
          <div>
            <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#fff", marginBottom: "16px" }}>おのくんの活動から生まれた</h2>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)", lineHeight: 1.9, marginBottom: "16px" }}>
              クリエイター・起業家として音楽制作・DTM・デジタルクリエイティブで活動するおのくん。その転機は、<strong>東日本大震災後のボランティア経験</strong>でした。災害支援を通じて感じた「従来の枠組みではカバーできない社会課題」に対して、創造的でカジュアルなアプローチで取り組むことを信条としています。
            </p>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)", lineHeight: 1.9, marginBottom: "16px" }}>
              <strong>「防災を、かろやかに」「イメージできれば何でも出来る」</strong>という哲学の下、複数のプロジェクトを展開。クリエイターたちのつながりと社会への貢献を実現させています。
            </p>
          </div>
          <div style={{ textAlign: "center" }}>
            <img src="/onokun.jpg" alt="おのくん" style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(255,45,85,0.3)" }} />
          </div>
        </section>

        {/* 防災×帽祭について */}
        <section style={{ background: "rgba(220,20,60,0.1)", border: "1px solid rgba(220,20,60,0.3)", borderRadius: "16px", padding: "28px 24px", marginBottom: "48px" }}>
          <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#dc143c", marginBottom: "16px" }}>🎩 防災×帽祭について</h2>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)", lineHeight: 1.9, marginBottom: "16px" }}>
            防災×帽祭は、おのくんの社会貢献活動を象徴するプロジェクトです。日本の課題である「避難訓練の形骸化」に対して、まったく新しいアプローチで向き合っています。
          </p>
          <div style={{ background: "rgba(255,255,255,0.05)", borderLeft: "4px solid #dc143c", padding: "16px", marginBottom: "16px", borderRadius: "4px" }}>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.9)", lineHeight: 1.8, margin: 0 }}>
              <strong>課題：</strong> 堅苦しい避難訓練 → 子どもたちが退屈、防災意識が高まらない<br />
              <strong>解決策：</strong> カラフルで華やかなハットを被ることで心理的な変容をもたらし、避難訓練をエンターテインメント化<br />
              <strong>目標：</strong> 全国約20万校、605万人の小学生へのリーチを目指し、災害時の相互支援体制構築を推進
            </p>
          </div>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", lineHeight: 1.8, fontStyle: "italic" }}>
            このプロジェクトは、「社会課題をどうエンターテインメント化して楽しく解決するか」というおのくんの哲学が最も凝集されたものです。
          </p>
        </section>

        {/* 社会貢献型 */}
        <section style={{ background: "rgba(50,205,50,0.08)", border: "1px solid rgba(50,205,50,0.2)", borderRadius: "16px", padding: "28px 24px", marginBottom: "48px" }}>
          <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#32cd32", marginBottom: "16px" }}>💚 社会貢献型の取り組み</h2>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)", lineHeight: 1.9 }}>
            レボリストシリーズのすべてのプロジェクトに共通するのは、<strong>「社会貢献」という軸</strong>です。REVOSONG はアーティストコミュニティの発展を、防災×帽祭は防災意識の向上を、レボリンクは日常の買い物で社会を支援する仕組みを実現しています。
          </p>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.75)", lineHeight: 1.9, marginTop: "16px" }}>
            それぞれが異なるアプローチながらも、「クリエイティブで誰もが参加できる」という点で一貫しており、社会全体への良い波及効果を生み出す「創造的エコシステム」として機能しています。
          </p>
        </section>

        {/* @hayator */}
        <section style={{ marginBottom: "48px" }}>
          <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#ff1493", marginBottom: "16px" }}>👤 @hayator | 代表ブログ</h2>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)", lineHeight: 1.9, marginBottom: "16px" }}>
            <strong>@hayator</strong> は、おのくんの思想・活動・創作記録を発信するブログです。
          </p>
          <div style={{ background: "rgba(255,192,203,0.08)", borderLeft: "4px solid #ff1493", padding: "16px", marginBottom: "16px", borderRadius: "4px" }}>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.85)", lineHeight: 1.9, margin: 0 }}>
              <strong>📖 扱うテーマ：</strong><br />
              • 創造性についての思考<br />
              • 社会課題への向き合い方<br />
              • プロジェクト構想と進捗<br />
              • 日々の制作活動と発見<br />
              • 防災、ボランティア、コミュニティについての考察
            </p>
          </div>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)", lineHeight: 1.9, marginBottom: "16px" }}>
            中心にあるのは、おのくんの信念：<br />
            <strong style={{ color: "#ff2d55" }}>「イメージできれば何でも出来る」</strong>
          </p>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.75)", lineHeight: 1.9 }}>
            想像力を使えば、社会課題だって、ビジネスだって、アート表現だって、自分のやり方で解決・実現できる——という哲学が、すべてのプロジェクトを貫いています。@hayator はその思想の「言語化」であり、レボリストシリーズはその思想の「実装」なのです。
          </p>
          <div style={{ marginTop: "20px" }}>
            <a href="https://hayator.socialimagine.com/" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", padding: "12px 24px", background: "linear-gradient(135deg, #ff2d55, #ff6482)", borderRadius: "24px", color: "#fff", textDecoration: "none", fontSize: "14px", fontWeight: 700 }}>
              👉 @hayator を読む
            </a>
          </div>
        </section>

        {/* フッター */}
        <footer style={{ marginTop: "60px", paddingTop: "24px", borderTop: "1px solid rgba(255,255,255,0.05)", textAlign: "center", fontSize: "11px", color: "rgba(255,255,255,0.2)" }}>
          <p>&copy; 2025 REVOSONG — 運営: <a href="https://onokun.com/" target="_blank" rel="author" style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>おのくん</a></p>
          <p style={{ marginTop: "12px" }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>トップ</Link>
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

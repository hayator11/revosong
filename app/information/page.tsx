import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "運営情報 | MUSIC CHARTS REVOSONG - おのくんのエコシステム",
  description: "東日本大震災後のボランティア経験から生まれたおのくんのエコシステム。レボリストLabを中心に、防災、音楽、アート、ファッション、クラウドファンディングなど複数の社会貢献プロジェクトが展開されています。",
  keywords: ["おのくん", "REVOSONG", "レボリスト", "社会貢献", "防災", "音楽", "アート", "東日本大震災", "ボランティア", "エコシステム", "レボリストLab"],
};

export default function InformationPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#fff", fontFamily: "'Noto Sans JP', sans-serif", padding: "40px 16px 80px" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "rgba(255,255,255,0.4)", textDecoration: "none", fontSize: "13px", marginBottom: "20px" }}>
          ← トップページへ戻る
        </Link>

        <h1 style={{ fontSize: "36px", fontWeight: 700, color: "#fff", marginBottom: "12px", letterSpacing: "2px", textAlign: "center" }}>🚀 Information</h1>
        <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginBottom: "40px", textAlign: "center" }}>
          REVOSONG、レボリストシリーズ、そしておのくんの社会貢献活動について
        </p>

        {/* エコシステム図解 */}
        <div style={{ marginBottom: "48px", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <img src="/revosong-ecosystem.png" alt="REVOSONG エコシステム図解 - おのくんのルーツから展開する社会貢献プロジェクト群" style={{ width: "100%", maxWidth: "700px", height: "auto", borderRadius: "12px" }} />
        </div>

        {/* REVOSONG - 共有のプラットフォーム */}
        <section style={{ background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.2)", borderRadius: "16px", padding: "28px 24px", marginBottom: "48px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#00d4ff", marginBottom: "16px" }}>🎵 REVOSONG / MUSIC CHARTS | 共有と発信のプラットフォーム</h2>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)", lineHeight: 1.9, marginBottom: "16px" }}>
            <strong>想像を形にしながら共有しあうプラットフォーム</strong>
          </p>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)", lineHeight: 1.9, marginBottom: "16px" }}>
            AI生成楽曲とオリジナル楽曲のランキングサイト。Suno、Udio、MusicLM、Stable Audio などのAI音楽ツールで生まれた楽曲から、純粋に音楽が好きなクリエイターたちが投稿したオリジナル楽曲まで、すべてのアーティストが自分の作品を発表できるオープンなコミュニティ。
          </p>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)", lineHeight: 1.9 }}>
            YouTube、SoundCloud、Spotify、ニコニコ動画、Bandcamp、Audiomack など複数のプラットフォームに対応。誰でも無料で投稿・視聴・投票できます。
          </p>
        </section>

        {/* 5つの実践プロジェクト */}
        <section style={{ marginBottom: "48px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#fff", marginBottom: "20px" }}>🌿 レボリストLabから展開する5つのプロジェクト</h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}>
            <div style={{ border: "1px solid rgba(138,43,226,0.3)", borderRadius: "12px", background: "rgba(138,43,226,0.05)", padding: "16px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#8a2be2", marginBottom: "10px" }}>💰 レボファンディング</h3>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)", lineHeight: 1.7, marginBottom: "12px" }}>
                資金と人を集めながら「循環」させ続ける、次世代型のクラウドファンディング。創造的で社会貢献的なプロジェクトの資金調達を支援し、アイデアを実現させるための仕組みを提供します。
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                <a href="https://hayator11.github.io/revofunding/index.html" target="_blank" rel="noopener noreferrer" style={{ padding: "8px 12px", background: "rgba(138,43,226,0.2)", border: "1px solid rgba(138,43,226,0.4)", borderRadius: "6px", color: "#8a2be2", textDecoration: "none", fontSize: "12px", fontWeight: 600, textAlign: "center" }}>
                  公式サイト
                </a>
                <a href="https://x.com/onokun" target="_blank" rel="noopener noreferrer" style={{ padding: "8px 12px", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "6px", color: "#fff", textDecoration: "none", fontSize: "12px", fontWeight: 600, textAlign: "center" }}>
                  𝕏 @onokun
                </a>
                <a href="https://x.com/Hayator" target="_blank" rel="noopener noreferrer" style={{ padding: "8px 12px", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "6px", color: "#fff", textDecoration: "none", fontSize: "12px", fontWeight: 600, textAlign: "center" }}>
                  𝕏 @hayator
                </a>
              </div>
            </div>

            <div style={{ border: "1px solid rgba(255,20,147,0.3)", borderRadius: "12px", background: "rgba(255,20,147,0.05)", padding: "16px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#ff1493", marginBottom: "10px" }}>🎨 レボアート</h3>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)", lineHeight: 1.7, marginBottom: "12px" }}>
                廃棄ペンキの利活用など、被災地や過疎地の課題を「アート力」で支える活動。デジタルアートとクリエイター向けプラットフォーム。アーティストの作品発表と相互支援を通じて、創造的コミュニティを育成します。
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                <a href="https://hayator11.github.io/revofunding/revo-art.html" target="_blank" rel="noopener noreferrer" style={{ padding: "8px 12px", background: "rgba(255,20,147,0.2)", border: "1px solid rgba(255,20,147,0.4)", borderRadius: "6px", color: "#ff1493", textDecoration: "none", fontSize: "12px", fontWeight: 600, textAlign: "center" }}>
                  公式サイト
                </a>
                <a href="https://x.com/onokun" target="_blank" rel="noopener noreferrer" style={{ padding: "8px 12px", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "6px", color: "#fff", textDecoration: "none", fontSize: "12px", fontWeight: 600, textAlign: "center" }}>
                  𝕏 @onokun
                </a>
                <a href="https://x.com/Hayator" target="_blank" rel="noopener noreferrer" style={{ padding: "8px 12px", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "6px", color: "#fff", textDecoration: "none", fontSize: "12px", fontWeight: 600, textAlign: "center" }}>
                  𝕏 @hayator
                </a>
              </div>
            </div>

            <div style={{ border: "1px solid rgba(50,205,50,0.3)", borderRadius: "12px", background: "rgba(50,205,50,0.05)", padding: "16px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#32cd32", marginBottom: "10px" }}>🔗 レボリンク</h3>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)", lineHeight: 1.7, marginBottom: "12px" }}>
                社会貢献型広告収入モデル。「普通の買い物が、誰かの応援になる仕組み」を実現。消費者が特別なコストを負担せず、日常の購買行為が防災教育やコミュニティ事業を支援します。助成金に頼らない持続可能な基盤を構築。
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                <a href="https://onokun.com/socially-responsible-sponsorship/" target="_blank" rel="noopener noreferrer" style={{ padding: "8px 12px", background: "rgba(50,205,50,0.2)", border: "1px solid rgba(50,205,50,0.4)", borderRadius: "6px", color: "#32cd32", textDecoration: "none", fontSize: "12px", fontWeight: 600, textAlign: "center" }}>
                  公式サイト
                </a>
                <a href="https://x.com/onokun" target="_blank" rel="noopener noreferrer" style={{ padding: "8px 12px", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "6px", color: "#fff", textDecoration: "none", fontSize: "12px", fontWeight: 600, textAlign: "center" }}>
                  𝕏 @onokun
                </a>
                <a href="https://x.com/Hayator" target="_blank" rel="noopener noreferrer" style={{ padding: "8px 12px", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "6px", color: "#fff", textDecoration: "none", fontSize: "12px", fontWeight: 600, textAlign: "center" }}>
                  𝕏 @hayator
                </a>
              </div>
            </div>

            <div style={{ border: "1px solid rgba(220,20,60,0.3)", borderRadius: "12px", background: "rgba(220,20,60,0.05)", padding: "16px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#dc143c", marginBottom: "10px" }}>🎩 防災×帽祭</h3>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)", lineHeight: 1.7, marginBottom: "12px" }}>
                ハットを通じた防災意識向上プロジェクト。華やかでカラフルなハットで心理的な変容をもたらし、堅苦しい避難訓練をエンターテインメント化。全国約20万校、605万人の小学生へのリーチを目指し、災害時の相互支援体制構築を推進しています。
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                <a href="https://revolist.earth/bosai-bosai" target="_blank" rel="noopener noreferrer" style={{ padding: "8px 12px", background: "rgba(220,20,60,0.2)", border: "1px solid rgba(220,20,60,0.4)", borderRadius: "6px", color: "#dc143c", textDecoration: "none", fontSize: "12px", fontWeight: 600, textAlign: "center" }}>
                  公式サイト
                </a>
                <a href="https://x.com/Bosai_Bosai_" target="_blank" rel="noopener noreferrer" style={{ padding: "8px 12px", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "6px", color: "#fff", textDecoration: "none", fontSize: "12px", fontWeight: 600, textAlign: "center" }}>
                  𝕏 防災×帽祭
                </a>
                <a href="https://x.com/Hayator" target="_blank" rel="noopener noreferrer" style={{ padding: "8px 12px", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "6px", color: "#fff", textDecoration: "none", fontSize: "12px", fontWeight: 600, textAlign: "center" }}>
                  𝕏 @hayator
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* レボリストLab - 幹 */}
        <section style={{ background: "rgba(255,165,0,0.08)", border: "1px solid rgba(255,165,0,0.2)", borderRadius: "16px", padding: "28px 24px", marginBottom: "48px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#ffa500", marginBottom: "16px" }}>🔬 レボリストLab | 実験・実践の幹</h2>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)", lineHeight: 1.9, marginBottom: "16px" }}>
            <strong>「防災を、かろやかに」というコンセプト</strong>から生まれた、社会課題の検証・実践・実証を行う実験場・インキュベーター。
          </p>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)", lineHeight: 1.9, marginBottom: "20px" }}>
            インタビュー企画、ハットランウェイ、ものづくりLab、防災×帽祭など多様なプロジェクトを通じて、個人の力を活かしながら社会変革をもたらすことがビジョン。ここからすべての枝葉が生まれ、育つ場所です。
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
            <a href="https://revolist.earth/revolist-lab" target="_blank" rel="noopener noreferrer" style={{ padding: "12px 16px", background: "rgba(255,165,0,0.15)", border: "1px solid rgba(255,165,0,0.3)", borderRadius: "8px", color: "#ffa500", textDecoration: "none", fontSize: "13px", fontWeight: 600, textAlign: "center" }}>
              🌐 公式サイト
            </a>
            <a href="https://x.com/REVOLIST11" target="_blank" rel="noopener noreferrer" style={{ padding: "12px 16px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "8px", color: "#fff", textDecoration: "none", fontSize: "13px", fontWeight: 600, textAlign: "center" }}>
              𝕏 レボリストLab
            </a>
            <a href="https://x.com/Hayator" target="_blank" rel="noopener noreferrer" style={{ padding: "12px 16px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "8px", color: "#fff", textDecoration: "none", fontSize: "13px", fontWeight: 600, textAlign: "center" }}>
              𝕏 @hayator
            </a>
          </div>
        </section>

        {/* おのくんのルーツと信念 */}
        <section style={{ background: "rgba(255,45,85,0.08)", border: "1px solid rgba(255,45,85,0.2)", borderRadius: "16px", padding: "28px 24px", marginBottom: "48px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#ff2d55", marginBottom: "16px" }}>💜 おのくん | 信念の大地</h2>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)", lineHeight: 1.9, marginBottom: "16px" }}>
            <strong>東日本大震災から生まれた、忘れてはならないこと</strong>——これがすべてのプロジェクトの根幹です。
          </p>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)", lineHeight: 1.9, marginBottom: "16px" }}>
            クリエイター・起業家として音楽制作・DTM・デジタルクリエイティブで活動するおのくん。その人生の転機は、2011年の大震災後のボランティア経験でした。災害支援を通じて感じた「従来の枠組みではカバーできない社会課題」に対して、創造的でカジュアルなアプローチで取り組むことを信条としています。
          </p>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)", lineHeight: 1.9, marginBottom: "16px" }}>
            15年という月日の中で決してブレることなく持ち続けてきた信念：<br />
            <strong style={{ color: "#ff2d55" }}>「防災を、かろやかに」「イメージできれば何でも出来る」</strong>
          </p>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.75)", lineHeight: 1.9 }}>
            この深い根から養分を吸い上げ、複数のプロジェクトが生まれ、社会全体への良い影響を波及させていく「創造的エコシステム」が機能しています。
          </p>

          <div style={{ marginTop: "20px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
              <a href="https://onokun.com/" target="_blank" rel="noopener noreferrer" style={{ padding: "12px 16px", background: "rgba(255,45,85,0.2)", border: "1px solid rgba(255,45,85,0.4)", borderRadius: "8px", color: "#ff2d55", textDecoration: "none", fontSize: "13px", fontWeight: 600, textAlign: "center" }}>
                🌐 ホームページ
              </a>
              <a href="https://x.com/onokun" target="_blank" rel="noopener noreferrer" style={{ padding: "12px 16px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "8px", color: "#fff", textDecoration: "none", fontSize: "13px", fontWeight: 600, textAlign: "center" }}>
                𝕏 @onokun
              </a>
              <a href="https://www.instagram.com/mendokushe.onokun" target="_blank" rel="noopener noreferrer" style={{ padding: "12px 16px", background: "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)", border: "1px solid rgba(240, 148, 51, 0.4)", borderRadius: "8px", color: "#fff", textDecoration: "none", fontSize: "13px", fontWeight: 600, textAlign: "center" }}>
                📷 Instagram
              </a>
            </div>
          </div>
        </section>

        {/* @hayator */}
        <section style={{ marginBottom: "48px" }}>
          <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#ff1493", marginBottom: "16px" }}>👤 @hayator | 代表ブログ＆発信</h2>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)", lineHeight: 1.9, marginBottom: "16px" }}>
            <strong>@hayator</strong> は、おのくんの思想・活動・創作記録を発信するブログとして、レボリストシリーズすべての根幹に流れる哲学を言語化しています。
          </p>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)", lineHeight: 1.9, marginBottom: "16px" }}>
            中心にあるのは、おのくんの信念：<br />
            <strong style={{ color: "#ff2d55" }}>「イメージできれば何でも出来る」</strong>
          </p>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.75)", lineHeight: 1.9, marginBottom: "20px" }}>
            想像力を使えば、社会課題だって、ビジネスだって、アート表現だって、自分のやり方で解決・実現できる——という哲学が、すべてのプロジェクトを貫いています。@hayator はその思想の「言語化」であり、レボリストシリーズはその思想の「実装」なのです。
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <a href="https://hayator.socialimagine.com/" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", padding: "12px 24px", background: "linear-gradient(135deg, #ff2d55, #ff6482)", borderRadius: "24px", color: "#fff", textDecoration: "none", fontSize: "14px", fontWeight: 700, textAlign: "center" }}>
              📝 ブログを読む
            </a>
            <a href="https://x.com/Hayator" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", padding: "12px 24px", background: "rgba(0,0,0,0.4)", borderRadius: "24px", color: "#fff", textDecoration: "none", fontSize: "14px", fontWeight: 700, textAlign: "center", border: "1px solid rgba(255,255,255,0.2)" }}>
              𝕏 フォローする
            </a>
          </div>
        </section>

        {/* フッター */}
        <footer style={{ marginTop: "60px", paddingTop: "24px", borderTop: "1px solid rgba(255,255,255,0.05)", textAlign: "center", fontSize: "11px", color: "rgba(255,255,255,0.2)" }}>
          <p style={{ marginBottom: "8px", fontSize: "12px", fontStyle: "italic", color: "rgba(255,255,255,0.3)" }}>
            Produced by @hayator
          </p>
          <p>&copy; 2025 REVOSONG — 運営: <a href="https://onokun.com/" target="_blank" rel="author" style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>おのくん</a></p>
          <p style={{ marginTop: "12px" }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>トップ</Link>
            {" · "}
            <Link href="/about" style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>About</Link>
            {" · "}
            <Link href="/information" style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>Information</Link>
          </p>
        </footer>
      </div>
    </div>
  );
}

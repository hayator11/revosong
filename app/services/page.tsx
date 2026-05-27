import type { Metadata } from "next";
import Link from "next/link";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://revosong.onokun.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "対応サービス・楽曲タイプ | MUSIC CHARTS",
  description:
    "MUSIC CHARTSはAI生成楽曲もオリジナル楽曲も投稿OK。対応している音楽・動画投稿サービスの詳細案内。YouTube・SoundCloud・Spotify・ニコニコ動画・Bandcamp・Audiomackへの投稿方法を解説します。",
  keywords: ["AI音楽", "オリジナル楽曲", "楽曲投稿", "シンガーソングライター", "DTM", "バンド", "YouTube", "SoundCloud", "Spotify", "ニコニコ動画", "Bandcamp"],
  openGraph: {
    title: "対応サービス・楽曲タイプ | MUSIC CHARTS",
    description: "MUSIC CHARTSに投稿できるサービス一覧。YouTube、SoundCloud、Spotify、ニコニコ動画、Bandcamp、Audiomackに対応。",
    type: "website",
    url: `${baseUrl}/services`,
    siteName: "MUSIC CHARTS",
    locale: "ja_JP",
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "対応サービス・楽曲タイプ | MUSIC CHARTS",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "対応サービス・楽曲タイプ | MUSIC CHARTS",
    description: "MUSIC CHARTSに投稿できるサービス一覧。YouTube、SoundCloud、Spotify等に対応。",
    images: [`${baseUrl}/og-image.png`],
  },
};

const SERVICES = [
  {
    id: "youtube",
    icon: "▶",
    iconBg: "#ff0000",
    name: "YouTube",
    tag: "完全無料",
    tagColor: "#30d158",
    tagBg: "rgba(48,209,88,0.15)",
    url: "https://www.youtube.com/",
    urlDisplay: "youtube.com",
    summary: "世界最大の動画プラットフォーム。音楽・楽曲動画の投稿に最も広く使われています。",
    details: [
      "動画形式（MP4など）でアップロード。音声のみでも静止画と組み合わせて投稿可能",
      "無料で無制限に投稿でき、世界中のリスナーにリーチできる",
      "AI生成楽曲・オリジナル楽曲どちらも投稿可能",
      "Googleアカウントがあれば即日投稿スタートできる",
    ],
    howTo: [
      "Googleアカウントを作成（または既存アカウントでログイン）",
      "YouTube Studio（studio.youtube.com）にアクセス",
      "「作成」→「動画をアップロード」から楽曲動画をアップロード",
      "タイトル・説明欄を入力し「公開」を選択",
      "公開されたURLをMUSIC CHARTSに投稿",
    ],
    urlExample: "https://www.youtube.com/watch?v=XXXXXXXXXXX",
    recommended: true,
  },
  {
    id: "soundcloud",
    icon: "☁",
    iconBg: "#ff5500",
    name: "SoundCloud",
    tag: "無料枠あり",
    tagColor: "#ff9500",
    tagBg: "rgba(255,149,0,0.15)",
    url: "https://soundcloud.com/",
    urlDisplay: "soundcloud.com",
    summary: "音楽クリエイター向けの専門プラットフォーム。DTM・電子音楽・インディーミュージックのコミュニティが活発。",
    details: [
      "無料プランで最大3時間分の音楽をアップロード可能",
      "音声ファイル（MP3・WAV・AIFF・FLAC等）を直接アップロードできる",
      "波形ビジュアライザー付きのプレイヤーで共有できる",
      "音楽好きのリスナーが多く、フィードバックをもらいやすい",
    ],
    howTo: [
      "SoundCloudアカウントを作成",
      "「Upload」ボタンから音声ファイルをアップロード",
      "タイトル・ジャンル・タグを設定し「Save」",
      "トラックページのURLをMUSIC CHARTSに投稿",
    ],
    urlExample: "https://soundcloud.com/username/track-name",
    recommended: true,
  },
  {
    id: "spotify",
    icon: "♪",
    iconBg: "#1db954",
    name: "Spotify",
    tag: "配信サービス経由",
    tagColor: "#64d2ff",
    tagBg: "rgba(100,210,255,0.15)",
    url: "https://open.spotify.com/",
    urlDisplay: "open.spotify.com",
    summary: "世界最大の音楽ストリーミングサービス。配信代行サービスを通じて楽曲をアップロードします。",
    details: [
      "DistroKid・TuneCore・CD Baby などの配信代行サービス経由でアップロード",
      "世界6億人以上のユーザーにリーチできる",
      "再生数に応じてロイヤリティ収入を得られる",
      "AI生成楽曲の配信ポリシーは各サービスで確認が必要",
    ],
    howTo: [
      "配信代行サービス（例：DistroKid・TuneCore）にアカウント作成",
      "楽曲ファイル・アートワーク・メタデータを入力してSpotifyに配信申請",
      "配信完了後、SpotifyのトラックページURLをMUSIC CHARTSに投稿",
    ],
    urlExample: "https://open.spotify.com/track/XXXXXXXXXXXXXXXXXXXXXXXX",
    recommended: false,
  },
  {
    id: "niconico",
    icon: "に",
    iconBg: "#252525",
    name: "ニコニコ動画",
    tag: "完全無料",
    tagColor: "#30d158",
    tagBg: "rgba(48,209,88,0.15)",
    url: "https://www.nicovideo.jp/",
    urlDisplay: "nicovideo.jp",
    summary: "日本最大の動画投稿サービス。ボカロ・DTM・UTAU文化が根付いており、日本の音楽クリエイターに最適。",
    details: [
      "無料でアカウント作成し、動画形式で楽曲を投稿できる",
      "ボーカロイド・DTM・AI音楽のコミュニティが非常に活発",
      "コメント機能で視聴者とリアルタイムに交流できる",
      "ニコニコ音楽祭・VOCALOIDランキングなど独自のイベントも多い",
    ],
    howTo: [
      "ニコニコアカウントを作成（無料）",
      "「動画投稿」から楽曲動画（MP4など）をアップロード",
      "タイトル・説明・タグを設定して公開",
      "公開されたURLをMUSIC CHARTSに投稿",
    ],
    urlExample: "https://www.nicovideo.jp/watch/sm1234567",
    recommended: false,
  },
  {
    id: "bandcamp",
    icon: "B",
    iconBg: "#1da0c3",
    name: "Bandcamp",
    tag: "無料",
    tagColor: "#30d158",
    tagBg: "rgba(48,209,88,0.15)",
    url: "https://bandcamp.com/",
    urlDisplay: "bandcamp.com",
    summary: "アーティスト主体の音楽プラットフォーム。楽曲販売・デジタル配布に特化しており、クリエイターに収益が多く還元される。",
    details: [
      "無料で楽曲・アルバムを公開・販売できる",
      "楽曲販売収益の約80〜85%がアーティストに還元される",
      "音楽ファンが直接アーティストを支援するモデル",
      "ダウンロード・ストリーミング両方に対応",
    ],
    howTo: [
      "Bandcampアカウントを作成し、アーティストページを設定",
      "「Add music」から楽曲ファイルをアップロード",
      "価格（無料〜有料）を設定して公開",
      "楽曲ページのURLをMUSIC CHARTSに投稿",
    ],
    urlExample: "https://artistname.bandcamp.com/track/track-name",
    recommended: false,
  },
  {
    id: "audiomack",
    icon: "A",
    iconBg: "#ffa200",
    name: "Audiomack",
    tag: "完全無料",
    tagColor: "#30d158",
    tagBg: "rgba(48,209,88,0.15)",
    url: "https://audiomack.com/",
    urlDisplay: "audiomack.com",
    summary: "完全無料の音楽ストリーミングプラットフォーム。ヒップホップ・R&B・アフロビーツで特に人気が高い。",
    details: [
      "完全無料でアップロード・ストリーミング配信が可能",
      "容量制限なしで無制限に楽曲をアップロードできる",
      "ヒップホップ・R&B・ゴスペル・アフロビーツ系のリスナーが多い",
      "モバイルアプリも充実しており再生数が伸びやすい",
    ],
    howTo: [
      "Audiomackアカウントを作成",
      "「Upload」から音声ファイルをアップロード",
      "ジャンル・タグを設定して公開",
      "楽曲ページのURLをMUSIC CHARTSに投稿",
    ],
    urlExample: "https://audiomack.com/artistname/song/song-name",
    recommended: false,
  },
];

export default function ServicesPage() {
  return (
    <div className="page-root">
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
          margin-bottom: 8px;
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
        .section-intro {
          margin: 24px 0 20px;
          padding: 16px 20px;
          background: rgba(255,45,85,0.06);
          border: 1px solid rgba(255,45,85,0.15);
          border-radius: 14px;
          font-size: 13px;
          color: rgba(255,255,255,0.7);
          line-height: 1.8;
        }
        .section-intro strong { color: #fff; }
        .services-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 24px;
        }
        .service-card {
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 18px;
          background: rgba(255,255,255,0.02);
          overflow: hidden;
        }
        .service-card-header {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 20px 20px 16px;
        }
        .service-icon-wrap {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: 900;
          color: #fff;
          flex-shrink: 0;
          font-family: 'Oswald', sans-serif;
        }
        .service-name-wrap { flex: 1; min-width: 0; }
        .service-name {
          font-size: 18px;
          font-weight: 700;
          color: #fff;
        }
        .service-url-link {
          font-size: 12px;
          color: rgba(255,255,255,0.35);
          text-decoration: none;
          margin-top: 2px;
          display: block;
        }
        .service-url-link:hover { color: rgba(255,45,85,0.8); }
        .service-tag {
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          flex-shrink: 0;
        }
        .recommended-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 10px;
          font-weight: 700;
          background: rgba(255,45,85,0.15);
          color: #ff2d55;
          margin-left: 8px;
          vertical-align: middle;
        }
        .service-body {
          padding: 0 20px 20px;
        }
        .service-summary {
          font-size: 14px;
          color: rgba(255,255,255,0.7);
          line-height: 1.7;
          margin-bottom: 16px;
        }
        .details-section {
          margin-bottom: 16px;
        }
        .details-title {
          font-size: 11px;
          font-weight: 700;
          color: rgba(255,255,255,0.3);
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .details-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .details-list li {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 13px;
          color: rgba(255,255,255,0.6);
          line-height: 1.6;
        }
        .details-list li::before {
          content: '✓';
          color: #30d158;
          font-weight: 700;
          flex-shrink: 0;
          margin-top: 1px;
        }
        .howto-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .howto-list li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 13px;
          color: rgba(255,255,255,0.6);
          line-height: 1.6;
        }
        .step-num {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: rgba(255,45,85,0.2);
          color: #ff2d55;
          font-size: 11px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 1px;
        }
        .url-example-box {
          margin-top: 14px;
          padding: 10px 14px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 10px;
          font-size: 11px;
        }
        .url-example-label {
          color: rgba(255,255,255,0.3);
          font-size: 10px;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 4px;
        }
        .url-example-text {
          color: rgba(255,45,85,0.8);
          font-family: monospace;
          word-break: break-all;
        }
        .divider {
          height: 1px;
          background: rgba(255,255,255,0.05);
          margin: 16px 0;
        }
        .cta-box {
          margin-top: 32px;
          padding: 24px;
          background: rgba(255,45,85,0.06);
          border: 1px solid rgba(255,45,85,0.2);
          border-radius: 18px;
          text-align: center;
        }
        .cta-title {
          font-family: 'Oswald', sans-serif;
          font-size: 20px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 8px;
        }
        .cta-desc {
          font-size: 13px;
          color: rgba(255,255,255,0.6);
          line-height: 1.7;
          margin-bottom: 16px;
        }
        .cta-btn {
          display: inline-block;
          padding: 12px 32px;
          background: linear-gradient(135deg, #ff2d55, #ff6482);
          border-radius: 24px;
          color: #fff;
          text-decoration: none;
          font-size: 14px;
          font-weight: 700;
          transition: opacity 0.2s;
        }
        .cta-btn:hover { opacity: 0.85; }

        /* --- タイプ比較 --- */
        .type-compare {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 12px;
          margin: 24px 0 8px;
        }
        .type-card {
          padding: 20px 14px;
          border-radius: 16px;
          text-align: center;
        }
        .type-card-ai {
          background: rgba(94,92,230,0.1);
          border: 1px solid rgba(94,92,230,0.3);
        }
        .type-card-orig {
          background: rgba(255,149,0,0.08);
          border: 1px solid rgba(255,149,0,0.3);
        }
        .type-card-icon { font-size: 30px; margin-bottom: 8px; }
        .type-card-name {
          font-size: 14px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 6px;
        }
        .type-card-desc {
          font-size: 11px;
          color: rgba(255,255,255,0.5);
          line-height: 1.6;
        }
        .type-card-tools {
          margin-top: 8px;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 4px;
        }
        .type-tool-tag {
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 10px;
          font-weight: 600;
        }
        .type-tool-tag-ai {
          background: rgba(94,92,230,0.2);
          color: #8b8fe8;
        }
        .type-tool-tag-orig {
          background: rgba(255,149,0,0.15);
          color: #ff9500;
        }
        .type-sep {
          font-size: 22px;
          font-weight: 700;
          color: rgba(255,255,255,0.25);
          text-align: center;
        }
        .type-both-msg {
          text-align: center;
          font-size: 13px;
          font-weight: 600;
          color: rgba(255,255,255,0.45);
          margin-bottom: 20px;
        }
        .type-both-msg span {
          color: #ff2d55;
          font-weight: 700;
        }

        /* --- オリジナル楽曲セクション --- */
        .orig-section {
          border: 1px solid rgba(255,149,0,0.2);
          border-radius: 20px;
          background: rgba(255,149,0,0.04);
          overflow: hidden;
          margin: 28px 0 20px;
        }
        .orig-section-header {
          padding: 22px 22px 16px;
          border-bottom: 1px solid rgba(255,149,0,0.12);
        }
        .orig-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 12px;
          border-radius: 20px;
          background: rgba(255,149,0,0.15);
          color: #ff9500;
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 10px;
        }
        .orig-section-title {
          font-family: 'Oswald', sans-serif;
          font-size: 20px;
          font-weight: 700;
          color: #fff;
          letter-spacing: 1px;
          margin-bottom: 6px;
        }
        .orig-section-desc {
          font-size: 13px;
          color: rgba(255,255,255,0.55);
          line-height: 1.7;
        }
        .orig-section-body {
          padding: 20px 22px;
        }
        .orig-subsection-title {
          font-size: 11px;
          font-weight: 700;
          color: rgba(255,255,255,0.3);
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 10px;
        }
        .orig-who-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
          margin-bottom: 22px;
        }
        .orig-who-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          font-size: 13px;
          color: rgba(255,255,255,0.75);
        }
        .orig-who-icon { font-size: 20px; flex-shrink: 0; }
        .orig-who-label { font-weight: 600; }
        .orig-who-sub { font-size: 10px; color: rgba(255,255,255,0.35); margin-top: 1px; }
        .orig-tools-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
          margin-bottom: 22px;
        }
        .orig-tool-card {
          padding: 12px 14px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
        }
        .orig-tool-name {
          font-size: 13px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 2px;
        }
        .orig-tool-tag {
          display: inline-block;
          padding: 1px 7px;
          border-radius: 8px;
          font-size: 10px;
          font-weight: 600;
          margin-bottom: 4px;
        }
        .orig-tool-free { background: rgba(48,209,88,0.15); color: #30d158; }
        .orig-tool-paid { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.4); }
        .orig-tool-desc {
          font-size: 11px;
          color: rgba(255,255,255,0.4);
          line-height: 1.5;
        }
        .orig-flow {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }
        .orig-flow-step {
          padding: 8px 14px;
          background: rgba(255,149,0,0.1);
          border: 1px solid rgba(255,149,0,0.2);
          border-radius: 10px;
          font-size: 12px;
          font-weight: 600;
          color: rgba(255,255,255,0.75);
        }
        .orig-flow-arrow {
          color: rgba(255,255,255,0.2);
          font-size: 14px;
        }
        .orig-qa {
          margin-top: 18px;
          padding: 14px 16px;
          background: rgba(255,255,255,0.02);
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.05);
        }
        .orig-qa-q {
          font-size: 13px;
          font-weight: 700;
          color: rgba(255,255,255,0.7);
          margin-bottom: 6px;
        }
        .orig-qa-q::before { content: 'Q. '; color: #ff9500; }
        .orig-qa-a {
          font-size: 13px;
          color: rgba(255,255,255,0.5);
          line-height: 1.7;
        }
        .orig-qa-a::before { content: 'A. '; color: #30d158; font-weight: 700; }
      `}</style>

      <div className="page-wrapper">
        <header className="page-header">
          <Link href="/" className="back-link">
            ← トップページへ戻る
          </Link>
          <h1 className="page-title">対応サービス一覧</h1>
          <p className="page-desc">
            MUSIC CHARTS に楽曲を投稿するには、対応している音楽・動画サービスに楽曲をアップロードし、そのURLを登録してください。
          </p>
        </header>

        {/* 楽曲タイプ比較 */}
        <div className="type-compare">
          <div className="type-card type-card-ai">
            <div className="type-card-icon">🤖</div>
            <div className="type-card-name">AI生成楽曲</div>
            <div className="type-card-desc">AIツールを使って生成した楽曲</div>
            <div className="type-card-tools">
              {["Suno", "Udio", "MusicLM", "Stable Audio"].map((t) => (
                <span key={t} className="type-tool-tag type-tool-tag-ai">{t}</span>
              ))}
            </div>
          </div>
          <div className="type-sep">&amp;</div>
          <div className="type-card type-card-orig">
            <div className="type-card-icon">🎤</div>
            <div className="type-card-name">オリジナル楽曲</div>
            <div className="type-card-desc">自分で作曲・演奏・歌唱した楽曲</div>
            <div className="type-card-tools">
              {["シンガー", "バンド", "DTM", "弾き語り"].map((t) => (
                <span key={t} className="type-tool-tag type-tool-tag-orig">{t}</span>
              ))}
            </div>
          </div>
        </div>
        <p className="type-both-msg">
          どちらも <span>MUSIC CHARTS</span> に投稿できます
        </p>

        <div className="section-intro">
          <strong>投稿の流れ：</strong>
          下記のいずれかのサービスに楽曲をアップロード → 楽曲ページのURLをコピー → MUSIC CHARTSの「+&nbsp;投稿」ボタンからURLを貼り付けて投稿
        </div>

        <div className="services-list">
          {SERVICES.map((svc) => (
            <article key={svc.id} className="service-card">
              <div className="service-card-header">
                <div
                  className="service-icon-wrap"
                  style={{ background: svc.iconBg }}
                >
                  {svc.icon}
                </div>
                <div className="service-name-wrap">
                  <div className="service-name">
                    {svc.name}
                    {svc.recommended && (
                      <span className="recommended-badge">★ おすすめ</span>
                    )}
                  </div>
                  <a
                    href={svc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="service-url-link"
                  >
                    {svc.urlDisplay} ↗
                  </a>
                </div>
                <span
                  className="service-tag"
                  style={{
                    background: svc.tagBg,
                    color: svc.tagColor,
                  }}
                >
                  {svc.tag}
                </span>
              </div>

              <div className="service-body">
                <p className="service-summary">{svc.summary}</p>

                <div className="details-section">
                  <div className="details-title">特徴</div>
                  <ul className="details-list">
                    {svc.details.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>

                <div className="divider" />

                <div className="details-section">
                  <div className="details-title">投稿手順</div>
                  <ol className="howto-list">
                    {svc.howTo.map((step, i) => (
                      <li key={i}>
                        <span className="step-num">{i + 1}</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="url-example-box">
                  <div className="url-example-label">URLの例</div>
                  <div className="url-example-text">{svc.urlExample}</div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* オリジナル楽曲クリエイター向けセクション */}
        <section className="orig-section">
          <div className="orig-section-header">
            <div className="orig-badge">🎤 オリジナル楽曲</div>
            <h2 className="orig-section-title">アーティスト・クリエイターの方へ</h2>
            <p className="orig-section-desc">
              AIを使わずに自分で制作した楽曲も大歓迎。シンガーソングライター・バンド・DTMクリエイターなど、
              あらゆるスタイルの音楽を投稿できます。
            </p>
          </div>
          <div className="orig-section-body">

            {/* こんな方が投稿しています */}
            <div className="orig-subsection-title">こんな方が投稿しています</div>
            <div className="orig-who-grid">
              {[
                { icon: "🎙", label: "シンガーソングライター", sub: "弾き語り・自作曲" },
                { icon: "🎸", label: "バンド・アーティスト", sub: "バンドサウンド・ロック" },
                { icon: "💻", label: "DTMクリエイター", sub: "DAWで制作したトラック" },
                { icon: "🎹", label: "ビートメイカー", sub: "インスト・ヒップホップ" },
                { icon: "🎻", label: "楽器演奏者", sub: "ギター・ピアノ・その他" },
                { icon: "🎺", label: "ジャンル問わず", sub: "ポップ・ロック・ジャズ…" },
              ].map((w) => (
                <div key={w.label} className="orig-who-card">
                  <span className="orig-who-icon">{w.icon}</span>
                  <div>
                    <div className="orig-who-label">{w.label}</div>
                    <div className="orig-who-sub">{w.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* 制作・録音ツール */}
            <div className="orig-subsection-title">おすすめ制作・録音ツール</div>
            <div className="orig-tools-grid">
              {[
                { name: "GarageBand", free: true, desc: "Mac・iPhone向け。初心者でも直感的に使えるDAW", },
                { name: "Cakewalk", free: true, desc: "Windows向けの高機能DAW。完全無料で使用可能", },
                { name: "Audacity", free: true, desc: "録音・音声編集ソフト。シンプルな収録に最適", },
                { name: "Logic Pro", free: false, desc: "Mac向けのプロ仕様DAW。クオリティの高い制作が可能", },
                { name: "Ableton Live", free: false, desc: "ライブパフォーマンスや電子音楽の制作に特化", },
                { name: "FL Studio", free: false, desc: "ビートメイクやプロデュースに人気の定番DAW", },
              ].map((tool) => (
                <div key={tool.name} className="orig-tool-card">
                  <div className="orig-tool-name">{tool.name}</div>
                  <span className={`orig-tool-tag ${tool.free ? "orig-tool-free" : "orig-tool-paid"}`}>
                    {tool.free ? "無料" : "有料"}
                  </span>
                  <div className="orig-tool-desc">{tool.desc}</div>
                </div>
              ))}
            </div>

            {/* 投稿の流れ */}
            <div className="orig-subsection-title">オリジナル楽曲の投稿の流れ</div>
            <div className="orig-flow">
              {["①&nbsp;DAWや録音アプリで楽曲を制作", "②&nbsp;MP3/WAVで書き出す", "③&nbsp;YouTubeやSoundCloudにアップロード", "④&nbsp;MUSIC CHARTSに投稿"].map((step, i) => (
                <>
                  {i > 0 && <span key={`arrow-${i}`} className="orig-flow-arrow">→</span>}
                  <div
                    key={step}
                    className="orig-flow-step"
                    dangerouslySetInnerHTML={{ __html: step }}
                  />
                </>
              ))}
            </div>

            {/* よくある質問 */}
            <div className="orig-qa">
              <div className="orig-qa-q">AIを使っていない楽曲でも投稿できますか？</div>
              <div className="orig-qa-a">
                はい、もちろんです！MUSIC CHARTSはAI生成楽曲もオリジナル楽曲も同じランキングに参加できます。
                投稿時に「オリジナル」を選択してください。
              </div>
            </div>

          </div>
        </section>

        <div className="cta-box">
          <div className="cta-title">さっそく投稿してみよう！</div>
          <p className="cta-desc">
            楽曲のURLが準備できたら、MUSIC CHARTSに投稿してランキングに参加しよう。
            AI生成楽曲もオリジナル楽曲も大歓迎です。
          </p>
          <Link href="/" className="cta-btn">
            トップページへ → 投稿する
          </Link>
        </div>
      </div>
    </div>
  );
}

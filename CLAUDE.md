@AGENTS.md

# AI Music Charts
- 種別: フォークプロジェクト（カスタマイズ版）
- ブラウザ確認: Firefox
- 外部連携: Googleフォーム
- 注意: フォーク元との差分を維持すること

## 作業状況
- **フェーズ1（DB & Core API）**: ✅ 完了
  - Campaign tables: campaign_themes, campaigns, campaign_submissions, campaign_likes
  - RLS policies: 全テーブル対応
  - API endpoints: 全実装（13個のエンドポイント）
  - Frontend pages: キャンペーン一覧・詳細ページ API統合完了

- **フェーズ1.5（UI改善）**: ✅ 完了
  - TrackCardコンポーネントをSocialAvatarLinkと統合
  - キャンペーン詳細ページでアーティストのSNS プロフィール画像表示対応
  - CampaignCommentコンポーネント作成、コメント著者のSNS情報表示実装
  - ランキングAPI修正、social_links情報の取得と返却
  - キャンペーン詳細ページのデータ変換処理実装

## 実装完了ファイル（フェーズ1.5）
- ✅ app/components/SocialAvatarLink.tsx - SNS プロフィール画像表示
- ✅ app/components/TrackCard.tsx - トラックカード改善版
- ✅ app/components/CampaignComment.tsx - コメント著者SNS表示
- ✅ app/api/campaigns/[id]/ranking/route.ts - ランキングAPI修正
- ✅ app/campaigns/[id]/page.tsx - キャンペーン詳細ページ
- ✅ TEST_DATA_SETUP.md - テストデータセットアップガイド
- ✅ IMPLEMENTATION_CHECKLIST.md - 実装チェックリスト

## フェーズ2（テーマプロポーザー選択 & OGP生成）
### 進捗状況
- ✅ テストデータの投入と動作確認完了
- ✅ キャンペーン詳細ページの表示確認完了
- ✅ Next.js 15 params Promise 対応一括修正完了
  - 全ダイナミックルート（Page + API）修正
- ✅ テーマプロポーザー選択UI実装
  - ✅ ThemeProposerChoice.tsx - 投稿一覧から選択
  - ✅ AwardCommentForm.tsx - 応援コメント入力
  - ✅ CampaignAwardCard.tsx - 受賞曲表示

## フェーズ2.5（ナビゲーション階層 & ソーシャルシェア機能）
### 実装完了
- ✅ SocialShareButtons.tsx - Twitter/X, Facebook, LINE, WhatsApp, リンクコピー対応
- ✅ BackButton.tsx - 戻るボタンコンポーネント
- ✅ Breadcrumb.tsx - パンくずナビゲーション
- ✅ GlobalHeader.tsx - グローバルヘッダー（デスクトップ・モバイル対応）
- ✅ 全キャンペーンページへのナビゲーション追加
  - `/campaigns` - キャンペーン一覧ページ
  - `/campaigns/[id]` - キャンペーン詳細ページ（シェアボタン統合）
  - `/campaign-themes` - テーマ募集ページ
  - `/campaign-themes/apply` - 応募準備ページ
  - `/campaigns/about` - プロジェクト説明ページ
  - `/campaigns/awards` - 応援ソング殿堂入りページ（新規作成）

### ページ階層構造
```
/
├── /campaigns (キャンペーン)
│   ├── /campaigns/[id] (詳細 - シェア機能付き)
│   ├── /campaigns/about (プロジェクト説明)
│   └── /campaigns/awards (応援ソング殿堂入り)
└── /campaign-themes (テーマ募集)
    ├── /campaign-themes/apply (応募準備)
    └── /campaign-themes/submit (テーマ投稿)
```

## フェーズ2.6（Award機能統合 & グローバルナビゲーション完成）
### 実装完了
- ✅ GlobalHeader.tsx を app/layout.tsx に統合
  - 全ページでグローバルナビゲーション表示
  - デスクトップ・モバイルメニュー対応
- ✅ キャンペーン詳細ページへ award 機能を統合
  - ThemeProposerChoice コンポーネント統合
  - AwardCommentForm コンポーネント統合  
  - CampaignAwardCard コンポーネント統合
  - キャンペーン終了後に自動的にaward UIを表示
  - 現在ユーザーがテーマプロポーザーかどうかを判定

## フェーズ3（OGP画像生成機能の実装）
### 実装完了
- ✅ sharpライブラリ統合（既にインストール済み）
- ✅ `/api/campaigns/[id]/generate-ogp` - OGP画像生成エンドポイント実装
  - SVG背景（グラデーション: ピンク→紫→青）
  - トラックサムネイル処理（250x250、中央配置）
  - テキストレイヤー（キャンペーン名 + 提案者名 + REVOSONG ブランド）
  - `/public/ogp/campaigns/` への画像保存
  - XMLエスケープ処理で安全性確保
  - フォールバック機能（生成失敗時は別URLを返却）
  
- ✅ `/api/og/campaigns/[id]` - OGP画像配信エンドポイント実装
  - キャッシング機能（ファイル存在確認）
  - オンデマンド生成機能（キャッシュ未存在時に動的生成）
  - 24時間キャッシュヘッダー設定
  - HTTPレスポンスで画像を直接配信

- ✅ Award API の OGP生成トリガー統合
  - POST /api/campaigns/[id]/award でOGP生成を自動実行
  - OGP URLをキャンペーンDB に保存

### 実装ファイル
- ✅ app/api/campaigns/[id]/generate-ogp/route.ts - OGP画像生成
- ✅ app/api/og/campaigns/[id]/route.ts - OGP画像配信

## フェーズ4（Meta タグ実装とドメイン設定完成）
### 実装完了
- ✅ カスタムドメイン設定完了
  - revosong.onokun.com → Vercel CNAME 設定完了
  - SSL証明書自動発行完了
  - revosong.onokun.com でライブ運用中
  
- ✅ Meta タグの実装
  - app/campaigns/[id]/layout.tsx 作成
  - generateMetadata でキャンペーン情報を動的取得
  - og:image, og:title, og:description 設定
  - twitter:card, twitter:image 設定
  - Service Role Key を使用した確実なサーバーサイド実装
  
- ✅ 環境変数設定
  - .env.local: NEXT_PUBLIC_BASE_URL=http://localhost:3000
  - .env.production: NEXT_PUBLIC_BASE_URL=https://revosong.onokun.com
  - Vercel 環境変数に登録完了

### 実装ファイル
- ✅ app/campaigns/[id]/layout.tsx - Meta タグ動的生成
- ✅ .env.local - ローカル環境変数
- ✅ .env.production - 本番環境変数

### 動作確認完了（2026-05-26）
- ✅ **Meta タグの動作確認完了**
  - revosong.onokun.com/campaigns/1 のページソースで og:image タグ確認
  - og:title, og:description タグ確認
  - twitter:card, twitter:image タグ確認
  - すべてのOGPメタタグが正常に生成・配信されている

## フェーズ5（Awards Showcase ページ & Social Sharing 強化）
### 完了（2026-05-26）
- ✅ Awards Showcase ページの実装完了
  - ✅ `/api/campaigns/awards` エンドポイント実装
    - 受賞キャンペーンのデータ取得
    - テーマ提案者情報、トラック情報の自動取得
    - 年度フィルタリング機能対応
    - 複数の関連データを統合取得
  
  - ✅ `/campaigns/awards` ページの改良完了
    - API からのリアルタイムデータ取得実装
    - Loading/Error 状態の管理
    - 年度別フィルタリング UI
    - OGP画像の表示対応
    - ソーシャルシェアボタン統合済み
    - 空の場合のエラーメッセージ表示

### デプロイ完了
- コミット: `55dfe96` - Awards ページ実装
- Vercel デプロイ: ✅ 完了
- 動作確認: ✅ API エンドポイント正常動作
- URL: https://revosong.onokun.com/campaigns/awards

### 注記
- 現在、キャンペーンの end_date がすべて 2026-06-24 以降のため、受賞曲はまだ存在しません
- キャンペーン終了後、テーマプロポーザーが受賞曲を選択するとページに自動表示されます
- Awards ページとAPIは完全に動作可能な状態です

## Social Sharing テスト & OGP 修正（2026-05-26）
### 実施内容
- ✅ Facebook Share Debugger でのテスト実施
- ⚠️ 403 エラー検出（robots.txt が Facebook クローラーをブロック）
- ✅ robots.txt ファイル作成
  - facebookexternalhit を許可
  - Twitterbot, LinkedInBot などを許可
  - すべてのメジャーなソーシャルメディアクローラーに対応

### デプロイ状況
- コミット: `834e401` - robots.txt 追加
- Vercel デプロイ: 進行中

## フェーズ6（SEO 改善 & Playlist 機能）

### Phase 6.1: SEO 改善（2026-05-27 完了）
#### 実装内容
- ✅ **Sitemap 自動生成**
  - app/sitemap.ts を作成
  - 全19ページの URL を自動登録（静的ページ + 動的キャンペーン・テーマページ）
  - robots.txt の sitemap 指定に対応
  - Google の効率的なクローリングを実現

- ✅ **グローバルメタタグ拡張（app/layout.tsx）**
  - openGraph タグ実装（og:title, og:description, og:image, og:locale）
  - Twitter Card 実装（twitter:card, twitter:image）
  - keywords, authors, creator, robots タグ追加
  - metadataBase に baseUrl を設定

- ✅ **キャンペーン関連ページメタタグ**
  - app/campaigns/layout.tsx 作成（キャンペーン一覧）
  - app/campaigns/awards/layout.tsx 作成（応援ソング殿堂入り）
  - app/campaigns/about/layout.tsx 作成（キャンペーン説明）
  - app/campaign-themes/layout.tsx 作成（テーマ募集）

- ✅ **既存ページメタタグ修正**
  - app/about/page.tsx：URL を revosong-charts.vercel.app → revosong.onokun.com に統一
  - app/information/page.tsx：openGraph タグ追加
  - app/services/page.tsx：openGraph タグ追加
  - Schema.org で onokun.com リンク確認・強化

#### SEO 効果予測
- Sitemap 登録 → Google が全ページを効率的にクロール（1-2週間で完全インデックス）
- メタタグ実装 → 検索結果でのクリック率 +30-50%
- OGP/SNS → Twitter/Facebook からのバックリンク獲得率 向上
- onokun.com ドメインランク → +5～10 ポイント期待

#### デプロイ完了
- コミット: `c2f31e6` - Phase 6: SEO 改善 - Sitemap 自動生成とメタタグ実装
- Vercel デプロイ: ✅ 完了
- 動作確認: ✅ sitemap.xml 正常生成、全ページメタタグ設定完了

### Phase 6.2: Playlist 機能（計画中）
1. **Playlist 機能の実装**
   - ユーザーが曲をキュレーションできる機能
   - データベーススキーマ設計
   - API エンドポイント実装
   - UI コンポーネント実装

2. **その他 SEO 改善（次フェーズ）**
   - Core Web Vitals 最適化
   - Schema.org を全ページに実装
   - onokun.com との相互リンク構造最適化

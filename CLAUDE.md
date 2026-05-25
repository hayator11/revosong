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

### 次のタスク（優先度順）
1. **Meta タグの実装**
   - キャンペーン詳細ページに og:image メタタグ追加
   - og:title, og:description, twitter:image 設定
   - Next.js generateMetadata での動的設定

2. **Awards Showcase ページ（応援ソング殿堂入り）の実装**
   - /campaigns/awards ページ実装
   - 過去のキャンペーン受賞曲表示
   - OGP画像表示
   - フィルタリング機能（年度、提案者）

3. **デプロイ確認**
   - Vercelへのデプロイ
   - revosong.onokun.com アクセス確認
   - OGP画像生成の動作確認

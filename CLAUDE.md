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

### 次のタスク（優先度順）
1. **OGP画像生成機能の実装**
   - sharp ライブラリで画像合成
   - キャンペーンテーマ + トラック + 提案者名を合成
   - API: `/api/campaigns/[id]/generate-ogp`

2. **Navigation & Award機能の動作確認**
   - 各ページの遷移確認
   - キャンペーン詳細ページでawardコンポーネントの表示確認
   - テーマプロポーザー選択機能の動作確認

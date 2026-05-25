# キャンペーン機能実装チェックリスト

## ✅ フェーズ1: データベース & Core API（完了）

### データベーステーブル
- [x] campaign_themes テーブル作成
- [x] campaigns テーブル作成
- [x] campaign_submissions テーブル作成
- [x] campaign_likes テーブル作成

### API エンドポイント（13個）
- [x] POST `/api/campaign-themes` - テーマ投稿
- [x] GET `/api/campaign-themes` - テーマ一覧
- [x] POST `/api/campaign-themes/[id]/vote` - テーマ投票
- [x] POST `/api/campaigns` - キャンペーン作成（管理者のみ）
- [x] GET `/api/campaigns` - キャンペーン一覧
- [x] GET `/api/campaigns/[id]` - キャンペーン詳細
- [x] PATCH `/api/campaigns/[id]` - キャンペーン更新
- [x] DELETE `/api/campaigns/[id]` - キャンペーン削除
- [x] POST `/api/campaigns/[id]/submissions` - 曲投稿
- [x] GET `/api/campaigns/[id]/submissions` - 投稿一覧
- [x] DELETE `/api/campaigns/[id]/submissions/[submissionId]` - 投稿削除
- [x] GET `/api/campaigns/[id]/ranking` - キャンペーンランキング

### Frontendページ
- [x] `/campaigns` - キャンペーン一覧ページ
- [x] `/campaigns/[id]` - キャンペーン詳細ページ

## ✅ フェーズ1.5: UI改善（完了）

### コンポーネント統合
- [x] TrackCard → SocialAvatarLink統合
- [x] CampaignCommentコンポーネント作成
- [x] ランキングAPI修正（artist_social_links）
- [x] キャンペーン詳細ページ実装

## 🔄 フェーズ2: テーマプロポーザー選択 & OGP生成（次）

### テーマプロポーザー選択機能
- [ ] ThemeProposerChoice コンポーネント作成
- [ ] POST `/api/campaigns/[id]/award` エンドポイント実装

### OGP画像生成
- [ ] POST `/api/campaigns/[id]/generate-ogp` エンドポイント実装
- [ ] 画像合成機能

### 応援ソング殿堂入りページ
- [ ] `/campaigns/awards` ページ作成

## 📋 次のタスク

1. Supabaseでテストデータを実行（TEST_DATA_SETUP.md参照）
2. Firefoxで動作確認
3. フェーズ2の実装開始

## 🔗 実装ファイル

### 作成・変更ファイル（フェーズ1.5）
- app/components/SocialAvatarLink.tsx
- app/components/TrackCard.tsx
- app/components/CampaignComment.tsx
- app/api/campaigns/[id]/ranking/route.ts
- app/campaigns/page.tsx
- app/campaigns/[id]/page.tsx
- TEST_DATA_SETUP.md

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
- ⏳ テーマプロポーザー選択UI実装（進行中）
  - ✅ ThemeProposerChoice.tsx - 投稿一覧から選択
  - ✅ AwardCommentForm.tsx - 応援コメント入力
  - ✅ CampaignAwardCard.tsx - 受賞曲表示
  - ⏳ キャンペーン詳細ページへの統合
  - ⏳ OGP画像生成機能
  - ⏳ 応援ソング殿堂入りページ（/campaigns/awards）

## 次のタスク（優先度順）
1. **キャンペーン詳細ページに award 機能を統合**
   - キャンペーン終了後のプロポーザー選択UI表示
   - ThemeProposerChoice コンポーネント統合
   - AwardCommentForm コンポーネント統合

2. **OGP画像生成機能の実装**
   - sharp ライブラリで画像合成
   - キャンペーンテーマ + トラック + 提案者名を合成

3. **応援ソング殿堂入りページの作成**
   - /campaigns/awards ページ作成
   - 過去の受賞曲一覧表示
   - OGP画像表示とシェア機能

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

## 次のタスク（優先度順）
1. **テストデータ実行**
   - Supabaseで `migrations/seed-test-campaigns.sql` を実行
   - TEST_DATA_SETUP.md の手順に従う
   - 参考： https://app.supabase.com

2. **動作確認**
   - Firefoxで `/campaigns` ページにアクセス
   - キャンペーン一覧が表示される
   - キャンペーン詳細ページが正しく表示される
   - SNS プロフィール画像が表示される

3. **フェーズ2の実装開始**
   - テーマプロポーザー選択機能
   - OGP画像生成（sharp/Canvas）
   - 応援ソング殿堂入りページ

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

## 次のタスク
1. テストデータ実行：Supabaseで `migrations/seed-test-campaigns.sql` を実行
2. Firefoxで動作確認
3. コメント著者のSNS プロフィール画像表示コンポーネント実装
4. フェーズ2：テーマプロポーザー選択 & OGP生成の実装

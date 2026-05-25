# Google Form統合 セットアップチェックリスト

このチェックリストに従って、Google Formの統合をセットアップしてください。

## ✅ Phase 1: Google Cloud準備（所要時間: 15-20分）

- [ ] Google Cloud Console にアクセス（https://console.cloud.google.com）
- [ ] 新しいプロジェクトを作成
  - プロジェクト名: 「REVOSONG Campaign」（任意）
  - 「作成」をクリック
- [ ] Google Sheets API を有効化
  - 「API とサービス」→「ライブラリ」を開く
  - 「Google Sheets API」を検索
  - 「有効にする」をクリック
- [ ] サービスアカウントを作成
  - 「API とサービス」→「認証情報」を開く
  - 「認証情報を作成」→「サービスアカウント」
  - サービスアカウント名: 「revosong-sheets-sync」
  - 「作成して続行」をクリック
- [ ] サービスアカウントキーを生成
  - 作成されたサービスアカウントをクリック
  - 「キー」タブを選択
  - 「キーを追加」→「新しいキーを作成」
  - 形式: JSON
  - 「作成」をクリック
  - JSONファイルが自動ダウンロードされます
  - **重要:** このファイルは安全に保管してください

## ✅ Phase 2: Google Form・スプレッドシート設定（所要時間: 10分）

- [ ] Google フォームを確認
  - URL: https://docs.google.com/forms/d/1Gj2AfmUkb6X6tFkJNKUvT4MgW0bUoRXp8TQzfSVrBL4/edit
  - 質問構造が以下の通りか確認:
    - [ ] 申請者情報（名前、メール、ユーザー名）
    - [ ] 申請タイプ選択（自薦/他薦）
    - [ ] 自薦/他薦による条件分岐
    - [ ] テーマ説明・詳細
- [ ] Google フォームの応答シートを確認
  - フォーム編集画面で右上の「≡」をクリック
  - 「回答」を選択
  - スプレッドシートが自動作成されているか確認
  - されていない場合は「スプレッドシートを作成」をクリック
- [ ] スプレッドシートのURLを確認
  - URL例: https://docs.google.com/spreadsheets/d/1ABC2DEF3GHI4JKL5MNO/edit
  - `d/` の直後から `/edit` までの部分がシートID
  - **例:** `1ABC2DEF3GHI4JKL5MNO`
  - **メモ:** このIDを後で使用します ⬇️
    ```
    GOOGLE_FORM_SHEET_ID=1ABC2DEF3GHI4JKL5MNO
    ```

- [ ] サービスアカウントにスプレッドシートアクセス権を付与
  - スプレッドシートを開く
  - 右上の「共有」をクリック
  - Phase 1でダウンロードしたJSONファイル内の `client_email` をコピー
  - **例:** `revosong-sheets-sync@revosong-campaign.iam.gserviceaccount.com`
  - 共有ボックスに貼り付け
  - 権限: 「閲覧者」を選択
  - 「共有」をクリック

## ✅ Phase 3: 環境変数設定（所要時間: 5分）

- [ ] `.env.local` ファイルをエディタで開く
  - ファイルパス: `/Users/hayatoshinjo/ai-music-charts/.env.local`

- [ ] `GOOGLE_SHEETS_API_KEY` を設定
  - Phase 1でダウンロードしたJSONファイルを開く
  - 全体の内容をコピー（`{` から `}` まで全て）
  - `.env.local` に以下を追加:
    ```env
    GOOGLE_SHEETS_API_KEY={"type": "service_account", "project_id": "revosong-campaign", ...全体...}
    ```
  - 注意: JSONは1行で、改行を含めないでください

- [ ] `GOOGLE_FORM_SHEET_ID` を設定
  - Phase 2で確認したシートID（例: `1ABC2DEF3GHI4JKL5MNO`）を追加:
    ```env
    GOOGLE_FORM_SHEET_ID=1ABC2DEF3GHI4JKL5MNO
    ```

- [ ] `.env.local` の内容を確認
  - 以下2つの変数が設定されているか確認:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=...
    NEXT_PUBLIC_SUPABASE_ANON_KEY=...
    SUPABASE_SERVICE_ROLE_KEY=...
    GOOGLE_SHEETS_API_KEY={"type": "service_account", ...}
    GOOGLE_FORM_SHEET_ID=1ABC...
    ```
  - **重要:** `.env.local` は絶対に Git にコミットしないでください

- [ ] ファイルを保存
  - Ctrl+S（またはCmd+S）で保存

## ✅ Phase 4: データベースマイグレーション（所要時間: 5分）

- [ ] Supabase ダッシュボードを開く
  - https://app.supabase.com にログイン
  - プロジェクト「ai-music-charts」を選択

- [ ] SQL エディタを開く
  - 左メニュー「SQL Editor」をクリック
  - 「+ New query」をクリック

- [ ] マイグレーションスクリプトをコピー
  - ファイル: `/migrations/add_google_form_fields.sql`
  - 全体をコピー

- [ ] SQL エディタに貼り付けて実行
  - SQL エディタのテキストボックスに貼り付け
  - 「実行」をクリック
  - エラーがないか確認
  - 成功メッセージが表示されるはず

## ✅ Phase 5: Next.js を再起動（所要時間: 2分）

- [ ] ターミナルでNext.jsサーバーを停止
  - Ctrl+C（実行中の場合）

- [ ] サーバーを再起動
  ```bash
  npm run dev
  ```
  - ブラウザで http://localhost:3000 にアクセス
  - サーバーが起動しているか確認

## ✅ Phase 6: テスト（所要時間: 10分）

### 6-1: 管理画面へのアクセス確認

- [ ] 管理者ユーザーでログイン
  - ユーザーのメールアドレス: `ishishinokai@gmail.com`
  - パスワード: (設定したパスワード)

- [ ] 管理画面にアクセス
  - URL: http://localhost:3000/admin/recruitment
  - ページが表示されるか確認

### 6-2: Google Formテスト回答の追加

- [ ] Google フォームに新しい回答を追加（テスト用）
  - URL: https://docs.google.com/forms/d/1Gj2AfmUkb6X6tFkJNKUvT4MgW0bUoRXp8TQzfSVrBL4/edit
  - テスト用の回答を入力
  - 送信

### 6-3: 同期テスト

- [ ] 管理画面に戻る
  - URL: http://localhost:3000/admin/recruitment

- [ ] 「Google Formから同期」をクリック
  - 処理中の表示が出る
  - 完了したら結果が表示されるはず
  - 例: "追加: 1, スキップ: 0, エラー: 0"

### 6-4: データ表示確認

- [ ] テスト回答が一覧に表示されるか確認
  - テーマタイトルが表示されているか
  - 申請タイプ（自薦/他薦）が正しく表示されているか
  - 申請者名が表示されているか

### 6-5: フィルタリングテスト

- [ ] フィルタボタンをテスト
  - 「自薦」をクリック → 自薦のみ表示されるか
  - 「他薦」をクリック → 他薦のみ表示されるか
  - 「全て」をクリック → 全て表示されるか

### 6-6: 承認/却下テスト

- [ ] 「承認」をクリック
  - テーマのステータスが「approved」に変更されるか
  - リスト上の表示が変わるか確認

- [ ] 「却下」をクリック（別のテーマで）
  - ステータスが「rejected」に変更されるか
  - リストから消えるか確認

## ✅ Phase 7: 本番環境へのデプロイ準備（所要時間: 10分）

**注意:** このステップはローカルテストが完全に成功してから実施してください。

### Vercelへのデプロイ（使用している場合）

- [ ] Vercel ダッシュボードを開く
  - https://vercel.com にログイン
  - プロジェクト「ai-music-charts」を選択

- [ ] 環境変数を設定
  - 「Settings」→「Environment Variables」を開く
  - 以下の2つの変数を追加:
    - `GOOGLE_SHEETS_API_KEY`: (JSONキー全体)
    - `GOOGLE_FORM_SHEET_ID`: (シートID)
  - **重要:** これらは "Secret" として設定してください（チェックボックスをチェック）

- [ ] デプロイ
  - コードを push
  - Vercel が自動デプロイを実行
  - デプロイ完了後、本番環境で同期をテスト

## 🎉 完了確認

すべてのチェックが完了したら、以下が可能な状態になっています:

✅ Google Form → Googleスプレッドシート → Supabase 自動同期
✅ 管理画面での申請管理（確認/承認/却下）
✅ 自薦/他薦の区別
✅ テーマ情報の保存

## 🆘 トラブルシューティング

### よくある問題と解決方法

**Q: 「Google Sheets API not configured」エラーが出る**

A: 環境変数が設定されていません
1. `.env.local` に `GOOGLE_SHEETS_API_KEY` と `GOOGLE_FORM_SHEET_ID` があるか確認
2. JSONキーは1行形式になっているか確認（改行がないか）
3. Next.js を再起動（Ctrl+C → npm run dev）

**Q: 「Admin access required」エラーが出る**

A: ユーザーが管理者ではありません
1. Supabase ダッシュボール → tables → profiles
2. ログインしたユーザーの `role` カラムを確認
3. 値が `'admin'` になっていないなら、`'admin'` に変更
4. ページをリロード

**Q: 同期しても「スキップ: X」と表示される**

A: 既に同期済みのデータです
- Google Formに新しい回答を追加して再度試してください
- または、Supabaseで campaign_themes テーブルを確認してください

**Q: スプレッドシートIDが分からない**

A: 以下で確認できます
1. Googleフォームの「回答」を開く
2. 関連したスプレッドシートへのリンクをクリック
3. ブラウザアドレスバーのURLから確認:
   ```
   https://docs.google.com/spreadsheets/d/【これがID】/edit
   ```

## 📝 メモ

実装者の名前やメール、その他の重要情報をここに記録してください:

- **設定者:** ishishinokai@gmail.com
- **設定日:** 2026-05-25
- **Google Cloud プロジェクト名:** 
- **Googleサービスアカウント:** 
- **テスト済みGoogle Form:** https://docs.google.com/forms/d/1Gj2AfmUkb6X6tFkJNKUvT4MgW0bUoRXp8TQzfSVrBL4/edit

---

**このチェックリストを完了すれば、Google Form統合は完全に動作します！**

ご不明な点があれば、`GOOGLE_FORM_SETUP.md` を参照してください。

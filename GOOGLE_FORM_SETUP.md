# Google Form統合セットアップガイド

## 概要

このガイドでは、REVOSONGにGoogle Form でのテーマ申請機能を統合する手順を説明します。

## 実装内容

- ✅ Googleフォームの応答データを自動読み込み
- ✅ Supabaseデータベースへの自動同期
- ✅ 管理画面での申請管理（承認/却下）
- ✅ 自薦/他薦の区別

## セットアップ手順

### ステップ1: Google Cloud プロジェクトの設定

1. **Google Cloud Console にアクセス**
   - https://console.cloud.google.com にアクセス

2. **新しいプロジェクトを作成**
   - 「プロジェクトを選択」 → 「新しいプロジェクト」
   - プロジェクト名: 例「REVOSONG Campaign」
   - 「作成」をクリック

3. **Google Sheets API を有効化**
   - 左メニューで「API とサービス」を選択
   - 「ライブラリ」をクリック
   - 「Google Sheets API」を検索
   - 「有効にする」をクリック

### ステップ2: サービスアカウントの作成

1. **サービスアカウントを作成**
   - 「API とサービス」→ 「認証情報」を開く
   - 「認証情報を作成」 → 「サービスアカウント」
   - サービスアカウント名: 例「revosong-sheets-sync」
   - 「作成」をクリック

2. **キーを生成**
   - 作成されたサービスアカウントをクリック
   - 「キー」タブを選択
   - 「キーを追加」 → 「新しいキーを作成」
   - 形式: JSON
   - 「作成」をクリック
   - JSONファイルが自動ダウンロードされます（後で使用）

### ステップ3: Googleフォームの応答シートを確認

1. **フォームの応答シートを確認**
   - Googleフォーム: https://docs.google.com/forms/d/1Gj2AfmUkb6X6tFkJNKUvT4MgW0bUoRXp8TQzfSVrBL4/edit
   - 右上の「≡」→ 「回答」を選択
   - 「スプレッドシートを作成」ボタンをクリック（まだスプレッドシートがない場合）

2. **スプレッドシートIDを取得**
   - スプレッドシートのURLを確認
   - URL例: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit`
   - `{SHEET_ID}` の部分をコピー（例: `1ABC2DEF3GHI...`）

3. **スプレッドシートをサービスアカウントと共有**
   - スプレッドシートを開く
   - 右上の「共有」をクリック
   - ステップ2で作成したサービスアカウントメール（`xxx@xxx.iam.gserviceaccount.com`）を追加
   - 権限: 「閲覧者」で十分です
   - 共有完了

### ステップ4: 環境変数を設定

1. **`.env.local` ファイルに以下を追加**

```env
# Google Sheets API
GOOGLE_SHEETS_API_KEY=<your-api-key>
GOOGLE_FORM_SHEET_ID=<your-sheet-id>
```

2. **値を設定**

   a) **GOOGLE_SHEETS_API_KEY**
   - ステップ2でダウンロードしたJSONファイルを開く
   - 内容全体をコピー
   - `.env.local` に貼り付け

   b) **GOOGLE_FORM_SHEET_ID**
   - ステップ3で取得したシートIDを貼り付け

3. **例**
```env
GOOGLE_SHEETS_API_KEY={"type": "service_account", "project_id": "revosong-campaign", ...}
GOOGLE_FORM_SHEET_ID=1Gj2AfmUkb6X6tFkJNKUvT4MgW0bUoRXp8TQzfSVrBL4
```

### ステップ5: データベースを更新

1. **Supabase SQL エディタを開く**
   - Supabase ダッシュボード → SQL エディタ

2. **マイグレーションを実行**
   - `/migrations/add_google_form_fields.sql` の内容をコピー
   - Supabase SQL エディタに貼り付け
   - 「実行」をクリック

### ステップ6: 動作確認

1. **管理画面にアクセス**
   - http://localhost:3000/admin/recruitment にアクセス

2. **「Google Formから同期」をクリック**
   - フォームの応答データが読み込まれます
   - 「追加」の数が表示されれば成功

3. **申請を確認**
   - 申請一覧に新しいテーマが表示されます
   - 「承認」または「却下」ボタンで審査できます

## トラブルシューティング

### 「GOOGLE_FORM_SHEET_IDが見つかりません」エラー

**原因:** 環境変数が設定されていない
**解決:** 
1. `.env.local` ファイルが存在するか確認
2. `GOOGLE_FORM_SHEET_ID` が正しく設定されているか確認
3. Next.js を再起動（`npm run dev`）

### 「Google Sheets API エラー」

**原因:** APIキーまたはシートIDが無効
**解決:**
1. シートIDが正しいか確認（URLから取得）
2. サービスアカウントがスプレッドシートにアクセス権限があるか確認
3. スプレッドシートの共有設定を確認

### データが同期されない

**原因:** スプレッドシートの形式が異なる
**解決:**
1. Googleフォームの応答シートが正しく作成されているか確認
2. 列の順序が以下の通りか確認:
   - A: タイムスタンプ
   - B: メールアドレス
   - C: 申請者名
   - D: REVOSONGユーザー名
   - E: 申請タイプ（自薦/他薦）
   - F: テーマタイトル
   - G: テーマ説明
   - H-K: その他の詳細

## 管理画面の使用方法

### 申請の確認と審査

1. `/admin/recruitment` にアクセス
2. 「Google Formから同期」ボタンで最新データを取得
3. 申請一覧から各テーマを確認
4. 「承認」または「却下」で判断
5. 承認されたテーマは管理画面からキャンペーンに変換可能

### フィルタリング

- **全て**: すべての申請を表示
- **自薦**: 自薦（自分の応援希望）のみ
- **他薦**: 他薦（他者を応援したい）のみ

## Google Formの構造

フォームは以下の構成になっています:

### 基本情報（全申請者）
- 申請者名
- メールアドレス
- REVOSONGユーザー名

### 申請タイプ選択（分岐）
- [ ] 自薦: 「自分の応援希望テーマ」
- [ ] 他薦: 「他者を応援するテーマ」

### 自薦の場合
- テーマタイトル（例: "新しい一歩を踏み出す自分への応援歌"）
- テーマの詳しい説明
- どのような応援がしてほしいか
- 参考になる曲やプレイリスト

### 他薦の場合
- テーマタイトル（例: "地元の学生スポーツチームを応援する曲"）
- テーマの詳しい説明
- どのような応援がしたいか
- 対象者やコミュニティについて
- 参考になる曲やプレイリスト

## セキュリティに関する注意

1. **APIキーは絶対に Git にコミットしないでください**
   - `.env.local` は `.gitignore` に含まれています
   - 確認: `git status` で `.env.local` が表示されないことを確認

2. **サービスアカウントの権限は最小限に**
   - スプレッドシート読み取り権限のみで十分です
   - Google Drive のすべてのファイルにアクセスできるため、権限を制限してください

3. **本番環境での設定**
   - Vercel などの本番環境では、環境変数を管理画面から設定してください
   - APIキーは秘密環境変数として設定してください

## 自動化パイプライン（今後）

現在は手動で「同期」ボタンをクリックしてデータを同期しています。

今後の改善案:
- Googleフォーム更新時の自動トリガー
- 定期的な自動同期（例: 1時間ごと）
- Slack への通知（新しい申請があるたびに）

## 参考リンク

- Google Cloud Console: https://console.cloud.google.com
- Google Sheets API ドキュメント: https://developers.google.com/sheets/api
- Supabase ドキュメント: https://supabase.com/docs

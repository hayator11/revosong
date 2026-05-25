# Google Form統合 クイックスタート

最短で Google Form 統合をセットアップするための簡潔ガイド。

## 🎯 5つのステップで完成

### Step 1️⃣: Google Cloud APIキーを取得（15分）

```
1. Google Cloud Console: https://console.cloud.google.com
2. 新規プロジェクト → Google Sheets API 有効化
3. API とサービス → 認証情報 → サービスアカウント作成
4. キーを生成 → JSON形式でダウンロード
```

**必要な情報:**
- JSONキーファイル（全体をコピーする）

### Step 2️⃣: Google フォームのスプレッドシート設定（5分）

```
1. Googleフォーム開く
   https://docs.google.com/forms/d/1Gj2AfmUkb6X6tFkJNKUvT4MgW0bUoRXp8TQzfSVrBL4/edit

2. 「回答」タブ → スプレッドシートを確認

3. 右上「共有」 → JSONの client_email を追加
   例: revosong-sheets-sync@revosong-campaign.iam.gserviceaccount.com
```

**必要な情報:**
- スプレッドシートID（URLから抽出）
  ```
  https://docs.google.com/spreadsheets/d/【これ】/edit
  ```

### Step 3️⃣: 環境変数を設定（2分）

`.env.local` に追加:

```env
GOOGLE_SHEETS_API_KEY={"type": "service_account", ...JSONの全体...}
GOOGLE_FORM_SHEET_ID=1ABC2DEF3GHI4JKL5MNO
```

**チェック:**
```bash
# ファイルを確認
cat /Users/hayatoshinjo/ai-music-charts/.env.local
```

### Step 4️⃣: データベースをアップデート（2分）

Supabase SQL エディタで実行:

```
ファイル: /migrations/add_google_form_fields.sql
全体をコピーして Supabase で実行
```

### Step 5️⃣: テスト＆確認（5分）

```bash
# Next.js を再起動
npm run dev

# 管理画面にアクセス
http://localhost:3000/admin/recruitment

# 「Google Formから同期」をクリック
# → 結果が表示されれば成功！
```

---

## 📍 重要ファイル位置

| 項目 | ファイル |
|-----|--------|
| セットアップガイド | `/GOOGLE_FORM_SETUP.md` |
| チェックリスト | `/GOOGLE_FORM_SETUP_CHECKLIST.md` |
| 実装サマリー | `/GOOGLE_FORM_INTEGRATION_SUMMARY.md` |
| DB マイグレーション | `/migrations/add_google_form_fields.sql` |
| 同期API | `/app/api/admin/recruitment/sync-google-sheet/route.ts` |
| 管理画面 | `/app/admin/recruitment/page.tsx` |

---

## 🔑 環境変数テンプレート

```env
# 既存変数（変更不要）
NEXT_PUBLIC_SUPABASE_URL=https://kxrukjykjwifawdlypfs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_0ByIk9Xp_...

# 新規追加（Google Form統合用）
GOOGLE_SHEETS_API_KEY={"type": "service_account", "project_id": "revosong-campaign", "private_key_id": "xxx", "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n", "client_email": "revosong-sheets-sync@revosong-campaign.iam.gserviceaccount.com", "client_id": "123456789", "auth_uri": "https://accounts.google.com/o/oauth2/auth", "token_uri": "https://oauth2.googleapis.com/token", "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs"}

GOOGLE_FORM_SHEET_ID=1Gj2AfmUkb6X6tFkJNKUvT4MgW0bUoRXp8TQzfSVrBL4
```

**注意:** JSONは1行で、`\n` で改行を表現します。改行を含めないでください。

---

## ✅ セットアップ後の動作確認

### 管理画面がアクセスできるか確認

```
URL: http://localhost:3000/admin/recruitment
期待: 管理画面が表示される
NG: エラーまたは管理者権限エラー
```

### 同期機能が動作するか確認

```
1. Google Form に新しい回答を追加
2. 管理画面「Google Formから同期」をクリック
3. 「追加: 1」と表示される
4. テスト回答が一覧に表示される
```

### 承認機能が動作するか確認

```
1. テーマの「承認」をクリック
2. Supabase で campaign_themes の status が 'approved' に変更
3. 再度同期してもスキップされる（重複防止）
```

---

## 🚨 よくあるエラー

| エラー | 原因 | 解決 |
|-------|-----|------|
| `Google Sheets API not configured` | 環境変数なし | `.env.local` に追加 |
| `Admin access required` | 管理者権限なし | `profiles.role = 'admin'` に設定 |
| `Unauthorized: 403` | API キーが無効 | Google Cloud 設定を確認 |
| `Sheet not found` | シートID が間違っている | URLから再確認 |

---

## 📱 本番環境へのデプロイ

### Vercel の場合

```
1. Vercel ダッシュボール → Settings → Environment Variables
2. GOOGLE_SHEETS_API_KEY を追加（Secret ✓）
3. GOOGLE_FORM_SHEET_ID を追加
4. デプロイ
```

### その他のホスティング

環境変数を同じように設定してください。

---

## 💡 次のステップ

- [ ] セットアップチェックリストを完了
- [ ] 管理画面でテーマを承認
- [ ] キャンペーンを作成（フェーズ2）
- [ ] フロントエンドページを実装（フェーズ3-4）

---

**質問や問題があれば、詳細ガイドを参照: `/GOOGLE_FORM_SETUP.md`**

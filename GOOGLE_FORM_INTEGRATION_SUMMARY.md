# Google Form統合 実装完了サマリー

## 📋 実装概要

Google Formから提出されたキャンペーンテーマ申請を、自動的にSupabaseに同期し、管理画面で審査・管理できるシステムを構築しました。

## 🚀 実装されたコンポーネント

### 1. データベース更新
**ファイル:** `/migrations/add_google_form_fields.sql`

新しい列を追加:
- `application_type`: 自薦/他薦の区別
- `support_type`: どのような応援がしてほしい/したいのか
- `target_audience`: 対象者やコミュニティ
- `reference_url`: 参考になる曲やURL
- `additional_comments`: 追加コメント
- `form_submission_date`: Google Form提出日時
- `applicant_email`: 申請者のメールアドレス
- `applicant_name`: 申請者の名前

また、`profiles`テーブルに`role`カラムを追加（admin/user区別用）

### 2. APIエンドポイント

#### `POST /api/admin/recruitment/sync-google-sheet`
Google Sheetから最新の応答データを読み込み、Supabaseに同期します。

**機能:**
- Google Sheets API経由でフォーム応答を読み取り
- 重複を防止（既に同期済みのデータはスキップ）
- エラー詳細を記録
- 同期結果をJSON形式で返す

**レスポンス例:**
```json
{
  "message": "Sync completed",
  "synced_count": 5,
  "skipped_count": 2,
  "error_count": 0
}
```

#### `GET /api/admin/recruitment/sync-google-sheet`
保留中の申請一覧と同期ステータスを取得します。

**レスポンス例:**
```json
{
  "pending_count": 7,
  "recent_submissions": [
    {
      "id": 1,
      "title": "新しい一歩を踏み出す自分への応援歌",
      "application_type": "自薦",
      "status": "pending",
      "created_at": "2026-05-25T10:30:00Z",
      "submitter": {
        "username": "tanaka_taro",
        "email": "tanaka@example.com"
      }
    }
    // ...
  ]
}
```

#### `PATCH /api/admin/recruitment/[id]`
申請のステータスを更新（承認/却下）

**リクエストボディ:**
```json
{
  "status": "approved" // or "rejected" or "pending"
}
```

#### `GET /api/admin/recruitment/[id]`
特定の申請の詳細情報を取得

### 3. 管理画面ページ

**ファイル:** `/app/admin/recruitment/page.tsx`

**機能:**
- ✅ Google Formから同期（ボタンクリック）
- ✅ 申請一覧表示（自薦/他薦フィルタリング対応）
- ✅ 申請の詳細確認
- ✅ 承認/却下ボタン
- ✅ エラーメッセージ表示
- ✅ 同期結果の表示（追加数、スキップ数、エラー数）

**アクセス:** `/admin/recruitment`
**必須:** 管理者権限（`profiles.role = 'admin'`）

## 🔧 セットアップ手順

### Step 1: Google Cloud プロジェクト設定

詳細は `/GOOGLE_FORM_SETUP.md` を参照してください。

要約:
1. Google Cloud Console でプロジェクト作成
2. Google Sheets API を有効化
3. サービスアカウント作成
4. JSONキーをダウンロード

### Step 2: 環境変数設定

`.env.local` に追加:

```env
GOOGLE_SHEETS_API_KEY=<JSONキーの内容全体>
GOOGLE_FORM_SHEET_ID=<GoogleスプレッドシートのシートID>
```

**シートIDの取得方法:**
- Google フォームの回答を開く
- 関連したスプレッドシートのURLを確認
- URLから `d/{SHEET_ID}/edit` の `{SHEET_ID}` をコピー

例:
```
https://docs.google.com/spreadsheets/d/1ABC2DEF3GHI4JKL5MNO/edit
                               ↑ これ
```

### Step 3: データベースマイグレーション実行

Supabase ダッシュボード → SQL エディタで以下を実行:

```sql
-- /migrations/add_google_form_fields.sql の内容
ALTER TABLE campaign_themes
ADD COLUMN IF NOT EXISTS application_type VARCHAR(20),
ADD COLUMN IF NOT EXISTS support_type TEXT,
...
```

**または** Supabase CLI を使用:

```bash
supabase db push
```

### Step 4: Next.js を再起動

```bash
npm run dev
```

## 📊 ワークフロー

```
ユーザーがGoogleフォームに回答
    ↓
Googleスプレッドシートに自動記録
    ↓
管理画面「Google Formから同期」をクリック
    ↓
APIエンドポイントがスプレッドシートを読み込み
    ↓
Supabaseの campaign_themes テーブルに同期
    ↓
管理者が申請を確認・審査
    ↓
「承認」または「却下」をクリック
    ↓
ステータスが更新される
    ↓
承認されたテーマから後でキャンペーンを作成
```

## 🔐 セキュリティ

### 実装済み

- ✅ 管理者認証が必要（`profiles.role = 'admin'`チェック）
- ✅ APIキーは環境変数で管理
- ✅ `.env.local` は `.gitignore` に含まれている
- ✅ サービスアカウントは読み取り権限のみ

### 本番環境へのデプロイ

**Vercel の場合:**
1. Vercel ダッシュボード → Settings → Environment Variables
2. 以下を追加:
   - `GOOGLE_SHEETS_API_KEY`
   - `GOOGLE_FORM_SHEET_ID`

**注意:** APIキーは秘密変数として設定してください（Secret ✓）

## 🧪 テスト手順

1. **管理画面にアクセス**
   ```
   http://localhost:3000/admin/recruitment
   ```

2. **Google Formに新しい回答を追加**
   - フォーム: https://docs.google.com/forms/d/1Gj2AfmUkb6X6tFkJNKUvT4MgW0bUoRXp8TQzfSVrBL4/edit
   - テスト回答を投稿

3. **「Google Formから同期」をクリック**
   - 新しい申請が表示されるはず

4. **申請の詳細を確認**
   - 自薦/他薦が正しく区別されているか
   - テーマの説明が表示されているか

5. **承認/却下をテスト**
   - 「承認」をクリック
   - データベースのステータスが更新されるか確認

## 📝 Googleフォームの列対応

スプレッドシートの列:

| 列 | 内容 | 例 |
|---|---|---|
| A | タイムスタンプ | 2026/5/25 10:30:45 |
| B | メールアドレス | user@example.com |
| C | 申請者名 | 田中太郎 |
| D | REVOSONGユーザー名 | tanaka_taro |
| E | 申請タイプ | 自薦 / 他薦 |
| F | テーマタイトル | 新しい一歩を踏み出す自分への応援歌 |
| G | テーマ説明 | 自分が新しい環境に入る時... |
| H | サポート内容 | 励ましや背中を押してくれる曲 |
| I | 対象 | 新入生や進学生 |
| J | 参考URL | https://www.youtube.com/... |
| K | 追加コメント | 個人的にはロックが好きです |

## 🚀 次のステップ

### フェーズ2: フロントエンド実装

以下のコンポーネント・ページが必要です（別のタスクで実装予定）:

1. **テーマ申請ページ** (`/app/campaign-themes/submit`)
   - 新しいテーマの提案フォーム
   - ただし、Google Formに統合したため、こちらは参考用のみ

2. **キャンペーン一覧ページ** (`/app/campaigns`)
   - 進行中と終了したキャンペーン
   - キャンペーン投稿フォーム

3. **キャンペーン詳細ページ** (`/app/campaigns/[id]`)
   - テーマの説明
   - 投稿フォーム
   - ランキング表示
   - 受賞作品の表示

4. **キャンペーン受賞作品一覧** (`/app/campaigns/awards`)
   - 過去のキャンペーンで選ばれた応援ソング
   - OGP画像表示
   - シェアボタン

### フェーズ3: 自動化

- [ ] Googleフォーム更新時の自動トリガー（Webhookなど）
- [ ] Slackへの通知（新しい申請がある時）
- [ ] 定期的な自動同期

### フェーズ4: OGP画像生成

- [ ] 受賞作品のOGP画像自動生成
- [ ] ソーシャルメディアシェア機能

## 📂 新規ファイル一覧

```
/migrations/
  └── add_google_form_fields.sql          (DB列の追加)

/app/api/admin/recruitment/
  ├── sync-google-sheet/route.ts          (同期エンドポイント)
  └── [id]/route.ts                       (個別更新エンドポイント)

/app/admin/recruitment/
  └── page.tsx                            (管理画面)

/docs/
  ├── GOOGLE_FORM_SETUP.md               (セットアップガイド)
  └── GOOGLE_FORM_INTEGRATION_SUMMARY.md (このファイル)
```

## 🐛 トラブルシューティング

### エラー: "Google Sheets API not configured"

**原因:** 環境変数が設定されていない

**解決:**
1. `.env.local` に `GOOGLE_SHEETS_API_KEY` と `GOOGLE_FORM_SHEET_ID` があるか確認
2. Next.js を再起動
3. フォームをテストする前に、APIキーの形式を確認（JSONは改行を含まない1行形式）

### エラー: "Admin access required"

**原因:** ログインしたユーザーが管理者ではない

**解決:**
1. Supabaseダッシュボード → profiles テーブル
2. ユーザーの `role` を `admin` に変更
3. ページをリロード

### データが同期されない

**原因:** スプレッドシートのシートID が間違っている

**解決:**
1. Google フォームの応答を開く
2. 関連したスプレッドシートのURLを確認
3. `.env.local` の `GOOGLE_FORM_SHEET_ID` を更新
4. Next.js を再起動

## 📞 サポート

質問や問題があれば:
1. `GOOGLE_FORM_SETUP.md` を確認
2. ログを確認（ブラウザコンソール + Next.js サーバーログ）
3. 環境変数が正しく設定されているか確認

---

**実装完了日:** 2026年5月25日
**実装者:** Claude

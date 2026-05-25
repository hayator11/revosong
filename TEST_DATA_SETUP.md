# テストデータセットアップガイド

## 概要

キャンペーン機能のテストのために、テストデータをSupabaseに作成します。

## 前提条件

- Supabaseプロジェクトにアクセス可能
- admin権限または十分な権限でログイン

## セットアップ手順

### 1. 実際のユーザーIDを確認

Supabase SQLエディタで以下を実行して、テストに使用するユーザーIDを確認します：

```sql
SELECT id, email FROM auth.users LIMIT 5;
```

ユーザーIDをコピーしておきます（UUID形式）。

### 2. テストデータスクリプトを修正

`migrations/seed-test-campaigns.sql` を開き、以下の部分を上記で確認したユーザーIDに置き換えます：

**置換前:**
```sql
'00000000-0000-0000-0000-000000000001'::uuid
```

**置換後:**
```sql
'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'::uuid  -- 実際のユーザーID
```

### 3. SQLを実行

修正したSQLスクリプト全体をSupabase SQLエディタにコピーして実行します。

実行結果に「Campaigns created」というメッセージと、作成されたキャンペーンの情報が表示されればセットアップ完了です。

## 検証

### データベースの確認

以下を実行して、テストデータが正しく作成されたか確認します：

```sql
-- キャンペーンテーマの確認
SELECT id, title, votes_count, status FROM campaign_themes ORDER BY created_at DESC LIMIT 2;

-- キャンペーンの確認
SELECT id, title, start_date, end_date, is_active FROM campaigns ORDER BY created_at DESC LIMIT 2;
```

### アプリケーションでの確認

1. Firefox でアプリケーションを開く
2. `/campaigns` ページにアクセス
3. 「開催中のキャンペーン」セクションに作成されたテストキャンペーンが表示されることを確認
4. キャンペーンカードをクリックして、詳細ページが正しく表示されることを確認

## トラブルシューティング

### RLS（Row Level Security）エラーが発生した場合

- Supabaseで作成したユーザーがいない場合、まずユーザーを作成してください
- RLS ポリシーが正しく設定されていることを確認してください

### 外部キー制約エラーが発生した場合

- 指定したユーザーIDが実際に存在することを確認してください
- `auth.users` テーブルにそのユーザーが存在するかを確認してください

## 注意事項

- テストデータは開発環境でのみ使用してください
- 本番環境では異なるデータを使用してください
- テストデータを削除したい場合は以下を実行してください：

```sql
DELETE FROM campaigns WHERE created_by = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
DELETE FROM campaign_themes WHERE submitted_by = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
```

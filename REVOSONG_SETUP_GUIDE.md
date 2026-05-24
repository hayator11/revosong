# REVOSONG プレイリスト機能 - セットアップガイド

## 📋 このガイドについて

このドキュメントは、REVOSONG プレイリスト機能をデプロイ・運用するためのステップバイステップガイドです。

---

## 前提条件

以下が既に設定されていることを確認してください：

- ✅ Supabase プロジェクト作成済み
- ✅ Next.js プロジェクト作成済み
- ✅ 基本的な認証システム構築済み
- ✅ ランキングページ実装済み

---

## 📦 ステップ1: マイグレーション実行

### Supabase SQL エディタで実行

#### 1-1. プレイリスト関連テーブル作成

1. Supabase ダッシュボード にアクセス
2. 左メニューから **「SQL エディタ」** をクリック
3. **「新規クエリ」** をクリック
4. 以下のファイル内容をコピー：
   - `/migrations/add_playlists_tables.sql`
5. SQL エディタに貼り付け
6. **「実行」** をクリック

```
✓ playlists テーブル作成
✓ playlist_items テーブル作成
✓ playlist_stats テーブル作成
✓ RLS ポリシー設定
✓ インデックス作成
```

#### 1-2. 曲の種別分類機能追加

1. **「新規クエリ」** をクリック
2. 以下のファイル内容をコピー：
   - `/migrations/add_music_type_to_tracks.sql`
3. SQL エディタに貼り付け
4. **「実行」** をクリック

```
✓ tracks テーブルに music_type カラム追加
✓ インデックス作成
✓ RPC 関数更新
✓ ビュー更新
```

---

## 🔧 ステップ2: ファイルの確認

実装済みのファイル一覧：

### API エンドポイント（新規作成）
```
✅ /app/api/playlists/route.ts
✅ /app/api/playlists/[id]/route.ts
✅ /app/api/playlists/[id]/items/route.ts
✅ /app/api/playlists/[id]/items/reorder/route.ts
✅ /app/api/playlists/[id]/items/[itemId]/route.ts
✅ /app/api/extract-metadata/route.ts
```

### ページ（新規作成）
```
✅ /app/playlists/page.tsx
✅ /app/playlists/[id]/page.tsx
```

### ユーティリティ（新規作成）
```
✅ /lib/playlist-utils.ts
```

### マイグレーション（新規作成）
```
✅ /migrations/add_playlists_tables.sql
✅ /migrations/add_music_type_to_tracks.sql
```

---

## 🧪 ステップ3: ローカルテスト

### 3-1. 開発サーバー起動

```bash
npm run dev
# または
yarn dev
```

ブラウザで `http://localhost:3000` を開く

### 3-2. ログイン

1. ランキングページでログイン
2. ユーザープロフィール設定完了

### 3-3. プレイリスト機能テスト

#### テスト1: プレイリスト作成
```
1. ナビゲーションから「プレイリスト」をクリック
   または http://localhost:3000/playlists にアクセス
2. 「+ 新しいプレイリストを作成」をクリック
3. 以下を入力：
   - タイトル: "テスト プレイリスト"
   - 説明: "テスト用です"
4. 「作成」をクリック
✓ プレイリストが作成される
✓ プレイリスト詳細ページにリダイレクト
```

#### テスト2: 曲を追加（外部URL）
```
1. 「+ 曲を追加」をクリック
2. YouTube URL を入力：
   https://www.youtube.com/watch?v=...
3. 「追加」をクリック
✓ タイトル、アーティスト、サムネイルが自動表示
✓ 曲がプレイリストに追加
✓ 「🎬 動画」バッジが表示
```

#### テスト3: 別の曲を追加（SoundCloud）
```
1. 「+ 曲を追加」をクリック
2. SoundCloud URL を入力：
   https://soundcloud.com/...
3. 「追加」をクリック
✓ 曲が追加される
✓ 「🎵 音源」バッジが表示
```

#### テスト4: 曲を削除
```
1. 曲の右側「削除」ボタンをクリック
2. 確認ダイアログで「OK」をクリック
✓ 曲がプレイリストから削除
```

#### テスト5: プレイリストを削除
```
1. プレイリスト一覧ページに戻る
2. 削除したいプレイリストの「削除」をクリック
3. 確認ダイアログで「OK」をクリック
✓ プレイリストが削除
```

---

## 🌍 ステップ4: 本番環境へデプロイ

### 方法1: Vercel 自動デプロイ（推奨）

```bash
# 1. ローカルで全テスト完了後
git add .
git commit -m "feat: Add playlist feature"
git push origin main

# 2. Vercel が自動的にデプロイ
# ダッシュボードで確認: https://vercel.com
```

### 方法2: Vercel CLI

```bash
# 1. Vercel CLI がインストール済みか確認
vercel --version

# 2. デプロイ
vercel deploy --prod

# 3. デプロイ完了メッセージを確認
```

### Supabase 本番環境設定

1. Supabase ダッシュボード → 本番環境プロジェクト
2. SQL エディタで同じマイグレーションを実行
3. RLS ポリシーが正しく設定されているか確認

---

## ✅ デプロイ後の確認

### チェックリスト

```
□ Vercel でデプロイ完了
□ https://revosong-charts.vercel.app でアクセス可能
□ ログインできる
□ プレイリスト一覧ページ表示
□ プレイリスト作成可能
□ URL追加可能
□ 曲削除可能
□ Supabase RLS で権限制御動作
□ ブラウザコンソールにエラーなし
```

### 動作確認テスト

#### テスト項目1: 認証
```bash
# 未ログインでプレイリストアクセス
❌ ランキングページにリダイレクト

# ログイン後
✅ プレイリストページ表示
```

#### テスト項目2: プレイリスト CRUD
```bash
# 作成
✅ POST /api/playlists → 201 Created

# 読み取り
✅ GET /api/playlists → 200 OK

# 更新
✅ PATCH /api/playlists/{id} → 200 OK

# 削除
✅ DELETE /api/playlists/{id} → 200 OK
```

#### テスト項目3: 権限制御
```bash
# 他人のプライベートプレイリスト閲覧
❌ 403 Forbidden

# 自分のプレイリスト閲覧
✅ 200 OK

# 他人のプレイリスト編集
❌ 403 Forbidden
```

#### テスト項目4: 複数サービス
```
✅ YouTube 追加
✅ Spotify 追加
✅ SoundCloud 追加
✅ ニコニコ動画 追加
✅ Bandcamp 追加
✅ Audiomack 追加
```

---

## 🔍 ログとモニタリング

### Vercel ログ確認

```bash
# ローカルでビルド確認
npm run build

# エラーがないか確認
```

### Supabase ログ確認

1. Supabase ダッシュボード
2. 「API」→「SQL」
3. エラーログを確認

### ブラウザコンソール

F12 キーで開発者ツール → コンソール
エラーメッセージを確認

---

## 🆘 トラブルシューティング

### エラー: "Playlists table does not exist"

**原因:** マイグレーション実行されていない

**解決:**
```
1. Supabase SQL エディタで確認
2. add_playlists_tables.sql を実行
```

### エラー: "User does not have permission"

**原因:** RLS ポリシーが正しく設定されていない

**解決:**
```
1. Supabase ダッシュボード → テーブル → RLS を確認
2. ポリシーが有効になっているか確認
3. 必要に応じて重新実行
```

### エラー: "No policy found"

**原因:** RLS ポリシーが削除されている

**解決:**
```
1. add_playlists_tables.sql を再実行
2. ポリシーが作成される
```

### YouTube URL が追加できない

**原因:** URL形式が違う

**解決:**
```
正しい形式：
✅ https://www.youtube.com/watch?v=...
✅ https://youtu.be/...

正しくない形式：
❌ https://youtube.com/... (www なし)
❌ https://youtube.com/results?search_query=...
```

### メタデータが取得できない

**原因:** サービス側の仕様変更またはネットワーク遅延

**解決:**
```
1. しばらく待つ
2. URL を確認
3. 別のサービスで試す
```

---

## 📊 本番運用チェックリスト

### 日次
```
□ ユーザーからのエラー報告なし
□ サーバーログにエラーなし
□ プレイリスト作成できる
```

### 週次
```
□ Vercel ダッシュボード確認
□ Supabase ストレージ使用量確認
□ ユーザー数確認
```

### 月次
```
□ パフォーマンス分析
□ セキュリティ更新確認
□ ドキュメント更新
```

---

## 🚀 次のステップ

### Phase 2 実装予定

```
1. ドラッグ&ドロップ並び替え
   - コンポーネント: PlaylistItemCard
   - ライブラリ: react-beautiful-dnd

2. プレイリスト内再生機能
   - コンポーネント: PlaylistPlayer
   - 機能: 次曲・前曲・再生中表示

3. 公開プレイリスト機能
   - ページ: /playlists/public
   - 機能: プレイリストランキング

4. プレイリスト共有機能
   - 機能: 公開リンク生成・共有
```

---

## 📞 サポート

### 問題発生時

1. **ドキュメント確認**
   - `REVOSONG_PLAYLIST_SPEC.md` - 技術詳細
   - `REVOSONG_PLAYLIST_GUIDE.md` - 使い方

2. **ログ確認**
   - Vercel ダッシュボード
   - Supabase SQL ログ
   - ブラウザコンソール

3. **GitHub Issues**
   - バグ報告
   - 機能リクエスト

4. **運営チーム**
   - 緊急時の連絡

---

## 📚 参考資料

### 公式ドキュメント
- [Next.js API Routes](https://nextjs.org/docs/api-routes)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

### REVOSONG ドキュメント
- `REVOSONG_OVERVIEW.md` - プロジェクト概要
- `REVOSONG_PLAYLIST_GUIDE.md` - ユーザーガイド
- `REVOSONG_PLAYLIST_SPEC.md` - 技術仕様書
- `REVOSONG_SETUP_GUIDE.md` - このファイル

---

## 📝 ログ記録

### デプロイ履歴

| 日付 | 環境 | ステータス | 備考 |
|------|------|----------|------|
| 2026-05-24 | ローカル | ✅ 完成 | Phase 1-2 完了 |
| - | Staging | ⏳ 予定 | テスト環境 |
| - | Production | ⏳ 予定 | 本番環境 |

---

**作成日:** 2026-05-24
**バージョン:** 1.0
**最終更新:** 2026-05-24

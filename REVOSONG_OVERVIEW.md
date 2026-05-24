# REVOSONG プレイリスト機能 - プロジェクト概要書

## 📱 REVOSONG とは

**REVOSONG** - AIで生成された音楽とオリジナル音楽をランキング形式で紹介する音楽プラットフォーム

**URL:** https://revosong-charts.vercel.app

---

## 🎵 プレイリスト機能の紹介

### 新機能の概要

ユーザーが **自分だけの音楽リスト（プレイリスト）** を作成・管理できる機能を追加しました。

### 何が新しい？

| 項目 | 説明 |
|------|------|
| **個人化** | REVOSONGのランキングから好きな曲を保存できる |
| **統合** | YouTube、Spotify など外部サービスの曲も混ぜられる |
| **柔軟性** | プレイリストを作成、編集、削除できる |
| **使いやすさ | 直感的なUI で簡単に曲を追加・削除 |

---

## ✨ 主な機能

### 1. プレイリスト管理
```
✅ 新規作成
✅ 名前・説明の設定
✅ プライベート/公開の設定
✅ サムネイル設定
✅ 削除
```

### 2. 曲の管理
```
✅ REVOSONGの曲を追加
✅ 外部URL（YouTube など）を追加
✅ 曲の順序変更
✅ 曲の削除
✅ 音源/動画の分類
```

### 3. 対応サービス
```
✅ YouTube
✅ Spotify
✅ SoundCloud
✅ ニコニコ動画
✅ Bandcamp
✅ Audiomack
```

---

## 🚀 利用開始方法

### ステップ1: Supabaseでマイグレーション実行

Supabase ダッシュボード → SQL エディタ で以下を実行：

**1つ目：**
```
ファイル: /migrations/add_playlists_tables.sql
内容をコピーして実行
```

**2つ目：**
```
ファイル: /migrations/add_music_type_to_tracks.sql
内容をコピーして実行
```

### ステップ2: 利用開始

1. REVOSONGでログイン
2. 「プレイリスト」をクリック
3. 「+ 新しいプレイリストを作成」
4. プレイリストに曲を追加

---

## 📂 ファイル構成

```
/app/
  ├── api/
  │   ├── playlists/                    # プレイリストAPI
  │   │   ├── route.ts                  # GET, POST
  │   │   ├── [id]/
  │   │   │   ├── route.ts              # GET, PATCH, DELETE
  │   │   │   └── items/
  │   │   │       ├── route.ts          # POST (add item)
  │   │   │       ├── reorder/
  │   │   │       │   └── route.ts      # PATCH (reorder)
  │   │   │       └── [itemId]/
  │   │   │           └── route.ts      # PATCH, DELETE
  │   ├── extract-metadata/
  │   │   └── route.ts                  # POST (metadata extraction)
  │
  ├── playlists/                        # プレイリストページ
  │   ├── page.tsx                      # 一覧ページ
  │   └── [id]/
  │       └── page.tsx                  # 詳細ページ
  │
  ├── components/                       # 共有コンポーネント
  │   ├── EmbedPlayer.tsx               # 動画/音声プレイヤー (coming soon)
  │   ├── PlaylistForm.tsx              # プレイリスト作成フォーム (coming soon)
  │   └── ...
  │
  └── page.tsx                          # ランキング（既存）

/lib/
  ├── supabase.ts                       # Supabase初期化
  ├── playlist-utils.ts                 # ユーティリティ関数
  └── comment-filter.ts                 # コメントフィルタ（既存）

/migrations/
  ├── add_playlists_tables.sql          # プレイリスト関連テーブル作成
  └── add_music_type_to_tracks.sql      # 音源/動画分類追加

📄 ドキュメント
  ├── REVOSONG_OVERVIEW.md              # このファイル
  ├── REVOSONG_PLAYLIST_GUIDE.md        # ユーザーガイド
  └── REVOSONG_PLAYLIST_SPEC.md         # 技術仕様書
```

---

## 🗄️ データベース構成

### テーブル

```
playlists
├── id (PK)
├── user_id (FK: auth.users)
├── title
├── description
├── cover_image_url
├── is_public
├── play_count
├── created_at
└── updated_at

playlist_items
├── id (PK)
├── playlist_id (FK: playlists)
├── track_id (FK: tracks) - nullable
├── external_url - nullable
├── external_title
├── external_artist
├── external_thumbnail_url
├── external_service
├── music_type (audio/video)
├── order_index
└── added_at

playlist_stats (optional)
├── id (PK)
├── playlist_item_id (FK: playlist_items)
├── played_count
├── likes_count
└── last_played_at
```

### セキュリティ

- **RLS（Row Level Security）** で自動権限制御
- ユーザーは自分のプレイリストのみ修正可能
- 他人のプライベートプレイリストは見不可

---

## 🔌 API エンドポイント

### ベース URL
```
https://revosong-charts.vercel.app/api
```

### プレイリスト関連

| メソッド | エンドポイント | 説明 |
|---------|----------------|------|
| `GET` | `/playlists` | プレイリスト一覧取得 |
| `POST` | `/playlists` | プレイリスト作成 |
| `GET` | `/playlists/{id}` | プレイリスト詳細取得 |
| `PATCH` | `/playlists/{id}` | プレイリスト更新 |
| `DELETE` | `/playlists/{id}` | プレイリスト削除 |

### アイテム関連

| メソッド | エンドポイント | 説明 |
|---------|----------------|------|
| `POST` | `/playlists/{id}/items` | アイテム追加 |
| `PATCH` | `/playlists/{id}/items/reorder` | 並び替え |
| `PATCH` | `/playlists/{id}/items/{itemId}` | アイテム更新 |
| `DELETE` | `/playlists/{id}/items/{itemId}` | アイテム削除 |

### メタデータ

| メソッド | エンドポイント | 説明 |
|---------|----------------|------|
| `POST` | `/extract-metadata` | URL からメタデータ抽出 |

詳細は `REVOSONG_PLAYLIST_SPEC.md` を参照

---

## 📖 ドキュメント一覧

### 1. REVOSONG_PLAYLIST_GUIDE.md
**対象:** エンドユーザー

内容：
- プレイリストとは何か
- 使い方（ステップバイステップ）
- 対応サービス一覧
- よくある質問（FAQ）

### 2. REVOSONG_PLAYLIST_SPEC.md
**対象:** 開発者

内容：
- 技術仕様書
- API仕様（詳細）
- データベーススキーマ
- セキュリティ設計
- 実装ガイドライン

### 3. REVOSONG_OVERVIEW.md
**対象:** 全員

内容：
- プロジェクト概要（このファイル）
- ファイル構成
- クイックスタート

---

## 🎯 実装状況

### ✅ 完了（Phase 1 & 2）

- ✅ データベーススキーマ設計
- ✅ API エンドポイント実装
- ✅ プレイリスト CRUD 操作
- ✅ 曲の追加・削除・並び替え
- ✅ ユーザー認証・認可
- ✅ 外部URL メタデータ抽出
- ✅ プレイリスト管理ページ UI
- ✅ ユーティリティ関数

### 🚧 実装予定（Phase 3 & 4）

- ⏳ ドラッグ&ドロップ UI
- ⏳ プレイリスト内再生機能
- ⏳ 公開プレイリスト表示
- ⏳ プレイリスト共有機能
- ⏳ ランキングページ音源/動画フィルタ

### 🔮 将来予定（Phase 5+）

- 🔮 プレイリスト推奨機能
- 🔮 コラボレーション編集
- 🔮 プレイリストのリミックス

---

## 🚀 本番環境デプロイ方法

### 自動デプロイ（推奨）

1. ローカルで開発・テスト
2. Git に変更をコミット
3. GitHub にプッシュ
4. Vercel が自動デプロイ

```bash
git add .
git commit -m "feat: Add playlist feature"
git push origin main
```

### 手動デプロイ

```bash
# Vercel CLI でデプロイ
vercel deploy --prod
```

---

## 🛠️ トラブルシューティング

### よくある問題と解決策

**Q: プレイリストが作成できない**
- A: Supabase でログインしているか確認
- A: マイグレーション実行済みか確認

**Q: YouTube URL が追加できない**
- A: 正しい URL か確認（youtube.com または youtu.be）
- A: ネットワーク接続を確認

**Q: 他人のプレイリストが見える**
- A: 公開プレイリストなら見える仕様
- A: 非公開の場合は見えないはず（RLS で保護）

---

## 📞 問い合わせ

### バグ報告
GitHub Issues で報告

### 機能リクエスト
GitHub Discussions で提案

### その他
運営までご連絡

---

## 📄 ライセンス

REVOSONG © 2026

---

## 📋 チェックリスト - デプロイ前

```
□ Supabase マイグレーション実行済み
□ ローカルでテスト完了
□ API 動作確認済み
□ UI 動作確認済み
□ エラーハンドリング確認済み
□ ドキュメント最新版
□ Git コミット完了
```

---

## 🎓 学習リソース

### Next.js
- 公式ドキュメント: https://nextjs.org/docs
- API Routes: https://nextjs.org/docs/api-routes

### Supabase
- 公式ドキュメント: https://supabase.com/docs
- Row Level Security: https://supabase.com/docs/guides/auth/row-level-security

### PostgreSQL
- 公式ドキュメント: https://www.postgresql.org/docs/

---

**作成日:** 2026-05-24
**最終更新:** 2026-05-24
**バージョン:** 1.0
**ステータス:** 本番環境デプロイ準備完了

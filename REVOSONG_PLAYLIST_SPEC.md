# REVOSONG プレイリスト機能 技術仕様書

## 目次
1. [概要](#概要)
2. [アーキテクチャ](#アーキテクチャ)
3. [データベース設計](#データベース設計)
4. [API仕様](#api仕様)
5. [フロントエンド](#フロントエンド)
6. [セキュリティ](#セキュリティ)
7. [実装ガイドライン](#実装ガイドライン)

---

## 概要

### プロジェクト概要
REVOSONG に個人用プレイリスト機能を追加するプロジェクト

### 目的
- ユーザーが自分の音楽リストを作成・管理できるようにする
- REVOSONGランキングの曲と外部サービスの曲を混在させられるようにする
- ユーザーの個人化された体験を提供する

### スコープ
- ✅ プレイリスト CRUD 操作
- ✅ 曲の追加・削除・並び替え
- ✅ 外部URL（YouTube、Spotify など）サポート
- ✅ ユーザー認証・認可
- ⏳ リアルタイム再生機能（Phase 2以降）
- ⏳ 公開プレイリスト機能（Phase 2以降）

---

## アーキテクチャ

### システム構成図

```
┌─────────────────────┐
│   Next.js フロント   │
│  (/app/playlists)   │
└──────────┬──────────┘
           │
           ↓
┌─────────────────────┐
│   API レイヤー      │
│  (/app/api/...)     │
└──────────┬──────────┘
           │
           ↓
┌─────────────────────┐
│   Supabase          │
│  (PostgreSQL + RLS) │
└─────────────────────┘
           │
           ↓
┌─────────────────────┐
│  外部サービス        │
│  YouTube、Spotify等 │
└─────────────────────┘
```

### 技術スタック

| 層 | 技術 |
|-----|------|
| **フロントエンド** | Next.js 16.2.6, React 19, TypeScript |
| **バックエンド** | Next.js API Routes |
| **データベース** | Supabase (PostgreSQL) |
| **認証** | Supabase Auth |
| **セキュリティ** | Row Level Security (RLS) |

---

## データベース設計

### テーブル構成

#### 1. playlists テーブル

```sql
CREATE TABLE playlists (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL (1-255文字),
  description TEXT (0-1000文字),
  cover_image_url TEXT,
  is_public BOOLEAN DEFAULT false,
  play_count BIGINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**主な特徴：**
- user_id で所有者を特定
- is_public で公開/非公開を管理
- play_count でプレイリストの人気度を追跡

#### 2. playlist_items テーブル

```sql
CREATE TABLE playlist_items (
  id BIGSERIAL PRIMARY KEY,
  playlist_id BIGINT NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
  track_id BIGINT REFERENCES tracks(id) ON DELETE CASCADE,
  external_url TEXT,
  external_title TEXT,
  external_artist TEXT,
  external_thumbnail_url TEXT,
  external_service TEXT,
  music_type VARCHAR(20) CHECK (music_type IN ('audio', 'video')),
  order_index BIGINT NOT NULL,
  added_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT one_of_track_or_url CHECK (
    (track_id IS NOT NULL AND external_url IS NULL) OR
    (track_id IS NULL AND external_url IS NOT NULL)
  )
);
```

**主な特徴：**
- ハイブリッドモデル：track_id（DB内の曲）と external_url（外部URL）のどちらか一方
- order_index で曲の順序を管理
- music_type で音源/動画を分類
- external_service で対応サービスを記録（YouTube、Spotify など）

#### 3. playlist_stats テーブル（オプション）

```sql
CREATE TABLE playlist_stats (
  id BIGSERIAL PRIMARY KEY,
  playlist_item_id BIGINT NOT NULL REFERENCES playlist_items(id) ON DELETE CASCADE,
  played_count BIGINT DEFAULT 0,
  likes_count BIGINT DEFAULT 0,
  last_played_at TIMESTAMP,
  UNIQUE(playlist_item_id)
);
```

**用途：** アナリティクス、プレイリスト内の曲の人気度追跡

### インデックス

```sql
-- プレイリスト検索用
CREATE INDEX idx_playlists_user_id ON playlists(user_id);
CREATE INDEX idx_playlists_created_at ON playlists(created_at DESC);
CREATE INDEX idx_playlists_is_public ON playlists(is_public) WHERE is_public = true;

-- プレイリストアイテム検索・ソート用
CREATE INDEX idx_playlist_items_playlist_id ON playlist_items(playlist_id);
CREATE INDEX idx_playlist_items_order ON playlist_items(playlist_id, order_index);
CREATE INDEX idx_playlist_items_music_type ON playlist_items(music_type);
```

### Row Level Security (RLS) ポリシー

#### playlists テーブル
```
SELECT: (auth.uid() = user_id) OR (is_public = true)
INSERT: auth.uid() = user_id
UPDATE: auth.uid() = user_id
DELETE: auth.uid() = user_id
```

#### playlist_items テーブル
```
SELECT: playlist が public OR auth.uid() = playlist.user_id
INSERT: auth.uid() = playlist.user_id
UPDATE: auth.uid() = playlist.user_id
DELETE: auth.uid() = playlist.user_id
```

---

## API仕様

### ベース URL
```
https://revosong-charts.vercel.app/api
```

### 認証
すべてのエンドポイントは Bearer トークン認証を使用：

```
Authorization: Bearer {supabase_access_token}
```

### レスポンスフォーマット

**成功時 (200, 201):**
```json
{
  "id": 1,
  "title": "My Playlist",
  "user_id": "uuid",
  ...
}
```

**エラー時 (400, 403, 500):**
```json
{
  "error": "エラーメッセージ"
}
```

---

### エンドポイント一覧

#### 1. GET /playlists
**説明:** ユーザーのプレイリスト一覧取得

**クエリパラメータ:**
```
limit=20        # 1ページあたりの件数（最大100）
offset=0        # オフセット
sort=updated_at # ソート順（created_at, updated_at, title, play_count）
```

**レスポンス:**
```json
{
  "playlists": [
    {
      "id": 1,
      "user_id": "uuid",
      "title": "My Playlist",
      "description": "説明",
      "cover_image_url": null,
      "is_public": false,
      "play_count": 0,
      "created_at": "2026-05-24T...",
      "updated_at": "2026-05-24T..."
    }
  ],
  "total": 10,
  "limit": 20,
  "offset": 0
}
```

---

#### 2. POST /playlists
**説明:** 新しいプレイリスト作成

**リクエスト:**
```json
{
  "title": "New Playlist",
  "description": "説明（オプション）",
  "is_public": false
}
```

**バリデーション:**
- title: 必須、1-255文字
- description: 0-1000文字
- is_public: boolean

**レスポンス:** (201 Created)
```json
{
  "id": 1,
  "user_id": "uuid",
  "title": "New Playlist",
  ...
}
```

---

#### 3. GET /playlists/{id}
**説明:** プレイリスト詳細と全アイテム取得

**認可:**
- 非公開: 所有者のみ
- 公開: 誰でも

**レスポンス:**
```json
{
  "playlist": {
    "id": 1,
    "user_id": "uuid",
    "title": "My Playlist",
    ...
  },
  "items": [
    {
      "id": 1,
      "playlist_id": 1,
      "track_id": null,
      "external_url": "https://youtube.com/...",
      "external_title": "Song Title",
      "external_artist": "Artist Name",
      "external_thumbnail_url": "https://...",
      "external_service": "youtube",
      "music_type": "video",
      "order_index": 0,
      "title": "Song Title",
      "artist": "Artist Name",
      "thumbnail_url": "https://...",
      "url": "https://youtube.com/..."
    }
  ]
}
```

---

#### 4. PATCH /playlists/{id}
**説明:** プレイリストメタデータ更新

**リクエスト:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "cover_image_url": "https://...",
  "is_public": true
}
```

**認可:** 所有者のみ

**レスポンス:** (200)
更新されたプレイリストオブジェクト

---

#### 5. DELETE /playlists/{id}
**説明:** プレイリスト削除（カスケード削除）

**認可:** 所有者のみ

**レスポンス:** (200)
```json
{
  "success": true
}
```

---

#### 6. POST /playlists/{id}/items
**説明:** プレイリストにアイテム追加

**リクエスト（外部URL）:**
```json
{
  "external_url": "https://youtube.com/watch?v=...",
  "external_service": "youtube",
  "external_title": "Video Title",
  "external_artist": "Channel Name",
  "external_thumbnail_url": "https://...",
  "music_type": "video"
}
```

**リクエスト（DB内の曲）:**
```json
{
  "track_id": 123,
  "music_type": "audio"
}
```

**バリデーション:**
- track_id と external_url のいずれか一方は必須
- external_url の場合、external_service は必須
- music_type: "audio" または "video"

**レスポンス:** (201 Created)
```json
{
  "id": 1,
  "playlist_id": 1,
  "track_id": null,
  "external_url": "https://...",
  ...
}
```

**エラーケース:**
- 重複アイテム: 400 Bad Request
- プレイリストが見つからない: 403 Forbidden

---

#### 7. PATCH /playlists/{id}/items/reorder
**説明:** プレイリストアイテムの順序変更

**リクエスト:**
```json
{
  "items": [
    { "id": 1, "order_index": 2 },
    { "id": 2, "order_index": 0 },
    { "id": 3, "order_index": 1 }
  ]
}
```

**バリデーション:**
- items 配列は必須
- 各 item に id と order_index（>=0）が必須

**レスポンス:** (200)
```json
{
  "items": [
    { "id": 2, "order_index": 0, ... },
    { "id": 3, "order_index": 1, ... },
    { "id": 1, "order_index": 2, ... }
  ]
}
```

---

#### 8. PATCH /playlists/{id}/items/{itemId}
**説明:** アイテムメタデータ更新

**リクエスト:**
```json
{
  "external_title": "New Title",
  "external_artist": "New Artist",
  "music_type": "audio"
}
```

**認可:** プレイリスト所有者のみ

**レスポンス:** (200)
更新されたアイテムオブジェクト

---

#### 9. DELETE /playlists/{id}/items/{itemId}
**説明:** プレイリストからアイテム削除

**認可:** プレイリスト所有者のみ

**レスポンス:** (200)
```json
{
  "success": true
}
```

---

#### 10. POST /extract-metadata
**説明:** 外部URLからメタデータ抽出

**リクエスト:**
```json
{
  "url": "https://youtube.com/watch?v=..."
}
```

**バリデーション:**
- url は有効なURL形式
- 対応サービスに限定（YouTube、Spotify など）

**レスポンス:** (200)
```json
{
  "service": "youtube",
  "title": "Video Title",
  "artist": "Channel Name",
  "thumbnail_url": "https://img.youtube.com/vi/.../hqdefault.jpg",
  "duration": "3:45"
}
```

**対応サービス:**

| サービス | パターン | 方法 |
|---------|---------|------|
| YouTube | youtube.com, youtu.be | oEmbed API |
| Spotify | spotify.com | URI パース |
| SoundCloud | soundcloud.com | oEmbed API |
| Niconico | nicovideo.jp, nico.ms | パース + API |
| Bandcamp | bandcamp.com | URL パース |
| Audiomack | audiomack.com | URL パース |

---

## フロントエンド

### ページ構成

#### 1. /playlists
**説明:** プレイリスト一覧ページ

**機能:**
- プレイリスト一覧をグリッド表示
- 新規作成フォーム
- 削除機能
- アイテム数表示

**使用コンポーネント:**
- PlaylistForm（モーダル）

#### 2. /playlists/[id]
**説明:** プレイリスト詳細ページ

**機能:**
- プレイリスト情報表示
- アイテムリスト表示（テーブル形式）
- アイテム追加フォーム
- アイテム削除
- ドラッグ&ドロップ（機能追加予定）

**使用コンポーネント:**
- AddPlaylistItem（モーダル）
- PlaylistItemCard

---

### ユーティリティ関数

**ファイル:** `/lib/playlist-utils.ts`

```typescript
// サービス検出
detectService(url: string): SupportedService | null

// URL パース
extractYouTubeId(url: string): string | null
extractSpotifyId(url: string): { id: string; type: string } | null
// ... etc

// 音源/動画判定
detectMusicType(service: SupportedService): MusicType

// メタデータ取得
fetchMetadataFromApi(url: string, token?: string): Promise<ExtractedMetadata>

// バリデーション
isValidUrl(url: string): boolean
isValidPlaylistUrl(url: string): boolean
isValidMusicType(value: unknown): boolean
```

---

## セキュリティ

### 認証・認可

1. **クライアント側**
   - Supabase Auth を使用
   - Bearer トークンで API リクエスト

2. **サーバー側**
   - API Route で token をパース
   - Supabase `auth.getUser(token)` で検証

3. **データベース側**
   - Row Level Security (RLS) ポリシー
   - user_id ベースのアクセス制御

### バリデーション

**入力値バリデーション:**
- 文字数チェック（title: 1-255文字）
- URL形式チェック
- Enum値チェック（music_type: audio/video）
- 一意性チェック（重複アイテム防止）

**出力バリデーション:**
- 機密情報の除外
- 公開/非公開フラグの確認

### データ保護

- パスワード: Supabase が暗号化・管理
- トークン: HTTPS で転送
- プライベートプレイリスト: RLS で保護

---

## 実装ガイドライン

### マイグレーション実行手順

1. **Supabase ダッシュボード** → SQL エディタ
2. `/migrations/add_playlists_tables.sql` をコピ&ペースト
3. 実行
4. `/migrations/add_music_type_to_tracks.sql` をコピ&ペースト
5. 実行

### テスト手順

**API テスト:**
```bash
# プレイリスト作成
curl -X POST https://revosong-charts.vercel.app/api/playlists \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Playlist"}'

# プレイリスト一覧取得
curl https://revosong-charts.vercel.app/api/playlists \
  -H "Authorization: Bearer {token}"
```

**UI テスト:**
1. `/playlists` にアクセス
2. プレイリスト作成
3. YouTube URL を追加
4. 曲を削除
5. プレイリストを削除

### デプロイ手順

1. ローカルでテスト完了
2. Git にコミット・プッシュ
3. Vercel が自動デプロイ
4. 本番環境で動作確認

---

## パフォーマンス考慮事項

### クエリ最適化
- インデックス活用（order_index、user_id など）
- N+1 クエリ回避（Promise.all で並列実行）

### キャッシング戦略
- サムネイル URL はDB に保存
- 7日ごとに再取得

### スケーラビリティ
- RLS で自動的に権限制御
- プレイリスト数に制限なし
- ページネーション対応

---

## 今後の拡張予定

### Phase 2
- ✅ ドラッグ&ドロップ並び替え
- ✅ プレイリスト内再生機能
- ✅ 公開プレイリスト機能
- ✅ プレイリスト共有機能

### Phase 3
- ✅ プレイリスト推奨機能
- ✅ コラボレーション編集
- ✅ プレイリストのリミックス機能

---

## トラブルシューティング

### よくあるエラー

| エラー | 原因 | 解決策 |
|--------|------|------|
| 401 Unauthorized | トークン無効 | ログイン し直す |
| 403 Forbidden | 権限なし | 自分のプレイリストか確認 |
| 400 Bad Request | 無効な入力 | 入力値を確認 |
| 404 Not Found | リソース無し | ID が正しいか確認 |
| 500 Server Error | サーバーエラー | サポートに報告 |

---

**最終更新:** 2026-05-24
**バージョン:** 1.0

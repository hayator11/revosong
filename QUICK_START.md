# 🚀 クイックスタートガイド - コメント機能 & SNS機能

## ⏱️ セットアップ時間：約5分

### ステップ 1️⃣: データベースセットアップ（3分）

1. **Supabase ダッシュボードを開く**
   - https://app.supabase.com にアクセス
   - プロジェクト `kxrukjykjwifawdlypfs` を選択

2. **SQL エディタを開く**
   - 左メニュー → 「SQL エディタ」
   - または直接: https://supabase.com/dashboard/project/kxrukjykjwifawdlypfs/sql/new

3. **SQL をコピー＆実行**
   ```bash
   # ローカルで以下のファイルをコピー:
   /Users/hayatoshinjo/ai-music-charts/COMPLETE_DATABASE_SETUP.sql
   ```
   
   - ファイルの内容全体を SQL エディタにコピー
   - 「実行」ボタンをクリック
   - ✅ 完了メッセージを確認

### ステップ 2️⃣: フロントエンド確認（2分）

1. **アプリケーションにアクセス**
   ```bash
   http://localhost:3000
   ```

2. **コメント機能をテスト**
   - [ ] トラック詳細を開く
   - [ ] 「💬 コメント」セクションが表示されている
   - [ ] ログインしてコメントを投稿できる

3. **SNS機能を確認**
   - [ ] 「アーティストをフォロー」セクションが表示されている
   - [ ] SNS アイコンが表示されている

---

## 📱 機能説明

### コメント機能
- **ユーザー認証：** Google OAuth / Email で認証
- **コメント投稿：** 認証済みユーザーが 1-500 文字のコメントを投稿
- **コメント表示：** 全ユーザーがコメント一覧を閲覧
- **削除機能：** 自分のコメントのみ削除可能（実装予定）

### SNS マルチプラットフォーム
対応プラットフォーム：
- **X（Twitter）** 𝕏
- **Instagram** 📷
- **Facebook** f
- **Threads** @
- **TikTok** 🎵
- **YouTube** ▶️

---

## 🛠️ トラブルシューティング

### Q: コメント機能が動作しない
**A:** 
1. SQL を実行したか確認
2. RLS ポリシーが有効になっているか確認
3. ブラウザコンソール（F12）でエラーを確認

### Q: SNS リンクがクリックできない
**A:**
1. `social_links` に正しい URL が入っているか確認
2. 形式: `https://twitter.com/username` （`twitter.com/username` は NG）

### Q: コメントが表示されない
**A:**
1. `comments_with_users` View が作成されたか確認
2. `profiles` テーブルにデータが入っているか確認

---

## 📊 テストデータ追加（オプション）

コメント機能をテストしたい場合、以下を Supabase SQL エディタで実行：

```sql
-- SNS リンクを追加（トラックID1を例に）
UPDATE public.tracks
SET social_links = jsonb_build_object(
  'x', 'https://twitter.com/example',
  'instagram', 'https://instagram.com/example',
  'youtube', 'https://youtube.com/@example'
)
WHERE id = 1;

-- ユーザー ID を確認（ログイン後のアカウント画面で確認可能）
SELECT id, email FROM auth.users LIMIT 5;

-- コメントをテスト（実際のユーザーID＆トラックIDに置き換え）
INSERT INTO public.comments (track_id, user_id, content)
VALUES (1, 'your-user-uuid', 'このトラック素晴らしい！');
```

---

## 📁 ファイル構成

```
/Users/hayatoshinjo/ai-music-charts/
├── app/
│   └── page.tsx                      # メインコンポーネント（更新済み）
├── COMPLETE_DATABASE_SETUP.sql       # 完全なセットアップSQL
├── COMMENTS_SETUP.sql                # コメント機能セットアップ
├── IMPLEMENTATION_STATUS.md          # 実装詳細ドキュメント
└── QUICK_START.md                    # このファイル
```

---

## ✨ 実装されたコード

### State 管理
```typescript
const [comments, setComments] = useState<CommentWithUserInfo[]>([]);
const [commentInput, setCommentInput] = useState("");
const [commentsLoading, setCommentsLoading] = useState(false);
```

### コメント取得
```typescript
const fetchComments = async (trackId: number) => {
  // ...コメント一覧を取得
};
```

### コメント送信
```typescript
const handleSubmitComment = async () => {
  // ...新規コメントを送信
};
```

---

## 🎯 次のステップ

- [ ] COMPLETE_DATABASE_SETUP.sql を実行
- [ ] http://localhost:3000 でテスト
- [ ] ログインしてコメントを投稿
- [ ] SNS リンクをテスト

---

## 💡 Tips

- **コメント件数表示：** 「💬 コメント (0)」の数字が自動更新される
- **ユーザー表示：** メールアドレスの @ 前の部分が表示される
- **削除機能：** 後で実装予定（RLS ポリシーは既に設定済み）

---

**Last Updated:** 2026年5月24日
**Status:** ✅ フロントエンド実装完了・SQL 実行待ち

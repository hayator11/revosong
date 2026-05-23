# 🔐 OAuth 実装セットアップガイド

**実装日：** 2026年5月24日  
**ステータス：** フロントエンド完了 ⏳ Supabase設定待ち

---

## 📋 実装完了内容

✅ **フロントエンド実装**
- X (Twitter) OAuth ログインボタン
- GitHub OAuth ログインボタン
- Discord OAuth ログインボタン
- OAuth コールバック処理
- SNS URL 自動抽出＆保存

✅ **デプロイ完了**
- Vercel に本番環境をデプロイ済み

---

## 🔧 Supabase セットアップ（朝起きたら実行）

### **ステップ 1: データベーススキーマ更新**

Supabase SQL Editor で以下を実行：

```sql
-- Profiles テーブルに GitHub, Discord URL カラムを追加
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS github_url TEXT,
ADD COLUMN IF NOT EXISTS discord_url TEXT;

-- インデックスを追加（検索パフォーマンス向上）
CREATE INDEX IF NOT EXISTS idx_profiles_github_url ON public.profiles(github_url);
CREATE INDEX IF NOT EXISTS idx_profiles_discord_url ON public.profiles(discord_url);
```

**実行手順：**
1. https://app.supabase.com を開く
2. プロジェクト kxrukjykjwifawdlypfs を選択
3. 左メニュー → **SQL Editor**
4. 上のSQLをコピペ → **RUN** をクリック

---

### **ステップ 2: X (Twitter) OAuth 設定**

#### 1️⃣ **X Developer Portal にアクセス**
```
https://developer.x.com/en/portal/dashboard
```

#### 2️⃣ **新規アプリケーション作成**
- Projects & Apps → Create New App
- 名前：「RevoSong」
- Use case：「Building a web app」

#### 3️⃣ **Authentication 設定**
- Settings → Authentication settings
- **Callback URLs に追加：**
```
https://kxrukjykjwifawdlypfs.supabase.co/auth/v1/callback
```

#### 4️⃣ **API Keys 取得**
- Keys and tokens → API Key, API Secret Key をコピー

#### 5️⃣ **Supabase に設定**
- https://app.supabase.com → Authentication → Providers
- **X** を選択
- API Key, API Secret を貼り付け
- **Enable** にチェック
- **Save**

---

### **ステップ 3: GitHub OAuth 設定**

#### 1️⃣ **GitHub Settings にアクセス**
```
https://github.com/settings/developers
```

#### 2️⃣ **新規 OAuth App 作成**
- OAuth Apps → New OAuth App
- Application name：RevoSong
- Homepage URL：`https://revosong-charts.vercel.app`
- Authorization callback URL：
```
https://kxrukjykjwifawdlypfs.supabase.co/auth/v1/callback
```

#### 3️⃣ **Client ID, Client Secret 取得**
- コピーしておく

#### 4️⃣ **Supabase に設定**
- GitHub を選択
- Client ID, Client Secret を貼り付け
- Enable して Save

---

### **ステップ 4: Discord OAuth 設定**

#### 1️⃣ **Discord Developer Portal にアクセス**
```
https://discord.com/developers/applications
```

#### 2️⃣ **新規アプリケーション作成**
- New Application
- 名前：RevoSong

#### 3️⃣ **OAuth2 設定**
- OAuth2 → General
- **Redirects に追加：**
```
https://kxrukjykjwifawdlypfs.supabase.co/auth/v1/callback
```

#### 4️⃣ **Client ID, Client Secret 取得**
- Redirects の上の部分にある
- Client ID, Client Secret をコピー

#### 5️⃣ **Supabase に設定**
- Discord を選択
- Client ID, Client Secret を貼り付け
- Enable して Save

---

## ✅ 設定完了の確認

Supabase の Authentication → Providers で以下が有効になっていることを確認：
- ✅ X
- ✅ GitHub
- ✅ Discord

---

## 🧪 テスト方法

### **ローカル（localhost:3000）**
1. ブラウザをリロード (F5)
2. ログインボタンをクリック
3. 「X でログイン」「GitHub でログイン」「Discord でログイン」 をクリック
4. OAuth ログイン完了後、プロフィール設定ページが開く
5. SNS URL が自動入力されていることを確認

### **本番環境（Vercel）**
1. https://revosong-charts.vercel.app にアクセス
2. 同じテスト手順を実行

---

## 📊 機能概要

### **ユーザーフロー**
```
1. ログインボタン クリック
2. 「X でログイン」 / 「GitHub でログイン」 / 「Discord でログイン」 をクリック
3. SNS プロバイダーで認証
4. Supabase がコードを交換してセッション作成
5. /auth/callback で SNS URL を抽出
6. profiles テーブルに自動保存
7. プロフィール設定ページにリダイレクト
8. ユーザーは手動編集も可能
```

---

## 🔒 セキュリティ

✅ **実装済み:**
- OAuth 2.0 標準準拠
- Supabase が安全にトークン管理
- RLS ポリシーで本人のみアクセス可能
- SNS URL バリデーション（ドメイン検証）

---

## 📞 FAQ

**Q: OAuth設定が複雑では？**
A: Supabaseが自動処理してくれるので、ユーザー認証のみです。API呼び出しは不要。

**Q: SNS URL が自動入力されない**
A: OAuth プロバイダー設定を確認してください。各プロバイダーのユーザー情報が正しく返されている必要があります。

**Q: 複数の SNS アカウントで登録できる？**
A: はい。手動で URL を入力できます。OAuth は複数のSNSで接続可能。

---

## 🎯 次のステップ（オプション）

### **Phase 2: SNS 検証バッジ**
```
実装予定：
- 確認済みアカウント表示（✓）
- バッジシステム
```

### **Phase 3: SNS 連携機能**
```
実装予定：
- コメント共有
- Twitter へのメンション
- クロスポスト
```

---

**Status：** 🟢 **フロントエンド完了、Supabase設定待ち**

実装者：Claude（AI）  
完成度：85%（Supabase設定後 100%）

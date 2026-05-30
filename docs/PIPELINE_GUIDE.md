# 開発パイプライン ガイド
**対象プロジェクト**: revosong / revolist-diagnosis  
**技術スタック**: Next.js + Supabase  
**最終更新**: 2026-05-30

---

## パイプライン構造

```
あなた（最終承認）
    ↑
Vercel（本番自動デプロイ）
    ↑
GitHub（mainブランチにマージ）
    ↑
あなた（画面確認＋コードのダブルチェック）
    ↑        ↑
Vercel   Claude Code
プレビュー  （PRレビュー・検証）
URL確認
    ↑
Codex（実装実行・PR作成）
    ↑
Claude Chat（設計・指示書作成）← ここで相談
    ↑
あなた（要件・方針の入力）
```

---

## 役割分担

| 役割 | ツール | やること |
|------|--------|----------|
| 要件整理・設計 | Claude Chat | タスク分解、指示書作成、設計レビュー |
| 実装実行 | Codex | コード生成、ブランチ作成、PR作成 |
| 監督・レビュー | Claude Code | PRコードの検証、バグチェック |
| プレビュー確認 | Vercel | PR時に自動プレビューURL発行、mainマージで本番デプロイ |
| 最終承認 | あなた | コードレビュー＋画面確認のダブルチェック、マージ判断 |

---

## 毎タスクの運用フロー

### Step 1：Claude Chatで相談
「○○を実装したい」→ 要件を整理 → Codex用の指示書を作成

### Step 2：Codexに指示書を投げる
ブランチ自動作成 → 実装 → PR作成

### Step 3：Claude Codeで監督
「このPRをレビューして」→ 問題点・改善点をリストアップ → 修正指示があればCodexに再投入

### Step 4：あなたがダブルチェック＆マージ
① Claude Codeのレビュー結果を確認（コード面）
② VercelのプレビューURLで画面・動作を確認（画面面）
→ 両方OKならマージ → 本番に自動デプロイ

---

## Vercelのフロー詳細

### PRを作成したとき（自動）
CodexがPR作成 → VercelがPRブランチを自動ビルド → プレビューURLが発行される → そのURLで実際の画面を確認できる

### mainにマージしたとき（自動）
あなたがマージ承認 → Vercelが本番に自動デプロイ → 数分で本番反映

### 初回確認事項
- PRブランチでプレビューURLが発行されるか
- ビルドエラーが出ていないか
- 環境変数（Supabase URLなど）がVercelに設定されているか

---

## Codex指示書テンプレート

タスク：[何を実装するか、1行で]
対象プロジェクト：revosong / revolist-diagnosis（どちらか）
対象ファイル：[変更するファイルのパス]
技術スタック：Next.js（App Router）、Supabase、TypeScript

要件：
- 要件1
- 要件2

完了条件：
- 既存機能が壊れていない
- TypeScriptエラーがない
- Supabaseの既存スキーマと整合している

注意事項：
- [既存コードで気をつけるべき点]

---

## Claude Code レビューチェックリスト

機能面：要件を満たしているか、エッジケースの処理があるか、エラーハンドリングが適切か

Next.js：App RouterのConventionに従っているか、Server/Client Componentの使い分けが適切か

Supabase：RLSポリシーと整合しているか、N+1クエリになっていないか、型定義がスキーマと一致しているか

コード品質：既存コードのスタイルと統一されているか、console.logが残っていないか

---

## ブランチ命名規則

feature/機能名（新機能）
fix/バグ内容（バグ修正）
refactor/対象（リファクタリング）
docs/内容（ドキュメント）

例：feature/music-chart-ranking、fix/diagnosis-result-display

---

## プロジェクト別メモ

### revosong（ミュージックチャート）
- リポジトリ: revosong
- ブランチ: main
- 主な機能: ミュージックチャート表示・管理

### revolist-diagnosis（レボリスト診断）
- リポジトリ: revolist-diagnosis
- ブランチ: main
- 主な機能: 診断機能

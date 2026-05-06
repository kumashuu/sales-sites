---
created: "2026-04-11"
topic: "開発環境セットアップ"
type: technical-doc
tags: [cursor, nextjs, vercel, setup]
---

# 開発環境セットアップ（Cursor + Next.js）

## 概要
HPサブスクサービスの開発環境を構築する。
Cursor（AI搭載エディタ）+ Next.js + Vercelの構成。

## 設計・方針
- Cursorを使ってAIにコードを書かせる → 学習しながら開発を進める
- Next.js App Routerを採用（最新構成）
- Tailwind CSSでスタイリング（AIとの相性が良い）
- Vercelでホスティング（Next.jsと同じ会社で相性◎）

## セットアップ手順

### Step 1: 必要なものをインストール

- [ ] **Node.js** をインストール
  - https://nodejs.org → LTS版をダウンロード
  - 確認: `node -v` でバージョンが出ればOK

- [ ] **Cursor** をインストール
  - https://cursor.sh → ダウンロード
  - VSCodeベースなので操作感は似ている

- [ ] **Git** を確認
  - `git -v` で確認。入ってなければ https://git-scm.com

### Step 2: GitHubアカウント準備

- [ ] https://github.com でアカウント作成（or確認）
- [ ] Vercelと連携するために必要

### Step 3: Next.jsプロジェクトを作成

ターミナルで以下を実行:
```bash
npx create-next-app@latest restaurant-template
```

選択肢:
```
✔ TypeScript → No（最初はJSで）
✔ ESLint → Yes
✔ Tailwind CSS → Yes
✔ src/ directory → No
✔ App Router → Yes
✔ Turbopack → No
✔ import alias → No
```

### Step 4: Vercelアカウント作成

- [ ] https://vercel.com → GitHubでログイン
- [ ] プロジェクトをVercelにデプロイ（後で）

### Step 5: Cursorの設定

- [ ] Cursorを開いてフォルダを開く
- [ ] Cmd+K または Cmd+L でAIチャットを開く
- [ ] Claude APIキーを設定（Settings → Models）

## 完了確認

```bash
cd restaurant-template
npm run dev
```
→ http://localhost:3000 が開けばOK

## 参考
- Next.js公式: https://nextjs.org/docs
- Cursor使い方: https://docs.cursor.sh
- v0.dev（コンポーネント生成）: https://v0.dev

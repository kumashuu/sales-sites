# sales-sites

営業用の複数デモサイトを **pnpm workspace + Turborepo** でまとめたモノレポです。各アプリは `data/site.json`（`SiteConfig`）を差し替えるだけで文言・連絡先・アクセント色を変更できます。

## 必要環境

- **Node.js 20.9+**（Next.js 16 の要件）
- **pnpm** 10.x（`packageManager` フィールドに固定）

## セットアップ

**Next.js 16 は Node 20.9 以上が必須**です。`node -v` が v18 などだと `pnpm dev` が失敗します。

nvm を使う場合（このディレクトリに `.nvmrc` があります）:

```bash
cd sales-sites
nvm install   # 初回のみ（.nvmrc の 20 を入れる）
nvm use       # 以降はプロジェクトで毎回
node -v       # v20.x.x であることを確認
pnpm install
```

conda の base など別の Node が先に PATH に入っている場合も、`nvm use` 後の `which node` が `~/.nvm/...` になっているか確認してください。

macOS（Apple Silicon）で Tailwind v4 のネイティブバインドが解決しない場合は、ルートに既に入っている `@tailwindcss/oxide-darwin-arm64` で解消する想定です。それでも失敗する場合は `node_modules` を削除して `pnpm install` をやり直してください。

<a id="env-vars"></a>

## 環境変数一覧

本モノレポで **参照しているのは次の 1 種類のみ**です。いずれも **ビルド時にクライアントに埋め込まれる**ため、Vercel など各デプロイ先の Project Settings → Environment Variables に設定し、**デプロイ直前のビルド**で有効化してください。未設定・未知の値のときの挙い方は各アプリの `lib/site.ts` に委ねる（`DEFAULT_SITE_KEY` にフォールバック）です。

| 変数名 | 使うアプリ | 有効な値（キー名） | 未設定 / 不明時のデフォルト | 参照データ |
|--------|------------|-------------------|----------------------------|------------|
| `NEXT_PUBLIC_SITE_KEY` | `apps/demo-restaurant-c` | `kushi` · `tokiwa-sushi-bowls` · `hungry-wombat` · `phat-mushroom` | `tokiwa-sushi-bowls` | `data/<key>.json`（`SITES` に登録必須） |
| `NEXT_PUBLIC_SITE_KEY` | `apps/demo-cafe-a` | `cafe-tokyo` · `triangle-coffee` | `cafe-tokyo` | 〃 |
| `NEXT_PUBLIC_SITE_KEY` | `apps/demo-salons` | `bonsai` · `studio-luxe` | `bonsai` | 〃 |
| `NEXT_PUBLIC_SITE_KEY` | `apps/demo-ramens` | `ganbaranba` · `tokyo-dumpling` | `ganbaranba` | 〃 |

**ルート `package.json` のショートカット**（`NEXT_PUBLIC_SITE_KEY` を付与して同アプリの dev を起動）:

| スクリプト | 付与する値 | 起動先 |
|------------|------------|--------|
| `dev:ramens-tokyo` | `tokyo-dumpling` | `demo-ramens`（Tokyo Dumpling プロファイル） |
| `dev:restaurant-phat` | `phat-mushroom` | `demo-restaurant-c`（Phat Mushroom・サイケ配色） |
| `dev:restaurant-wombat` | `hungry-wombat` | `demo-restaurant-c`（例: wakuwaku wombat テンプレ） |
| その他 | — | `dev:restaurant` 等はキー未設定。必要なら `NEXT_PUBLIC_SITE_KEY=...` を前に付ける。 |

**ローカル例**

```bash
# 飲食：KUSHI
NEXT_PUBLIC_SITE_KEY=kushi pnpm --filter @sales-sites/demo-restaurant-c dev

# ラーメン・餃子デモ：Tokyo Dumpling
NEXT_PUBLIC_SITE_KEY=tokyo-dumpling pnpm --filter @sales-sites/demo-ramens dev
# または: pnpm dev:ramens-tokyo

NEXT_PUBLIC_SITE_KEY=phat-mushroom pnpm --filter @sales-sites/demo-restaurant-c dev
# または: pnpm dev:restaurant-phat

# 飲食：hungry-wombat テンプレ
NEXT_PUBLIC_SITE_KEY=hungry-wombat pnpm --filter @sales-sites/demo-restaurant-c dev
# または: pnpm dev:restaurant-wombat
```

## 開発

```bash
# Node 20 を有効にしたうえで
pnpm dev:restaurant   # :3000
pnpm dev:cafe         # :3001
pnpm dev:ramens        # :3002（既定: GANBARANBA）
pnpm dev:ramens-tokyo  # :3002 + NEXT_PUBLIC_SITE_KEY=tokyo-dumpling
pnpm dev:salons       # :3005（美容室デモ）
pnpm dev:restaurant-phat    # :3000 + NEXT_PUBLIC_SITE_KEY=phat-mushroom
pnpm dev:restaurant-wombat  # :3000 + NEXT_PUBLIC_SITE_KEY=hungry-wombat

# すべて同時（turbo が各アプリの dev を並列起動）
pnpm dev
```

## ビルド

```bash
pnpm build
```

## 構成

| パス | 内容 |
|------|------|
| `apps/demo-restaurant-c` | 飲食デモ（`NEXT_PUBLIC_SITE_KEY`: KUSHI / UMI 寿司テンプレ / wakuwaku wombat / **Phat Mushroom** 等） |
| `apps/demo-cafe-a` | カフェ文面サンプル（emerald アクセント） |
| `apps/demo-ramens` | ラーメン／和食系デモ（GANBARANBA・**Tokyo Dumpling**。`NEXT_PUBLIC_SITE_KEY` で `data/*.json` 切替） |
| `packages/ui` | 共有ランディング `SalesSite` |
| `packages/lib` | `SiteConfig` 型・`telHref`・`buildMetadata` |
| `packages/templates/*` | 業種別 `preset.json`（新規デモのコピー元） |
| `public-assets/common` | 共有画像の保管（各アプリ `public/` にも同じファイルを配置済み） |

新しい相手向けデモは **`apps` に `demo-<名前>` をコピー**し、`data/site.json` と `public/` の画像だけ差し替えるのが最短です。

## GitHub に上げる

### パターン A: `sales-sites` だけをリポジトリのルートにする（おすすめ）

```bash
cd /path/to/sales-sites
git init
git add .
git commit -m "Initial commit: sales-sites monorepo"
# GitHub で空のリポジトリを作成してから
git remote add origin https://github.com/<あなた>/<repo>.git
git branch -M main
git push -u origin main
```

**`Permission denied (publickey)`** が出る場合: `git@github.com`（SSH）を使っているが、PC の SSH 鍵が GitHub に未登録です。**HTTPS の remote に切り替える**のが手早いです。

```bash
git remote set-url origin https://github.com/<ユーザー>/<repo>.git
git push -u origin main
```

パスワードの代わりに **Personal Access Token**（Classic なら `repo` 権限）を入力します。または `gh auth login`（GitHub CLI）でログインしてから `git push`。

### パターン B: 上位フォルダ（例: `company`）ごと push する

リポジトリ直下に `sales-sites/` がある場合も、Vercel の **Root Directory** で `sales-sites/apps/...` を指定すれば同じです。

```bash
cd /path/to/company
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/<あなた>/<repo>.git
git push -u origin main
```

## Vercel でデプロイ

各 `apps/demo-*` に **`vercel.json`** があり、モノレポの **`sales-sites` ルートで `pnpm install` → `turbo build --filter=...`** が走るようになっています。

### 手順（デモごとに URL を分けたい場合）

1. [Vercel](https://vercel.com) → **Add New Project** → GitHub のリポジトリを選ぶ  
2. **Root Directory** を **Edit** して次のいずれかにする（リポジトリの置き方に合わせる）  
   - リポジトリのルートが `sales-sites` だけなら: `apps/demo-restaurant-c`（他デモは `apps/demo-cafe-a` 等）  
   - リポジトリに `company/sales-sites/...` があるなら: `sales-sites/apps/demo-restaurant-c`  
3. Framework Preset は **Next.js** のまま（検出でよい）  
4. **Install / Build** は各フォルダの `vercel.json` が上書きするので、基本はそのまま **Deploy**

同じリポジトリから **複数プロジェクト**を作り、Root Directory だけ `demo-restaurant-c` / `demo-cafe-a` / `demo-ramens` 等と変えると、本番 URL を分けられます。

### 注意

- **Node 20**: `package.json` の `engines` と `.nvmrc` を Vercel が参照します（必要なら Vercel プロジェクトの Environment で `NODE_VERSION=20` を明示）。  
- **pnpm**: ルートの `packageManager` フィールドにより Corepack / pnpm が使われます。  
- ビルドだけローカルで確認: `pnpm exec turbo build`

## 旧 `restaurant-template` との関係

元の単一アプリ（`~/Dev/restaurant-template`）の見た目・文言は **`apps/demo-restaurant-c`** に `site.json` 化して取り込み済みです。既存の Vercel プロジェクトは、本モノレポを push したあと **Root Directory を上記 `demo-restaurant-c` に変更**すれば追従できます。

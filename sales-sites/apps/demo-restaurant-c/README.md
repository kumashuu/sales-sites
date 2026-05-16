# demo-restaurant-c

飲食店用の単一 Next アプリ。`NEXT_PUBLIC_SITE_KEY` で `data/*.json` を切り替えます。モノレポ全体の**環境変数一覧**は [ルート `README.md`](../../README.md#env-vars) を参照。

| `NEXT_PUBLIC_SITE_KEY` | ファイル | 内容 |
| ------------------------- | ----------------------------- | ---- |
| `tokiwa-sushi-bowls`（**default**） | `data/tokiwa-sushi-bowls.json` | 汎用 **寿司・ボウル** テンプレ（例: 店名 UMI）。`decorativeContactLinks` ありのプレースホルダ。画像 `public/tokiwa/` |
| `kushi` | `data/kushi.json` | Palm Cove KUSHI 向け。画像 `public/kushi/` |
| `hungry-wombat` | `data/hungry-wombat.json` | 天丼・うどん系の販促プレースホルダ（wakuwaku wombat）。画像 `public/hungry-wombat/` |
| `phat-mushroom` | `data/phat-mushroom.json` | **Phat Mushroom** — ダーク＋マゼンタ／シアンのサイケ配色テンプレ。画像 `public/phat-mushroom/` |

フルブリードのヒーロー背景を **自動スライド**にしたい場合は、`hero.backgroundSlides` に画像を **2枚以上** 指定（任意で `backgroundSlideIntervalMs`）。**1枚以下・未指定**のときは従来どおり `backgroundImage` のみ表示。現状 Phat Mushroom（`phat-mushroom`）で利用。

ヘッダー左にロゴを出すには `nav.logoSrc`（`/public` からのパス）と任意の `nav.logoAlt` を指定。

## ローカル

```bash
# Tokiwa（既定）
pnpm --filter @sales-sites/demo-restaurant-c dev

# KUSHI
NEXT_PUBLIC_SITE_KEY=kushi pnpm --filter @sales-sites/demo-restaurant-c dev

# wakuwaku wombat テンプレ
NEXT_PUBLIC_SITE_KEY=hungry-wombat pnpm --filter @sales-sites/demo-restaurant-c dev
# モノレポルートで: pnpm dev:restaurant-wombat

# Phat Mushroom（サイケパレット）
NEXT_PUBLIC_SITE_KEY=phat-mushroom pnpm --filter @sales-sites/demo-restaurant-c dev
# モノレポルートで: pnpm dev:restaurant-phat
```

既定ポートは `3000`（`package.json` の `next dev` 指定）。

新規店舗: `data/<key>.json` を追加 → `lib/site.ts` の `SITES` に登録。

## 参照する環境変数

| 変数 | 必須 | 説明 |
|------|------|------|
| `NEXT_PUBLIC_SITE_KEY` | 否 | 上表のいずれか。未設定・未知の値は `tokiwa-sushi-bowls` を使用。 |

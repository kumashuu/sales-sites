# demo-ramens

ケアンズ向けラーメン・和食デモ（**GANBARANBA** / **Tokyo Dumpling**）。`NEXT_PUBLIC_SITE_KEY` で `data/*.json` を切り替えます。モノレポ全体の**環境変数一覧**は [ルート `README.md`](../../README.md#env-vars) を参照。

| `NEXT_PUBLIC_SITE_KEY` | ファイル | 内容 |
| ---------------------- | -------- | ---- |
| `ganbaranba`（**default**） | `data/ganbaranba.json` | GANBARANBA（豚骨ラーメン、Spence St）。画像 `public/ganbaranba/` |
| `tokyo-dumpling` | `data/tokyo-dumpling.json` | Tokyo Dumpling（Lake St、公開情報ベースの営業デモ）。画像 `public/tokyo-dumpling/` |

## ローカル

```bash
# GANBARANBA（既定）
pnpm --filter @sales-sites/demo-ramens dev
# またはモノレポルート: pnpm dev:ramens

# Tokyo Dumpling
NEXT_PUBLIC_SITE_KEY=tokyo-dumpling pnpm --filter @sales-sites/demo-ramens dev
# または: pnpm dev:ramens-tokyo
```

ポート **3002**（`package.json` の `next dev`）。

新規店舗: `data/<slug>.json` を追加 → `lib/site.ts` の `SITES` と `SiteKey` に登録。

## 参照する環境変数

| 変数 | 必須 | 説明 |
|------|------|------|
| `NEXT_PUBLIC_SITE_KEY` | 否 | `ganbaranba` または `tokyo-dumpling`。未設定・未知は `ganbaranba`。 |

Vercel では東京餃子用に別プロジェクトを作る場合、同じ Root Directory で `NEXT_PUBLIC_SITE_KEY=tokyo-dumpling` を設定して再デプロイします。

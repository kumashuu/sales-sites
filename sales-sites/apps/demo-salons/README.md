# demo-salons

美容室向け 1 ページ（`SiteConfig` + `SalesSite`）。`NEXT_PUBLIC_SITE_KEY` で `data/*.json` を切り替えます。

| `NEXT_PUBLIC_SITE_KEY` | ファイル | 内容 |
| ---------------------- | -------- | ---- |
| `bonsai` (default) | `data/bonsai.json` | **Bonsai Hair Salon**（Cairns, 45 Grafton St）営業デモ ※[公開サイト](http://www.bonsaihairsalon.com.au/)の情報に基づくサンプル |
| `studio-luxe` | `data/studio-luxe.json` | 2 店舗目の切替確認用（架空ブランド） |

## ローカル

```bash
pnpm --filter @sales-sites/demo-salons dev
NEXT_PUBLIC_SITE_KEY=studio-luxe pnpm --filter @sales-sites/demo-salons dev
```

## テンプレ

- 共通 UI: `@sales-sites/ui` の `SalesSite`（`template: "beauty"` のとき価格・メニュー欄のアンカーは `#services`）。
- **Before / After**: `data/*.json` の任意キー `beforeAfter` を指定すると、専用コンポーネント `TreatmentBeforeAfter` が特徴ブロックの直後・ギャラリーの前に差し込まれます。キーごと省略可（飲食テンプレは従来どおり非表示）。
- 新規店: `data/<slug>.json` を追加 → `lib/site.ts` の `SITES` にキーを足す。

## 画像

Bonsai プロファイルは Unsplash の HTTPS URL を `hero` / `gallery` に直参照しています。自前の写真に差し替える場合は `public/<slug>/` に置き、JSON の `src` を `/slug/…` に変更してください。

# demo-restaurant-c

飲食店用の単一 Next アプリ。`NEXT_PUBLIC_SITE_KEY` で `data/*.json` を切り替えます。

| `NEXT_PUBLIC_SITE_KEY`   | ファイル                      | 内容 |
| ------------------------- | ----------------------------- | ---- |
| `tokiwa-sushi-bowls` (default) | `data/tokiwa-sushi-bowls.json` | 汎用 **寿司・ボウル** テンプレ（例: 店名 UMI、実在店と無関係）。`showMapLink: false`・`showCallButton: false`・`social.maps: ""` で地図・tel・SNS行を出さない。中身は差し替え前提 |
| `kushi`                 | `data/kushi.json`            | 既存 KUSHI（Palm Cove）向け。画像は `public/kushi/` |

## ローカル

```bash
# Tokiwa（既定）
pnpm --filter @sales-sites/demo-restaurant-c dev

# KUSHI
NEXT_PUBLIC_SITE_KEY=kushi pnpm --filter @sales-sites/demo-restaurant-c dev
```

既定ポートは `3000`（`package.json` の `next dev` 指定）。

新規店舗: `data/<key>.json` を追加 → `lib/site.ts` の `SITES` に登録。

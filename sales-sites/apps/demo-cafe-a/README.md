# demo-cafe-a

`NEXT_PUBLIC_SITE_KEY` で複数のカフェ向け `site.json` を切り替える、単一 Next.js アプリのデモ。

DM 送付前に受信店舗ごとに「ちょっとだけカスタマイズ済み」のページを出すための運用方法です。

## 現在の切替対象

| `NEXT_PUBLIC_SITE_KEY`   | 参照ファイル                  | 用途                                         |
| ------------------------ | ----------------------------- | -------------------------------------------- |
| `cafe-tokyo` (default) | `data/cafe-tokyo.json`      | CAFE TOKYO (Noosaville)                      |
| `triangle-coffee`        | `data/triangle-coffee.json` | TRIANGLE COFFEE (Freshwater / Cairns)        |

未設定 / 未知のキーは `cafe-tokyo` にフォールバックします（`lib/site.ts`）。

画像は `public/<site-key>/` に店舗ごとに配置しています。

## ローカルでの切替

```bash
pnpm --filter @sales-sites/demo-cafe-a dev                           # cafe-tokyo
NEXT_PUBLIC_SITE_KEY=triangle-coffee pnpm --filter @sales-sites/demo-cafe-a dev
```

## Vercel での切替（同一リポジトリを複数プロジェクトに）

1. Vercel 上で同じリポジトリから複数 Project を作る（例: `cafe-tokyo`, `triangle-coffee`）。
2. 各 Project の Environment Variables に `NEXT_PUBLIC_SITE_KEY` を設定。
3. Project ごとに別ドメイン（サブドメイン）を割り当てて DM で案内する。

```
cafe-tokyo.example.com       → NEXT_PUBLIC_SITE_KEY=cafe-tokyo
triangle-coffee.example.com  → NEXT_PUBLIC_SITE_KEY=triangle-coffee
```

## 新しい店舗を追加する手順

1. `data/<new-key>.json` を追加（既存ファイルをコピーして中身を書き換え）。
2. `public/<new-key>/` に画像を置く（`hero.jpg` 等、`data/<new-key>.json` で参照したパスに合わせる）。
3. `lib/site.ts` の `SiteKey` と `SITES` に新キーを追加。
4. `NEXT_PUBLIC_SITE_KEY=<new-key> pnpm --filter @sales-sites/demo-cafe-a dev` で確認。

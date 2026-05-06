---
name: research-places
description: Google Maps Places APIで取得した店舗情報を共有スプレッドシートに同期するリサーチ自動化ツールを実行する。ユーザーが「リスト更新」「ケアンズの飲食店リサーチ」「Google Maps から店舗を取ってきて」「prospects 更新」のようにリサーチリストの更新を依頼したとき、または research-places ツールに関する質問が来たときに使う。
---

# research-places Skill

Cursor Agent から `company_01/engineering/tools/research-places` の CLI を起動し、結果をリサーチ部署の Markdown と秘書の TODO に反映する。

## いつ使うか

- 「ケアンズの飲食店リスト更新して」「prospects シートに新しい店追加して」など、Google Maps 由来の店舗リスト更新を頼まれた
- 「research-places の使い方」「シード追加したい」など、本ツール自体に関する相談
- 新しい店舗発掘を含むリサーチタスクで、すでに `prospects` スプレッドシートが存在する

新規エリアを追加する場合は `src/seeds.js` の編集も伴うため、エンジニアリング部署と兼務する形で動く。

## 標準ワークフロー

```
[ ] 1. ツールフォルダに移動し、依存と .env が揃っているか確認
[ ] 2. シードグループを確定（既存 or 新規追加）
[ ] 3. --dry-run で件数を見せ、ユーザーに承認を取る
[ ] 4. --apply で実行
[ ] 5. 結果を research/topics と secretary/todos に追記
```

### Step 1: 前提チェック

```bash
cd company_01/engineering/tools/research-places
test -f .env || echo "[!] .env がありません。README の Phase 0 を案内してください"
test -d node_modules || npm install
node src/index.js seeds
```

`.env` が無い場合は実行を止めて [README.md](../../../company_01/engineering/tools/research-places/README.md) の「Phase 0: GCP セットアップ手順」を案内する。

### Step 2: シードグループ確定

- 既存グループで足りる → そのまま使う
- 新規エリア・キーワードが必要 → `src/seeds.js` を編集してから進む。編集理由は `secretary/notes/YYYY-MM-DD-decisions.md` に記録する

### Step 3: ドライラン

```bash
node src/index.js fetch --seed <group> --dry-run
```

出力の「追加 / 更新 / 変化なし / スキップ」件数をユーザーに提示し、`--apply` してよいか確認を取る。件数が想定外（0 件 / 異常に多い）なら止めて原因を探る。

### Step 4: 適用

```bash
node src/index.js fetch --seed <group> --apply
```

### Step 5: 記録

実行結果サマリを以下に追記する（[company_01/CLAUDE.md](../../../company_01/CLAUDE.md) の「同日1ファイル」「日付チェック」ルール準拠）:

1. **リサーチ進捗**: [company_01/research/topics/cairns-restaurant-prospects.md](../../../company_01/research/topics/cairns-restaurant-prospects.md) の「営業進捗」テーブルの直後に、日付付きで「自動取得: 追加 N 件 / 更新 M 件（grp=...）」を追記。
2. **秘書 TODO**: `company_01/secretary/todos/YYYY-MM-DD.md` に未完タスクとして追記:
   - `- [ ] 新規候補 N 件のメール・SNS 列を手動補完 | 優先度: 通常 | 期限: <翌週>`
3. **意思決定ログ**: シード追加・対象エリア変更を伴った場合のみ `secretary/notes/YYYY-MM-DD-decisions.md` に経緯を残す。

## 出力サマリのテンプレ

```
research-places 実行結果（{{group}}）
- 取得シード数: {{seedCount}}
- 取得（重複除去後）: {{fetchedCount}}
- 追加: {{addedCount}} / 更新: {{updatedCount}} / 変化なし: {{unchangedCount}}
- 生データ: data/runs/{{file}}
```

## 失敗時のハンドリング

| 症状 | 対処 |
|------|------|
| `Missing required env var` | README の Phase 0 を案内し、`.env` を作ってもらう |
| `Places searchText failed: 403` | API キーの制限・課金有効化を確認 |
| `Places searchText failed: 429` | レート制限。シードを `--limit` で減らして再実行 |
| `スプレッドシートのヘッダー行が想定と異なります` | スプレッドシートの 1 行目を README 記載の順序に揃える |
| `permission denied` 系（Sheets） | サービスアカウントを対象シートの編集者に招待しているか確認 |

## 重要メモ

- メール / SNS / 営業ステータス列は **CLI から触らない**（人手運用）
- `--apply` 実行後、生データ JSON が `data/runs/` に残る。料金スパイク発覚時の再現に使える
- 新シード追加は `src/seeds.js` を編集 → `node src/index.js seeds` で確認 → `--dry-run`
- 詳細仕様は [company_01/engineering/docs/research-places-tool.md](../../../company_01/engineering/docs/research-places-tool.md)

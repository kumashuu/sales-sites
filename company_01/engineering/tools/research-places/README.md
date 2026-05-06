# research-places

Google Maps Places API で店舗情報を取得し、共有スプレッドシートに重複除去しつつ追記する CLI ツール。

リサーチ部署（[../../../research/CLAUDE.md](../../../research/CLAUDE.md)）の「ケアンズ周辺・HPなし飲食店リスト」更新を自動化することが当面のゴール。

## クイックスタート

```bash
cd company_01/engineering/tools/research-places

# 初回のみ
cp .env.example .env             # API キー類を埋める
npm install

# シード一覧を確認
node src/index.js seeds
node src/index.js seeds --areas
node src/index.js seeds --categories

# まず最小セットでドライラン（API は叩く / Sheets は書かない）
node src/index.js fetch --seed cairns-japanese-min --dry-run

# 動的指定でドライラン（実行時にエリア・業種を指定）
node src/index.js fetch --area "Cairns City" --category "寿司" --dry-run

# OK ならフル実行
node src/index.js fetch --seed cairns-japanese --apply
```

## Phase 0: GCP セットアップ手順（初回 30〜60 分）

### 0-0. これから何をするのか（ざっくり全体像）

このツールは **Google Maps（Places API）** で店舗情報を取得して、**Google スプレッドシート** に書き込みます。Google のサービスを外部のプログラム（このツール）から使うには、Google 側に「使っていいですよ」という鍵を発行してもらう必要があります。これから作るのは次の 2 つの鍵です。

| 何のため | 名前 | 形式 |
|---------|------|------|
| Maps から店舗を取得するため | **API キー** | `AIza...` で始まる文字列 |
| スプレッドシートに書き込むため | **サービスアカウントの鍵 JSON** | ファイル（`gcp-sa-key.json`） |

「サービスアカウント」は **プログラム専用の Google アカウント** だと思ってください。あなた個人の Google アカウントとは別物で、メールアドレスを持っています（例: `xxx@xxx.iam.gserviceaccount.com`）。スプレッドシートには、このアドレスを「編集者」として招待することで書き込み権限を渡します。

```mermaid
flowchart LR
  start["1. GCP プロジェクト作成"] --> billing["2. 請求先（クレカ）登録"]
  billing --> apis["3. 2つのAPIを有効化"]
  apis --> apiKey["4. Maps API キー作成"]
  apiKey --> sa["5. サービスアカウント作成"]
  sa --> key["6. JSON 鍵をDL"]
  key --> share["7. スプレッドシートにSAを共有"]
  share --> envFile["8. .env を埋める"]
```

> 用語: **GCP** = Google Cloud Platform。Google が提供する開発者向けサービス全部の入れ物。

---

### Step 1: GCP プロジェクトを作る

1. https://console.cloud.google.com/ にアクセスし、自分の Google アカウントでログイン。
2. 画面上部の **プロジェクト選択ドロップダウン**（最初は「プロジェクトを選択」と表示）をクリック。
3. ダイアログ右上の **「新しいプロジェクト」** を押す。
4. プロジェクト名を入れて作成:
   - `プロジェクト名`: `research-places`（自由）
   - `組織`: なし のままで OK
   - **「作成」** をクリック
5. 数秒待つと完了通知が出るので、画面上のプロジェクト選択ドロップダウンで **作ったプロジェクトに切り替える**。これ以降の操作は全てこのプロジェクト内で行う。

> つまずきポイント: 作業中、画面上部のドロップダウンが別プロジェクトになっていることがある。設定が反映されないと感じたら **必ず作ったプロジェクトに切り替わっているか確認** する。

---

### Step 2: 請求先を登録する（クレジットカード）

Places API は無料枠を超えると課金されます。GCP は支払い方法の登録が必要です（無料枠内なら課金されません）。

1. 左メニュー（ハンバーガーアイコン）→ **「お支払い」**
2. **「請求先アカウントをリンク」** または **「請求先アカウントを作成」** に従って、クレカ情報を登録。
3. 完了すると、左メニュー > 「お支払い」で残高や請求先アカウントが見えるようになる。

> 心配なら: 後ほど Step 4 で API キーに「Places API のみ」の制限をかけ、また Step 8 後に予算アラート（例: 月 $5 で通知）を設定すれば暴発リスクは抑えられます。実運用で `cairns-japanese-min`（2 シード）の `--dry-run` から始めれば数十円〜です。

---

### Step 3: 2 つの API を有効化する

「API を有効化する」 = そのプロジェクトでそのサービスを使えるようにする、というスイッチ ON 操作です。

1. 左メニュー → **「API とサービス」** → **「ライブラリ」**
2. 検索バーに `Places API (New)` と入力。
3. ヒットした **「Places API (New)」** をクリック → **「有効にする」** を押す。
4. 戻るボタンでライブラリに戻り、もう一度検索バーに `Google Sheets API`。
5. **「Google Sheets API」** をクリック → **「有効にする」** を押す。

> 注意: `Places API` という古い名前のものもありますが、このツールは **`Places API (New)`**（新版）を使います。新版を必ず有効にしてください。

確認: 左メニュー → 「API とサービス」 → **「有効な API とサービス」** に上記 2 つが並んでいれば OK。

---

### Step 4: Maps API キーを作る

1. 左メニュー → 「API とサービス」 → **「認証情報」**（Credentials）
2. 上部の **「+ 認証情報を作成」** → **「API キー」** をクリック。
3. ダイアログに `AIza` で始まる長い文字列が表示される。これが **API キー**。**「コピー」** を押し、メモアプリに一時保存（あとで `.env` に貼る）。
4. ダイアログを閉じずに **「キーを制限」** を押し、安全のため使用先を絞る:
   - **アプリケーションの制限**: なし（または IP アドレス制限を使うなら自分の固定 IP）
   - **API の制限**: **「キーを制限」** を選び、リストから **`Places API (New)`** だけにチェック
   - **「保存」**
5. 認証情報の一覧画面で、作成した API キーが見えていれば成功。

> セキュリティ: API キーは GitHub などにコミットしないでください。`.env` に書く（`.env` は `.gitignore` 済）。

---

### Step 5: サービスアカウントを作る（Sheets 用）

1. 同じ「認証情報」画面で **「+ 認証情報を作成」** → **「サービスアカウント」** をクリック。
2. **サービスアカウントの詳細**:
   - 名前: `research-places-sa`（自由）
   - ID: 自動入力のままで OK
   - 説明: `Sheets書き込み用` など（任意）
   - **「作成して続行」**
3. **このサービス アカウントにプロジェクトへのアクセスを許可する**: **何も選ばず「続行」**。  
   ※ ロールは付けません。スプレッドシート側で個別に共有するためここは空でOK。
4. **ユーザーにこのサービス アカウントへのアクセスを許可**: 何も入れずに **「完了」**。

これで、認証情報の一覧の「サービスアカウント」セクションに `research-places-sa@<プロジェクト>.iam.gserviceaccount.com` のような **メールアドレス** が表示されます。**このアドレスを必ずコピーしてメモ**（Step 7 で使う）。

---

### Step 6: サービスアカウントの JSON 鍵をダウンロード

1. 認証情報一覧で、Step 5 で作ったサービスアカウントの **メールアドレスをクリック** して詳細画面へ。
2. 上部タブ **「キー」** をクリック。
3. **「鍵を追加」** → **「新しい鍵を作成」** をクリック。
4. キーのタイプは **JSON** を選んで **「作成」**。
5. JSON ファイルが自動でダウンロードされる（例: `research-places-xxxxx.json`）。

ダウンロードしたファイルを **このツールフォルダに `gcp-sa-key.json` という名前で配置**:

```bash
# 例: macOS のダウンロードフォルダから移動・改名する場合
mv ~/Downloads/research-places-2baf42cc6cbf.json \
   /Users/kuma/Dev/company/company_01/engineering/tools/research-places/gcp-sa-key.json
```

> セキュリティ: この JSON は **パスワードと同じ重要度**。漏えいするとスプレッドシートを書き換えられます。`.gitignore` 済なので git には乗りませんが、誤ってチャットや Slack に貼らないよう注意。

---

### Step 7: 対象スプレッドシートにサービスアカウントを「編集者」で共有

1. 書き込み先のスプレッドシートをブラウザで開く:  
   https://docs.google.com/spreadsheets/d/1lGnhhThZPXtg9ZCSUzFTUXes4M3NdN_Xth5XIpDj6Lo/edit
2. 右上の **「共有」** ボタンをクリック。
3. 「ユーザーやグループを追加」欄に **Step 5 でメモしたサービスアカウントのメールアドレス** を貼り付け。
   - 例: `research-places-sa@research-places-XXXXXX.iam.gserviceaccount.com`
4. 権限を **「編集者」** にする。
5. **「通知を送信」のチェックは外す**（送り先がプログラムなので不要）。
6. **「共有」** をクリック。

> 確認: 共有ダイアログ下部のリストに、サービスアカウントが「編集者」として表示されていれば OK。

---

### Step 8: `.env` を埋める

ターミナルで以下を実行:

```bash
cd company_01/engineering/tools/research-places
cp .env.example .env
```

エディタで `.env` を開き、3 ヶ所だけ埋める:

```bash
# Step 4 でコピーした API キー（AIza... の文字列）
GOOGLE_MAPS_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# 既定値（書き込み先スプレッドシート）。変更不要。
GOOGLE_SHEETS_SPREADSHEET_ID=1lGnhhThZPXtg9ZCSUzFTUXes4M3NdN_Xth5XIpDj6Lo

# Step 6 で配置した JSON 鍵への相対パス。変更不要。
GOOGLE_APPLICATION_CREDENTIALS=./gcp-sa-key.json
```

その他の `GOOGLE_SHEETS_TAB_NAME` / `PLACES_LANGUAGE_CODE` / `PLACES_REGION_CODE` は既定値のまま OK。

---

### Step 9: 動作確認

```bash
npm install
node src/index.js seeds
node src/index.js fetch --seed cairns-japanese-min --dry-run
```

期待される動き:
- `seeds` で「`cairns-japanese-min  (2 件)`」を含む一覧が出る
- `fetch ... --dry-run` で 2 シード分の Google Maps API 呼び出しが走り、`[merge] 追加: ... / 更新: ... / 変化なし: ... / スキップ: ...` の行が出る
- スプレッドシートに勝手なタブができていれば、サービスアカウントの権限も通っている

ここまで来たら Phase 0 完了です。次は `--dry-run` の件数を見て問題なければ `--apply` でスプレッドシートに反映します。

---

### よくあるエラーと対処

| エラーメッセージ | 主な原因 | 対処 |
|----|----|----|
| `Missing required env var: GOOGLE_MAPS_API_KEY` | `.env` 未作成、または値が空 | Step 8 を確認 |
| `Places searchText failed: 403` | API キーが無効 / Places API (New) 未有効 / 請求先未登録 | Step 2・3・4 を見直す |
| `Places searchText failed: 429` | レート制限超過 | `--limit 2` などで叩く回数を絞る |
| `[error] 動的モードでは --area と --category の両方が必要です` | `--area` だけ / `--category` だけ指定した | 両方を同時に指定する |
| `permission denied` 系（Sheets） | サービスアカウントを編集者で招待していない | Step 7 を確認 |
| `スプレッドシートのヘッダー行が想定と異なります` | 既存タブの 1 行目が手動編集されている | スプレッドシートの 1 行目を README 記載のヘッダー順に直す |
| `ENOENT: gcp-sa-key.json` | JSON 鍵がツールフォルダ直下にない | Step 6 のファイル配置を確認 |

## スプレッドシートの構成

書き込み先タブ（既定 `prospects`）の 1 行目は以下の順序を維持してください。順序が崩れると CLI が書き込みを止めます。

`place_id | エリア | 業種 | 店名 | 住所 | 電話 | メール | SNS | ウェブサイト | HP状態 | Googleマップ | 評価 | レビュー数 | 営業状況 | 初回取得日 | 最終更新日 | 営業ステータス`

タブが存在しない場合は CLI が初回実行時に作成し、ヘッダー行を書き込みます。

### 列の役割分担

| 種別 | 列 | 更新主体 |
|------|----|---------|
| API 由来（自動上書き） | 店名 / 住所 / 電話 / ウェブサイト / HP状態 / Googleマップ / 評価 / レビュー数 / 営業状況 / 最終更新日 | CLI |
| 取得時固定 | place_id / 初回取得日 | CLI（初回のみ） |
| シード由来（自動付与） | エリア / 業種 | CLI（初回のみ） |
| 人手運用 | メール / SNS / 営業ステータス | 手動入力（CLI は触らない） |

## サブコマンド

| コマンド | 用途 |
|----------|------|
| `seeds` | 利用可能なシードグループ一覧 |
| `seeds --areas` | 既定エリアカタログ一覧 |
| `seeds --categories` | 既定業種カタログ（既定キーワード付き） |
| `fetch --seed <id> --dry-run` | API は叩くが Sheets には書かない。差分件数を確認 |
| `fetch --seed <id> --apply` | Sheets に追記・更新 |
| `fetch --seed <id> --limit N` | デバッグ用にシード数を絞る |
| `fetch --area <name> --category <name> --dry-run` | 実行時指定（動的モード）で検索し、差分のみ確認 |
| `fetch --area <name> --category <name> --keyword <text> --apply` | 実行時指定 + 任意キーワードでSheetsへ反映 |
| `sync --apply` | 既存行のみ最新化（Phase 5 以降で実装） |

## 取得アーティファクト

`fetch` 実行ごとに生データを `data/runs/<timestamp>-<group>.json` に保存します（gitignore 済）。差分検証や API 障害時の再現に使います。

## コスト感

Places API (New) Text Search は概ね $32 / 1000 リクエスト（2026 時点の Pro SKU）。1 シード = 1〜3 ページなので `cairns-japanese`（約 50 シード）で 50〜150 リクエスト ≒ $1.5〜5。`--dry-run` で件数を見てから `--apply` する運用を推奨。

## 関連ドキュメント

- 設計詳細: [../../docs/research-places-tool.md](../../docs/research-places-tool.md)
- ターゲットリスト: [../../../research/topics/cairns-restaurant-prospects.md](../../../research/topics/cairns-restaurant-prospects.md)
- カテゴリ早見: [../../../research/topics/cairns-japan-related-dining.md](../../../research/topics/cairns-japan-related-dining.md)

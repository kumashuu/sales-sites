#!/usr/bin/env node
// research-places CLI
//
// 使い方:
//   node src/index.js seeds                                # 利用可能なシードグループ一覧
//   node src/index.js fetch --seed cairns-japanese-min --dry-run
//   node src/index.js fetch --seed cairns-japanese --apply
//   node src/index.js sync                                  # 既存シートの最新情報のみ更新

import fs from "node:fs";
import path from "node:path";
import { Command } from "commander";

import { RUNS_DIR } from "./config.js";
import {
  listSeedGroups,
  getSeedGroup,
  listAreaCatalog,
  listCategoryCatalog,
  buildSeedsFromInput,
} from "./seeds.js";
import { searchSeeds } from "./places.js";
import { mergeRows } from "./dedupe.js";
import { readExistingRows, appendRows, updateRows } from "./sheets.js";

const program = new Command();
program
  .name("research-places")
  .description("Google Maps Places から店舗情報を取得しスプレッドシートに同期する");

program
  .command("seeds")
  .description("利用可能なシードグループを表示")
  .option("--areas", "既定エリアカタログを表示", false)
  .option("--categories", "既定業種カタログを表示", false)
  .action((opts) => {
    if (opts.areas) {
      console.log("既定エリアカタログ:");
      for (const a of listAreaCatalog()) {
        console.log(`  - ${a.area} (anchor: ${a.anchor})`);
      }
      return;
    }
    if (opts.categories) {
      console.log("既定業種カタログ:");
      for (const c of listCategoryCatalog()) {
        console.log(`  - ${c.category} (keywords: ${c.keywords.join(", ")})`);
      }
      return;
    }
    const groups = listSeedGroups();
    console.log("利用可能なシードグループ:");
    for (const g of groups) {
      console.log(`  - ${g.id}  (${g.count} 件) : ${g.label}`);
    }
  });

function collectMulti(value, previous = []) {
  previous.push(value);
  return previous;
}

program
  .command("fetch")
  .description("シードグループを取得し、結果を保存／同期する")
  .option("--seed <group>", "シードグループID（seeds コマンドで一覧）")
  .option("--area <value>", "検索エリア（複数指定可）", collectMulti, [])
  .option("--category <value>", "業種ラベル（複数指定可）", collectMulti, [])
  .option("--keyword <value>", "検索キーワード（複数指定可）", collectMulti, [])
  .option("--limit <n>", "取得シード数の上限（デバッグ用）", (v) => parseInt(v, 10))
  .option("--dry-run", "API は叩くが、Sheets には書き込まない", false)
  .option("--apply", "Sheets に書き込む", false)
  .action(async (opts) => {
    const hasAreaOrCategory = opts.area.length > 0 || opts.category.length > 0;
    const mode = hasAreaOrCategory ? "dynamic" : "seed";
    if (!opts.dryRun && !opts.apply) {
      console.log("どちらかを指定してください: --dry-run / --apply");
      process.exitCode = 1;
      return;
    }

    let seeds;
    let runMeta = {};
    if (mode === "dynamic") {
      if (opts.area.length === 0 || opts.category.length === 0) {
        console.log("[error] 動的モードでは --area と --category の両方が必要です。");
        process.exitCode = 1;
        return;
      }
      const dynamicBuilt = buildSeedsFromInput({
        areas: opts.area,
        categories: opts.category,
        keywords: opts.keyword,
      });
      seeds = dynamicBuilt.seeds;
      runMeta = {
        mode,
        input: {
          area: opts.area,
          category: opts.category,
          keyword: opts.keyword,
        },
        warnings: dynamicBuilt.warnings,
      };
      console.log(`[fetch] mode=dynamic seeds=${seeds.length}`);
      dynamicBuilt.warnings.forEach((w) => console.log(`[warn] ${w}`));
    } else {
      if (!opts.seed) {
        console.log(
          "[error] --seed を指定するか、動的指定として --area と --category を指定してください。",
        );
        process.exitCode = 1;
        return;
      }
      const group = getSeedGroup(opts.seed);
      seeds = group.seeds;
      runMeta = { mode, seed: opts.seed, label: group.label };
      console.log(
        `[fetch] mode=seed group=${opts.seed} label="${group.label}" seeds=${seeds.length}`,
      );
    }

    if (Number.isInteger(opts.limit) && opts.limit > 0) {
      seeds = seeds.slice(0, opts.limit);
      console.log(`[fetch] limit applied: ${opts.limit} -> seeds=${seeds.length}`);
    }

    const fetched = await searchSeeds(seeds, {
      onProgress: ({ index, total, seed }) => {
        console.log(`  [${index}/${total}] ${seed.area} / ${seed.category} :: "${seed.textQuery}"`);
      },
    });
    console.log(`[fetch] 取得 (重複除去後): ${fetched.length} 件`);

    saveRunArtifact({
      groupId: mode === "dynamic" ? "dynamic" : opts.seed,
      seeds,
      fetched,
      meta: runMeta,
    });

    const existing = await safeReadExisting();
    const merge = mergeRows(existing, fetched);
    console.log(
      `[merge] 追加: ${merge.added.length} / 更新: ${merge.updated.length} / 変化なし: ${merge.unchanged} / スキップ: ${merge.skipped}`,
    );

    if (opts.dryRun) {
      console.log("[dry-run] Sheets への書き込みは行いません。");
      previewSample(merge);
      return;
    }

    await appendRows(merge.added);
    await updateRows(merge.updated);
    console.log("[apply] Sheets 更新完了。");
  });

program
  .command("sync")
  .description("既存シートにある place_id だけを Places API で再取得して更新する")
  .option("--dry-run", "Sheets には書き込まない", false)
  .option("--apply", "Sheets に書き込む", false)
  .action(async (opts) => {
    if (!opts.dryRun && !opts.apply) {
      console.log("どちらかを指定してください: --dry-run / --apply");
      process.exitCode = 1;
      return;
    }
    console.log("[sync] 既存行の最新化は将来実装予定。Phase 5 以降でサポート。");
    process.exitCode = 1;
  });

function saveRunArtifact({ groupId, seeds, fetched, meta = {} }) {
  if (!fs.existsSync(RUNS_DIR)) fs.mkdirSync(RUNS_DIR, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const file = path.join(RUNS_DIR, `${stamp}-${groupId}.json`);
  fs.writeFileSync(
    file,
    JSON.stringify(
      { groupId, meta, seedsCount: seeds.length, fetchedCount: fetched.length, fetched },
      null,
      2,
    ),
  );
  console.log(`[runs] 生データ保存: ${path.relative(process.cwd(), file)}`);
}

async function safeReadExisting() {
  try {
    return await readExistingRows();
  } catch (e) {
    console.error("[sheets] 読み込み失敗:", e.message);
    throw e;
  }
}

function previewSample({ added, updated }) {
  const sample = (rows, label) => {
    if (rows.length === 0) return;
    console.log(`\n--- ${label}（先頭3件） ---`);
    for (const r of rows.slice(0, 3)) {
      const row = Array.isArray(r) ? r : r.row;
      console.log("  " + row.slice(0, 6).join(" | "));
    }
  };
  sample(added, "追加候補");
  sample(updated, "更新候補");
}

program.parseAsync(process.argv).catch((err) => {
  console.error(`[error] ${err?.message ?? err}`);
  if (process.env.DEBUG) console.error(err);
  process.exit(1);
});

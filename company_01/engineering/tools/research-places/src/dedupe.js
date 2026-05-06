// place_id をキーに、既存シート行と新規取得行をマージする。
// - 既存にあるものは「最終更新日」「営業状況」「電話」「ウェブサイト」「HP状態」「評価」「レビュー数」のみ更新。
// - 既存に無いものは新規追加（初回取得日 = 最終更新日 = today）。
// - 「メール」「SNS」「営業ステータス」「業種」「エリア」など人手で運用する列は既存値を尊重。

import { SHEET_HEADERS } from "./config.js";
import { classifyWebsite } from "./filter.js";

const HUMAN_OWNED = new Set([
  "エリア",
  "業種",
  "メール",
  "SNS",
  "営業ステータス",
]);

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function rowToObject(row) {
  const obj = {};
  SHEET_HEADERS.forEach((h, i) => {
    obj[h] = row[i] ?? "";
  });
  return obj;
}

function objectToRow(obj) {
  return SHEET_HEADERS.map((h) => obj[h] ?? "");
}

export function buildRowFromPlace({ seed, place }) {
  const websiteUri = place.websiteUri || "";
  const phone =
    place.internationalPhoneNumber || place.nationalPhoneNumber || "";
  return {
    place_id: place.id || "",
    エリア: seed.area || "",
    業種: seed.category || "",
    店名: place.displayName?.text || "",
    住所: place.formattedAddress || "",
    電話: phone,
    メール: "",
    SNS: "",
    ウェブサイト: websiteUri,
    HP状態: classifyWebsite(websiteUri),
    Googleマップ: place.googleMapsUri || "",
    評価: place.rating ?? "",
    レビュー数: place.userRatingCount ?? "",
    営業状況: place.businessStatus || "",
    初回取得日: todayIso(),
    最終更新日: todayIso(),
    営業ステータス: "",
  };
}

// existingRows: スプレッドシートから読んだ values（ヘッダー除く 2D 配列）
// fetched: [{ seed, place }, ...]
//
// returns: { added: row[], updated: { rowIndex, row }[], unchanged: number, skipped: number }
//   rowIndex はヘッダーを 1 とする 1-based のスプレッドシート行番号。
export function mergeRows(existingRows, fetched) {
  const byPlaceId = new Map();
  existingRows.forEach((row, i) => {
    const obj = rowToObject(row);
    if (obj.place_id) byPlaceId.set(obj.place_id, { obj, rowIndex: i + 2 });
  });

  const added = [];
  const updated = [];
  let unchangedCount = 0;
  let skippedCount = 0;

  for (const item of fetched) {
    const draft = buildRowFromPlace(item);
    if (!draft.place_id) {
      skippedCount += 1;
      continue;
    }
    const existing = byPlaceId.get(draft.place_id);
    if (!existing) {
      added.push(objectToRow(draft));
      continue;
    }
    const merged = { ...existing.obj };
    let changed = false;
    for (const h of SHEET_HEADERS) {
      if (HUMAN_OWNED.has(h)) continue;
      if (h === "初回取得日") continue;
      const next = draft[h];
      if (next === "" || next == null) continue;
      if (String(merged[h] ?? "") !== String(next)) {
        merged[h] = next;
        changed = true;
      }
    }
    if (changed) {
      merged.最終更新日 = todayIso();
      updated.push({ rowIndex: existing.rowIndex, row: objectToRow(merged) });
    } else {
      unchangedCount += 1;
    }
  }

  return { added, updated, unchanged: unchangedCount, skipped: skippedCount };
}

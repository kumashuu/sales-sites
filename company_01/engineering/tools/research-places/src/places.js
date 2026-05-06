// Google Maps Places API (New) クライアント。
// https://developers.google.com/maps/documentation/places/web-service/text-search
//
// フィールドマスク必須。指定漏れで料金が跳ねるので、必要な項目だけを許可リスト化する。

import { config } from "./config.js";

const TEXT_SEARCH_URL = "https://places.googleapis.com/v1/places:searchText";

// Text Search で取得するフィールド。料金: Pro SKU を最小化するため必要最小限。
const FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.internationalPhoneNumber",
  "places.nationalPhoneNumber",
  "places.websiteUri",
  "places.googleMapsUri",
  "places.rating",
  "places.userRatingCount",
  "places.businessStatus",
  "places.primaryType",
  "places.types",
  "places.location",
].join(",");

const MAX_PAGES = 3;
const PAGE_SIZE = 20;

async function searchTextOnce({ textQuery, pageToken }) {
  const body = {
    textQuery,
    languageCode: config.languageCode(),
    regionCode: config.regionCode(),
    pageSize: PAGE_SIZE,
  };
  if (pageToken) body.pageToken = pageToken;

  const res = await fetch(TEXT_SEARCH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": config.mapsApiKey(),
      "X-Goog-FieldMask": FIELD_MASK,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Places searchText failed: ${res.status} ${text}`);
  }
  return res.json();
}

export async function searchText(textQuery, { maxPages = MAX_PAGES } = {}) {
  const places = [];
  let pageToken;
  for (let i = 0; i < maxPages; i++) {
    const data = await searchTextOnce({ textQuery, pageToken });
    if (Array.isArray(data.places)) places.push(...data.places);
    if (!data.nextPageToken) break;
    pageToken = data.nextPageToken;
    // nextPageToken は数秒後でないと有効化されないことがある
    await new Promise((r) => setTimeout(r, 2000));
  }
  return places;
}

// シード（複数の textQuery）をまとめて実行。place_id で重複を除いて返す。
export async function searchSeeds(seeds, { onProgress } = {}) {
  const seen = new Map();
  const results = [];
  let i = 0;
  for (const seed of seeds) {
    i += 1;
    onProgress?.({ index: i, total: seeds.length, seed });
    const places = await searchText(seed.textQuery);
    for (const p of places) {
      if (!p.id) continue;
      if (seen.has(p.id)) continue;
      seen.set(p.id, true);
      results.push({
        seed,
        place: p,
      });
    }
  }
  return results;
}

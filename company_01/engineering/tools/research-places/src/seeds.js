// 検索シード定義。固定グループに加え、実行時入力からの動的生成にも対応する。
// - カタログ層: 既定エリア / 業種キーワード
// - ビルダー層: areas/categories/keywords から seed を組み立て

const AREA_CATALOG = [
  { area: "Cairns City", anchor: "Cairns City QLD" },
  { area: "Palm Cove", anchor: "Palm Cove QLD" },
  { area: "Edge Hill", anchor: "Edge Hill Cairns QLD" },
  { area: "Redlynch", anchor: "Redlynch Cairns QLD" },
  { area: "Edmonton", anchor: "Edmonton Cairns QLD" },
  { area: "Earlville", anchor: "Earlville Cairns QLD" },
  { area: "Freshwater", anchor: "Freshwater Cairns QLD" },
];

const CATEGORY_KEYWORD_CATALOG = [
  { category: "和食", keywords: ["Japanese restaurant"] },
  { category: "麺", keywords: ["ramen"] },
  { category: "寿司", keywords: ["sushi"] },
  { category: "和食/居酒屋", keywords: ["izakaya"] },
  { category: "焼鳥", keywords: ["yakitori"] },
  { category: "焼肉", keywords: ["yakiniku"] },
  { category: "カフェ", keywords: ["japanese cafe"] },
];

function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function uniq(values) {
  return [...new Set(values.map((v) => String(v).trim()).filter(Boolean))];
}

function resolveAreaAnchor(area) {
  const matched = AREA_CATALOG.find((x) => x.area.toLowerCase() === area.toLowerCase());
  return matched?.anchor || area;
}

function resolveKeywordsForCategory(category) {
  const matched = CATEGORY_KEYWORD_CATALOG.find(
    (x) => x.category.toLowerCase() === category.toLowerCase(),
  );
  return matched?.keywords || [];
}

function buildCairnsSeeds() {
  const seeds = [];
  for (const a of AREA_CATALOG) {
    for (const c of CATEGORY_KEYWORD_CATALOG) {
      const keyword = c.keywords[0];
      seeds.push({
        id: `cairns-${slugify(a.area)}-${slugify(keyword)}`,
        area: a.area,
        category: c.category,
        textQuery: `${keyword} in ${a.anchor}`,
      });
    }
  }
  return seeds;
}

const SEED_GROUPS = {
  "cairns-japanese": {
    label: "ケアンズ周辺・日本食/和カフェ",
    seeds: buildCairnsSeeds(),
  },
  "cairns-japanese-min": {
    label: "ケアンズ最小セット（City × 和食/ラーメン）",
    seeds: buildCairnsSeeds().filter(
      (s) =>
        s.area === "Cairns City" && (s.category === "和食" || s.category === "麺"),
    ),
  },
};

export function listSeedGroups() {
  return Object.entries(SEED_GROUPS).map(([id, g]) => ({
    id,
    label: g.label,
    count: g.seeds.length,
  }));
}

export function getSeedGroup(groupId) {
  const g = SEED_GROUPS[groupId];
  if (!g) {
    const available = Object.keys(SEED_GROUPS).join(", ");
    throw new Error(
      `Unknown seed group: ${groupId}. 利用可能: ${available}`,
    );
  }
  return g;
}

export function listAreaCatalog() {
  return AREA_CATALOG.map((a) => ({ ...a }));
}

export function listCategoryCatalog() {
  return CATEGORY_KEYWORD_CATALOG.map((c) => ({ ...c }));
}

export function buildSeedsFromInput({ areas = [], categories = [], keywords = [] }) {
  const warnings = [];
  const normalizedAreas = uniq(areas);
  const normalizedCategories = uniq(categories);
  const inputKeywords = uniq(keywords);

  const seeds = [];
  for (const area of normalizedAreas) {
    const areaCatalogMatched = AREA_CATALOG.some(
      (x) => x.area.toLowerCase() === area.toLowerCase(),
    );
    if (!areaCatalogMatched) {
      warnings.push(`未登録エリアを利用: "${area}" (入力値をそのまま検索に使用)`); 
    }
    const anchor = resolveAreaAnchor(area);

    for (const category of normalizedCategories) {
      const defaultKeywords = resolveKeywordsForCategory(category);
      const effectiveKeywords =
        inputKeywords.length > 0
          ? inputKeywords
          : defaultKeywords.length > 0
            ? defaultKeywords
            : [category];

      if (defaultKeywords.length === 0 && inputKeywords.length === 0) {
        warnings.push(
          `未登録業種を利用: "${category}" (業種名をそのままキーワードとして検索)`,
        );
      }

      for (const keyword of effectiveKeywords) {
        seeds.push({
          id: `dynamic-${slugify(area)}-${slugify(category)}-${slugify(keyword)}`,
          area,
          category,
          textQuery: `${keyword} in ${anchor}`,
        });
      }
    }
  }
  return { seeds, warnings };
}

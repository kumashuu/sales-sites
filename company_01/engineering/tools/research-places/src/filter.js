// HP状態の自動分類。
// - なし: websiteUri が無い、または FB/IG/Yelp など SNS・第三者ディレクトリのみ
// - 薄い: weeblyte/wixsite/sites.google.com など簡易ビルダー系
// - 独自あり: 上記以外で独自ドメインがある場合
//
// 既存リスト company_01/research/topics/cairns-restaurant-prospects.md の
// 「対象外（独自HPが充実している例）」「薄いサイト」基準と整合させる。

const SNS_OR_DIRECTORY_HOSTS = [
  "facebook.com",
  "instagram.com",
  "tripadvisor.com",
  "yelp.com",
  "yelp.com.au",
  "ubereats.com",
  "doordash.com",
  "menulog.com.au",
  "agfg.com.au",
  "cairnsdining.com",
  "google.com",
  "goo.gl",
  "linktr.ee",
  "linkedin.com",
];

const THIN_BUILDER_HOSTS = [
  "weeblyte.com",
  "weebly.com",
  "wixsite.com",
  "wix.com",
  "sites.google.com",
  "godaddysites.com",
  "square.site",
  "business.site",
];

function getHost(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return null;
  }
}

export function classifyWebsite(websiteUri) {
  if (!websiteUri) return "なし";
  const host = getHost(websiteUri);
  if (!host) return "なし";
  if (SNS_OR_DIRECTORY_HOSTS.some((h) => host === h || host.endsWith(`.${h}`))) {
    return "なし";
  }
  if (THIN_BUILDER_HOSTS.some((h) => host === h || host.endsWith(`.${h}`))) {
    return "薄い";
  }
  return "独自あり";
}

// 既存スプレッドシートで「営業対象外」（独自HPが充実）かを示すヘルパー。
export function isProspect(websiteState) {
  return websiteState === "なし" || websiteState === "薄い";
}

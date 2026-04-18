import type { SiteConfig } from "./types";

/** 住所行を結合して Google マップ検索 URL を生成する */
export function googleMapsSearchUrlFromAddressLines(lines: string[]): string {
  const q = lines
    .map((s) => s.trim())
    .filter(Boolean)
    .join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

/** `address.mapHref` があればそれを使い、なければ住所行から検索 URL を作る */
export function resolveAddressMapHref(address: SiteConfig["contact"]["address"]): string {
  if (address.mapHref?.trim()) return address.mapHref.trim();
  return googleMapsSearchUrlFromAddressLines(address.lines);
}

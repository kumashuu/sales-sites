import type { SiteConfig } from "@sales-sites/lib";

import ganbaranba from "../data/ganbaranba.json";
import tokyoDumpling from "../data/tokyo-dumpling.json";

export type SiteKey = "ganbaranba" | "tokyo-dumpling";

const SITES: Record<SiteKey, SiteConfig> = {
  ganbaranba: ganbaranba as SiteConfig,
  "tokyo-dumpling": tokyoDumpling as SiteConfig,
};

export const DEFAULT_SITE_KEY: SiteKey = "ganbaranba";

/**
 * `NEXT_PUBLIC_SITE_KEY` でラーメン系デモの店舗データを切り替え。
 * 未設定 / 未知のキー → `ganbaranba`。
 *
 * 例: `NEXT_PUBLIC_SITE_KEY=tokyo-dumpling pnpm --filter @sales-sites/demo-ramens dev`
 */
export function getSite(): SiteConfig {
  const raw = process.env.NEXT_PUBLIC_SITE_KEY;
  const key: SiteKey = raw && raw in SITES ? (raw as SiteKey) : DEFAULT_SITE_KEY;
  return SITES[key];
}

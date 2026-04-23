import type { SiteConfig } from "@sales-sites/lib";

import cafeTokyo from "../data/cafe-tokyo.json";
import triangleCoffee from "../data/triangle-coffee.json";

export type SiteKey = "cafe-tokyo" | "triangle-coffee";

const SITES: Record<SiteKey, SiteConfig> = {
  "cafe-tokyo": cafeTokyo as SiteConfig,
  "triangle-coffee": triangleCoffee as SiteConfig,
};

export const DEFAULT_SITE_KEY: SiteKey = "cafe-tokyo";

/**
 * `NEXT_PUBLIC_SITE_KEY` で選択（ビルド時に埋め込まれる）。
 * 未設定 / 未知のキーは DEFAULT_SITE_KEY にフォールバック。
 *
 * 例: `NEXT_PUBLIC_SITE_KEY=triangle-coffee pnpm --filter @sales-sites/demo-cafe-a dev`
 */
export function getSite(): SiteConfig {
  const raw = process.env.NEXT_PUBLIC_SITE_KEY;
  const key: SiteKey =
    raw && raw in SITES ? (raw as SiteKey) : DEFAULT_SITE_KEY;
  return SITES[key];
}

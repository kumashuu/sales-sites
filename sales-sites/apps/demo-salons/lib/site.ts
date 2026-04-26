import type { SiteConfig } from "@sales-sites/lib";

import bonsai from "../data/bonsai.json";
import studioLuxe from "../data/studio-luxe.json";

export type SiteKey = "bonsai" | "studio-luxe";

const SITES: Record<SiteKey, SiteConfig> = {
  bonsai: bonsai as SiteConfig,
  "studio-luxe": studioLuxe as SiteConfig,
};

export const DEFAULT_SITE_KEY: SiteKey = "bonsai";

/**
 * `NEXT_PUBLIC_SITE_KEY` で `data/<key>.json` 相当のサイトを選ぶ（ビルド時埋め込み）。
 * 未設定 / 未知のキー → `bonsai`（Bonsai Hair Salon 向けデモ）
 *
 * 例: `NEXT_PUBLIC_SITE_KEY=studio-luxe pnpm --filter @sales-sites/demo-salons dev`
 */
export function getSite(): SiteConfig {
  const raw = process.env.NEXT_PUBLIC_SITE_KEY;
  const key: SiteKey = raw && raw in SITES ? (raw as SiteKey) : DEFAULT_SITE_KEY;
  return SITES[key];
}

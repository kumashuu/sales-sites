import type { SiteConfig } from "@sales-sites/lib";

import hungryWombat from "../data/hungry-wombat.json";
import kushi from "../data/kushi.json";
import tokiwaSushiBowls from "../data/tokiwa-sushi-bowls.json";

export type SiteKey = "kushi" | "tokiwa-sushi-bowls" | "hungry-wombat";

const SITES: Record<SiteKey, SiteConfig> = {
  kushi: kushi as SiteConfig,
  "tokiwa-sushi-bowls": tokiwaSushiBowls as SiteConfig,
  "hungry-wombat": hungryWombat as SiteConfig,
};

/** 未設定時: 汎用寿司・ボウル系テンプレ（店名「UMI」、リンク無効のプレースホルダ。画像は `public/tokiwa/`） */
export const DEFAULT_SITE_KEY: SiteKey = "tokiwa-sushi-bowls";

/**
 * `NEXT_PUBLIC_SITE_KEY` で切替。未設定 / 未知キー → `tokiwa-sushi-bowls`。
 *
 * 例: `NEXT_PUBLIC_SITE_KEY=kushi pnpm --filter @sales-sites/demo-restaurant-c dev`
 * 例: `NEXT_PUBLIC_SITE_KEY=hungry-wombat pnpm --filter @sales-sites/demo-restaurant-c dev`（wakuwaku wombat テンプレ：天丼・うどん系プレースホルダ）
 */
export function getSite(): SiteConfig {
  const raw = process.env.NEXT_PUBLIC_SITE_KEY;
  const key: SiteKey = raw && raw in SITES ? (raw as SiteKey) : DEFAULT_SITE_KEY;
  return SITES[key];
}

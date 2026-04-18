import { Kiwi_Maru, Noto_Sans_JP, Yuji_Boku } from "next/font/google";
import type { SiteFontPreset } from "@sales-sites/lib";

const notoSansJp = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-site-sans",
  display: "swap",
});

/** Vabi Dasabi 相当の丸み手書き風（Google Fonts: Kiwi Maru） */
const vabiDasabi = Kiwi_Maru({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-site-sans",
  display: "swap",
});

/** Hiro Misake 相当の筆文字風（Google Fonts: Yuji Boku） */
const hiroMisake = Yuji_Boku({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-site-sans",
  display: "swap",
});

const byPreset = {
  notoSansJp,
  vabiDasabi,
  hiroMisake,
} as const;

export function getSiteFont(preset: SiteFontPreset | undefined) {
  const key: SiteFontPreset =
    preset && preset in byPreset ? preset : "notoSansJp";
  return byPreset[key];
}

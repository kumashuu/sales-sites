import type { SiteConfig } from "@sales-sites/lib";

export type Accent = SiteConfig["theme"]["accent"];

export const ACCENT: Record<
  Accent,
  {
    text: string;
    bg: string;
    bgHover: string;
    borderNav: string;
    borderCard: string;
    borderMenu: string;
    textHover: string;
    radial: string;
  }
> = {
  amber: {
    text: "text-amber-400",
    bg: "bg-amber-500",
    bgHover: "hover:bg-amber-400",
    borderNav: "hover:border-amber-400",
    borderCard: "hover:border-amber-500/50",
    borderMenu: "hover:border-amber-500/40",
    textHover: "hover:text-amber-400",
    radial: "rgba(245, 158, 11, 0.15)",
  },
  emerald: {
    text: "text-emerald-400",
    bg: "bg-emerald-500",
    bgHover: "hover:bg-emerald-400",
    borderNav: "hover:border-emerald-400",
    borderCard: "hover:border-emerald-500/50",
    borderMenu: "hover:border-emerald-500/40",
    textHover: "hover:text-emerald-400",
    radial: "rgba(52, 211, 153, 0.15)",
  },
  rose: {
    text: "text-rose-400",
    bg: "bg-rose-500",
    bgHover: "hover:bg-rose-400",
    borderNav: "hover:border-rose-400",
    borderCard: "hover:border-rose-500/50",
    borderMenu: "hover:border-rose-500/40",
    textHover: "hover:text-rose-400",
    radial: "rgba(251, 113, 133, 0.15)",
  },
  yellow: {
    text: "text-[#FDFD47]",
    bg: "bg-[#FDFD47]",
    bgHover: "hover:brightness-95",
    borderNav: "hover:border-[#FDFD47]",
    borderCard: "hover:border-[#FDFD47]/50",
    borderMenu: "hover:border-[#FDFD47]/40",
    textHover: "hover:text-[#FDFD47]",
    radial: "rgba(253, 253, 71, 0.14)",
  },
};

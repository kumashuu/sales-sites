import type { SiteConfig } from "@sales-sites/lib";
import { resolveAddressMapHref } from "@sales-sites/lib";

type Accent = SiteConfig["theme"]["accent"];

const ACCENT_LINK: Record<
  Accent,
  { hover: string }
> = {
  amber: { hover: "hover:text-amber-400" },
  emerald: { hover: "hover:text-emerald-400" },
  rose: { hover: "hover:text-rose-400" },
};

export type ReservationSocialLinksProps = {
  social: SiteConfig["contact"]["social"];
  address: SiteConfig["contact"]["address"];
  palette: SiteConfig["theme"]["palette"] | undefined;
  accent: Accent;
};

/**
 * 予約カード下部: Instagram / Facebook / Location（地図）の共通行。
 * 各 URL が空ならその項目は出さない。
 */
export function ReservationSocialLinks({
  social,
  address,
  palette,
  accent,
}: ReservationSocialLinksProps) {
  const mapsHref = social.maps?.trim() || resolveAddressMapHref(address);
  const ig = social.instagram?.trim();
  const fb = social.facebook?.trim();

  const linkClass = palette
    ? palette.highlight?.trim()
      ? "text-sm text-[var(--p-sub)] transition-colors hover:text-[var(--p-highlight)]"
      : "text-sm text-[var(--p-sub)] transition-colors hover:text-[var(--p-accent)]"
    : `text-sm text-zinc-400 transition-colors ${ACCENT_LINK[accent].hover}`;

  const items: { key: string; href: string; label: string }[] = [];
  if (ig) items.push({ key: "ig", href: ig, label: "Instagram" });
  if (fb) items.push({ key: "fb", href: fb, label: "Facebook" });
  items.push({ key: "maps", href: mapsHref, label: "Location" });

  return (
    <div
      className={
        palette
          ? "mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 border-t border-[color:var(--p-secondary)] pt-6"
          : "mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 border-t border-zinc-800 pt-6"
      }
    >
      {items.map((item) => (
        <a
          key={item.key}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          {item.label}
        </a>
      ))}
    </div>
  );
}

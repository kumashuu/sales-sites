import type { CSSProperties } from "react";
import type { SiteConfig } from "@sales-sites/lib";
import { resolveAddressMapHref, telHref } from "@sales-sites/lib";
import { ReservationSocialLinks } from "./reservation-social-links";

type Accent = SiteConfig["theme"]["accent"];

const ACCENT: Record<
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
};

function paletteCssVars(p: NonNullable<SiteConfig["theme"]["palette"]>): CSSProperties {
  return {
    "--p-bg": p.background,
    "--p-text": p.mainText,
    "--p-sub": p.subText,
    "--p-accent": p.accent,
    "--p-secondary": p.secondary,
  } as CSSProperties;
}

/** accent の上に載せる文字色（ライトは白、ダークは zinc-950） */
function onAccentText(palette: SiteConfig["theme"]["palette"] | undefined): string {
  return palette ? "text-white" : "text-zinc-950";
}

export function SalesSite({ site }: { site: SiteConfig }) {
  const p = site.theme.palette;
  const vars = p ? paletteCssVars(p) : undefined;
  const a = ACCENT[site.theme.accent];
  const onAccent = onAccentText(p);
  const addressMapHref = resolveAddressMapHref(site.contact.address);
  const addressMapLabel = site.contact.address.mapLinkLabel?.trim() || "Open in maps";

  const heroRadial = p
    ? { backgroundImage: `radial-gradient(ellipse at 50% 50%, color-mix(in srgb, var(--p-accent) 18%, transparent) 0%, transparent 70%)` }
    : {
        backgroundImage: `radial-gradient(ellipse at 50% 50%, ${a.radial} 0%, transparent 70%)`,
      };

  return (
    <div
      className={
        p
          ? "min-h-screen bg-[var(--p-bg)] font-sans text-[var(--p-text)]"
          : "min-h-screen bg-zinc-950 font-sans text-white"
      }
      style={vars}
    >
      <nav
        className={
          p
            ? "fixed top-0 z-50 w-full border-b border-[color:var(--p-secondary)] bg-[color-mix(in_srgb,var(--p-bg)_92%,transparent)] backdrop-blur-md"
            : "fixed top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md"
        }
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p
              className={
                p
                  ? "text-xs uppercase tracking-widest text-[var(--p-accent)]"
                  : `text-xs uppercase tracking-widest ${a.text}`
              }
            >
              {site.brand.locationLine}
            </p>
            <h1 className={`text-lg font-bold tracking-wide ${p ? "text-[var(--p-text)]" : ""}`}>
              {site.brand.name}
            </h1>
          </div>
          <a
            href={site.nav.ctaHref}
            className={
              p
                ? `rounded-full px-5 py-2 text-sm font-bold transition-opacity ${onAccent} bg-[var(--p-accent)] hover:opacity-90`
                : `rounded-full px-5 py-2 text-sm font-bold ${onAccent} transition-colors ${a.bg} ${a.bgHover}`
            }
          >
            {site.nav.ctaLabel}
          </a>
        </div>
      </nav>

      <section className="relative flex min-h-screen items-center justify-center px-6 pt-20 text-center">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${site.hero.backgroundImage}')` }}
        />
        <div
          className={p ? "absolute inset-0 bg-white/70" : "absolute inset-0 bg-zinc-950/70"}
        />
        <div className="absolute inset-0 opacity-15" style={heroRadial} />
        <div className="relative z-10 mx-auto max-w-3xl">
          <p
            className={
              p
                ? "mb-4 text-sm uppercase tracking-widest text-[var(--p-accent)]"
                : `mb-4 text-sm uppercase tracking-widest ${a.text}`
            }
          >
            {site.hero.eyebrow}
          </p>
          <h2
            className={`mb-6 text-6xl font-bold leading-none tracking-tight md:text-8xl ${
              p ? "text-[var(--p-text)]" : ""
            }`}
          >
            {site.hero.title}{" "}
            <span className={p ? "text-[var(--p-accent)]" : a.text}>{site.hero.highlight}</span>
          </h2>
          <p
            className={
              p
                ? "mb-10 text-xl leading-relaxed text-[var(--p-sub)] md:text-2xl"
                : "mb-10 text-xl leading-relaxed text-zinc-300 md:text-2xl"
            }
          >
            {site.hero.descriptionLines.map((line) => (
              <span key={line}>
                {line}
                <br />
              </span>
            ))}
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href={site.hero.primaryCta.href}
              className={
                p
                  ? `rounded-full px-8 py-4 text-lg font-bold transition-opacity ${onAccent} bg-[var(--p-accent)] hover:opacity-90`
                  : `rounded-full px-8 py-4 text-lg font-bold ${onAccent} transition-colors ${a.bg} ${a.bgHover}`
              }
            >
              {site.hero.primaryCta.label}
            </a>
            <a
              href={site.hero.secondaryCta.href}
              className={
                p
                  ? "rounded-full border border-[color:var(--p-accent)] bg-transparent px-8 py-4 text-lg text-[var(--p-accent)] transition-colors hover:bg-[var(--p-secondary)]"
                  : `rounded-full border border-zinc-600 px-8 py-4 text-lg transition-colors ${a.borderNav} ${a.textHover}`
              }
            >
              {site.hero.secondaryCta.label}
            </a>
          </div>
          <div
            className={
              p
                ? "mt-16 flex flex-col items-center justify-center gap-6 text-sm text-[var(--p-sub)] sm:flex-row"
                : "mt-16 flex flex-col items-center justify-center gap-6 text-sm text-zinc-400 sm:flex-row"
            }
          >
            {site.hero.meta.map((m) => (
              <span key={m.text}>{m.text}</span>
            ))}
          </div>
        </div>
      </section>

      <section
        className={
          p
            ? "border-t border-[color:var(--p-secondary)] px-6 py-20"
            : "border-t border-zinc-800 px-6 py-20"
        }
      >
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
          {site.features.map((f) => (
            <div
              key={f.title}
              className={
                p
                  ? "rounded-2xl border border-[color:var(--p-secondary)] bg-[var(--p-bg)] p-8 transition-colors hover:border-[color:var(--p-accent)]"
                  : `rounded-2xl border border-zinc-800 bg-zinc-900 p-8 transition-colors ${a.borderCard}`
              }
            >
              <div
                className={
                  p
                    ? "mb-4 h-1 w-10 rounded-full bg-[var(--p-accent)]"
                    : `mb-4 h-1 w-10 rounded-full ${a.bg}`
                }
                aria-hidden
              />
              <h3
                className={
                  p
                    ? "mb-3 text-xl font-bold text-[var(--p-accent)]"
                    : `mb-3 text-xl font-bold ${a.text}`
                }
              >
                {f.title}
              </h3>
              <p
                className={
                  p ? "leading-relaxed text-[var(--p-sub)]" : "leading-relaxed text-zinc-400"
                }
              >
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <p
              className={
                p
                  ? "mb-2 text-sm uppercase tracking-widest text-[var(--p-accent)]"
                  : `mb-2 text-sm uppercase tracking-widest ${a.text}`
              }
            >
              {site.gallery.eyebrow}
            </p>
            <h2 className={`text-4xl font-bold ${p ? "text-[var(--p-text)]" : ""}`}>
              {site.gallery.title}
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {site.gallery.images.map((img) => (
              <img
                key={img.src}
                src={img.src}
                alt={img.alt}
                className="aspect-square w-full rounded-2xl object-cover"
              />
            ))}
          </div>
        </div>
      </section>

      <section
        id="menu"
        className={p ? "bg-[var(--p-secondary)] px-6 py-20" : "bg-zinc-900 px-6 py-20"}
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <p
              className={
                p
                  ? "mb-2 text-sm uppercase tracking-widest text-[var(--p-accent)]"
                  : `mb-2 text-sm uppercase tracking-widest ${a.text}`
              }
            >
              {site.menu.sectionEyebrow}
            </p>
            <h2 className={`text-4xl font-bold ${p ? "text-[var(--p-text)]" : ""}`}>
              {site.menu.sectionTitle}
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {site.menu.items.map((item) => (
              <div
                key={item.name}
                className={
                  p
                    ? "flex items-start justify-between rounded-xl border border-[color:var(--p-secondary)] bg-[var(--p-bg)] p-5 transition-colors hover:border-[color:var(--p-accent)]"
                    : `flex items-start justify-between rounded-xl border border-zinc-700 bg-zinc-800 p-5 transition-colors ${a.borderMenu}`
                }
              >
                <div>
                  <h4
                    className={
                      p
                        ? "mb-1 font-semibold text-[var(--p-text)]"
                        : "mb-1 font-semibold text-white"
                    }
                  >
                    {item.name}
                  </h4>
                  <p className={p ? "text-sm text-[var(--p-sub)]" : "text-sm text-zinc-400"}>
                    {item.desc}
                  </p>
                </div>
                <span
                  className={
                    p
                      ? "ml-4 shrink-0 font-bold text-[var(--p-accent)]"
                      : `ml-4 shrink-0 font-bold ${a.text}`
                  }
                >
                  {item.price}
                </span>
              </div>
            ))}
          </div>
          {site.menu.footerNote ? (
            <p
              className={
                p
                  ? "mt-8 text-center text-sm text-[var(--p-sub)]"
                  : "mt-8 text-center text-sm text-zinc-500"
              }
            >
              {site.menu.footerNote}
            </p>
          ) : null}
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div>
            <p
              className={
                p
                  ? "mb-2 text-sm uppercase tracking-widest text-[var(--p-accent)]"
                  : `mb-2 text-sm uppercase tracking-widest ${a.text}`
              }
            >
              {site.contact.sectionEyebrow}
            </p>
            <h2 className={`mb-8 text-4xl font-bold ${p ? "text-[var(--p-text)]" : ""}`}>
              {site.contact.sectionTitle}
            </h2>
            <div className={p ? "space-y-5 text-[var(--p-sub)]" : "space-y-5 text-zinc-300"}>
              <div className="flex gap-4">
                <span
                  className={
                    p
                      ? "mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--p-accent)]"
                      : `mt-1.5 h-2 w-2 shrink-0 rounded-full ${a.bg}`
                  }
                  aria-hidden
                />
                <div>
                  <p className={p ? "font-semibold text-[var(--p-text)]" : "font-semibold text-white"}>
                    {site.contact.address.label}
                  </p>
                  {site.contact.address.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                  <a
                    href={addressMapHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={
                      p
                        ? "mt-3 inline-flex items-center gap-1.5 rounded-full border border-[color:var(--p-accent)] px-3 py-1.5 text-sm font-medium text-[var(--p-accent)] transition-colors hover:bg-[var(--p-secondary)]"
                        : `mt-3 inline-flex items-center gap-1.5 rounded-full border border-zinc-500 px-3 py-1.5 text-sm font-medium transition-colors ${a.borderNav} ${a.textHover}`
                    }
                  >
                    {addressMapLabel}
                  </a>
                </div>
              </div>
              <div className="flex gap-4">
                <span
                  className={
                    p
                      ? "mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--p-accent)]"
                      : `mt-1.5 h-2 w-2 shrink-0 rounded-full ${a.bg}`
                  }
                  aria-hidden
                />
                <div>
                  <p className={p ? "font-semibold text-[var(--p-text)]" : "font-semibold text-white"}>
                    {site.contact.hours.label}
                  </p>
                  {site.contact.hours.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>
              <div className="flex gap-4">
                <span
                  className={
                    p
                      ? "mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--p-accent)]"
                      : `mt-1.5 h-2 w-2 shrink-0 rounded-full ${a.bg}`
                  }
                  aria-hidden
                />
                <div>
                  <p className={p ? "font-semibold text-[var(--p-text)]" : "font-semibold text-white"}>
                    Phone
                  </p>
                  <p>{site.contact.phone}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span
                  className={
                    p
                      ? "mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--p-accent)]"
                      : `mt-1.5 h-2 w-2 shrink-0 rounded-full ${a.bg}`
                  }
                  aria-hidden
                />
                <div>
                  <p className={p ? "font-semibold text-[var(--p-text)]" : "font-semibold text-white"}>
                    Email
                  </p>
                  <p>{site.contact.email}</p>
                </div>
              </div>
            </div>
          </div>
          <div
            className={
              p
                ? "rounded-2xl border border-[color:var(--p-secondary)] bg-[var(--p-bg)] p-8 text-center"
                : "rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center"
            }
          >
            <h3 className={`mb-3 text-2xl font-bold ${p ? "text-[var(--p-text)]" : ""}`}>
              {site.reservation.title}
            </h3>
            <p className={p ? "mb-8 text-[var(--p-sub)]" : "mb-8 text-zinc-400"}>
              {site.reservation.subtitle}
            </p>
            <div className="space-y-3">
              <a
                href={telHref(site.contact.phone)}
                className={
                  p
                    ? `flex w-full items-center justify-center gap-2 rounded-full py-4 font-bold transition-opacity ${onAccent} bg-[var(--p-accent)] hover:opacity-90`
                    : `flex w-full items-center justify-center gap-2 rounded-full py-4 font-bold ${onAccent} transition-colors ${a.bg} ${a.bgHover}`
                }
              >
                Call {site.contact.phone}
              </a>
              <a
                href={`mailto:${site.contact.email}`}
                className={
                  p
                    ? "flex w-full items-center justify-center gap-2 rounded-full border border-[color:var(--p-accent)] py-4 text-[var(--p-accent)] transition-colors hover:bg-[var(--p-secondary)]"
                    : `flex w-full items-center justify-center gap-2 rounded-full border border-zinc-600 py-4 transition-colors ${a.borderNav} ${a.textHover}`
                }
              >
                Email us
              </a>
            </div>
            <ReservationSocialLinks
              social={site.contact.social}
              address={site.contact.address}
              palette={p}
              accent={site.theme.accent}
            />
          </div>
        </div>
      </section>

      <footer
        className={
          p
            ? "border-t border-[color:var(--p-secondary)] px-6 py-8 text-center text-sm text-[var(--p-sub)]"
            : "border-t border-zinc-800 px-6 py-8 text-center text-sm text-zinc-500"
        }
      >
        <p className={`mb-1 text-lg font-bold ${p ? "text-[var(--p-text)]" : "text-white"}`}>
          {site.footer.brandLine}
        </p>
        <p>{site.footer.subLine}</p>
        <p className="mt-4">
          © {site.footer.year} {site.brand.name}. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

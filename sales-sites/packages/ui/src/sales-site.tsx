import type { CSSProperties } from "react";
import type { SiteConfig } from "@sales-sites/lib";
import { resolveAddressMapHref, telHref } from "@sales-sites/lib";
import { ACCENT } from "./accent-tokens";
import { ReservationSocialLinks } from "./reservation-social-links";
import { TreatmentBeforeAfter } from "./treatment-before-after";

function paletteCssVars(p: NonNullable<SiteConfig["theme"]["palette"]>): CSSProperties {
  const o: Record<string, string> = {
    "--p-bg": p.background,
    "--p-text": p.mainText,
    "--p-sub": p.subText,
    "--p-accent": p.accent,
    "--p-secondary": p.secondary,
  };
  const hi = p.highlight?.trim();
  if (hi) o["--p-highlight"] = hi;
  const on = p.accentForeground?.trim();
  if (on) o["--p-on-accent"] = on;
  return o as CSSProperties;
}

/** accent の上に載せる文字色（明るい黄は accentForeground、それ以外は白） */
function onAccentText(palette: SiteConfig["theme"]["palette"] | undefined): string {
  if (!palette) return "text-zinc-950";
  if (palette.accentForeground?.trim()) return "text-[var(--p-on-accent)]";
  return "text-white";
}

export function SalesSite({ site }: { site: SiteConfig }) {
  const p = site.theme.palette;
  const vars = p ? paletteCssVars(p) : undefined;
  const a = ACCENT[site.theme.accent];
  const onAccent = onAccentText(p);
  const addressMapHref = resolveAddressMapHref(site.contact.address);
  const addressMapLabel = site.contact.address.mapLinkLabel?.trim() || "Open in maps";
  const showAddressMapLink = site.contact.address.showMapLink !== false;
  const showReservationCall = site.contact.showCallButton !== false;
  const menuSectionId = site.template === "beauty" ? "services" : "menu";
  const hasEmail = Boolean(site.contact.email?.trim());
  const decorative = site.contact.decorativeContactLinks === true;
  const blockedDecorativeHref = (href: string) => {
    if (!decorative) return false;
    const h = href.trim().toLowerCase();
    return h.startsWith("tel:") || h.startsWith("mailto:") || h.startsWith("sms:");
  };
  const actionDemoTitle = "Layout preview (link disabled in this build)";

  const hasHighlight = !!p?.highlight?.trim();

  /** 小見出し（eyebrow）: 灯り色があれば暖色、なければアクセント赤 */
  const eyebrowTone = p
    ? hasHighlight
      ? "text-[var(--p-highlight)]"
      : "text-[var(--p-accent)]"
    : "";

  const heroRadial = p
    ? hasHighlight
      ? {
          backgroundImage: `radial-gradient(ellipse at 45% 35%, color-mix(in srgb, var(--p-highlight) 35%, transparent) 0%, transparent 55%), radial-gradient(ellipse at 60% 60%, color-mix(in srgb, var(--p-accent) 14%, transparent) 0%, transparent 65%)`,
        }
      : {
          backgroundImage: `radial-gradient(ellipse at 50% 50%, color-mix(in srgb, var(--p-accent) 18%, transparent) 0%, transparent 70%)`,
        }
    : {
        backgroundImage: `radial-gradient(ellipse at 50% 50%, ${a.radial} 0%, transparent 70%)`,
      };

  /** 特徴カード上のバー: 木色を優先 */
  const featureBarClass = p
    ? hasHighlight
      ? "mb-4 h-1 w-10 rounded-full bg-[var(--p-secondary)]"
      : "mb-4 h-1 w-10 rounded-full bg-[var(--p-accent)]"
    : "";

  /** 連絡先行頭のドット: 灯りパレット時は木色 */
  const contactDotClass = p
    ? hasHighlight
      ? "mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--p-secondary)]"
      : "mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--p-accent)]"
    : "";

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
                  ? `text-xs uppercase tracking-widest ${eyebrowTone}`
                  : `text-xs uppercase tracking-widest ${a.text}`
              }
            >
              {site.brand.locationLine}
            </p>
            <h1 className={`text-lg font-bold tracking-wide ${p ? "text-[var(--p-text)]" : ""}`}>
              {site.brand.name}
            </h1>
          </div>
          {blockedDecorativeHref(site.nav.ctaHref) ? (
            <span
              className={
                p
                  ? `cursor-default select-none rounded-full px-5 py-2 text-sm font-bold ${onAccent} bg-[var(--p-accent)]`
                  : `cursor-default select-none rounded-full px-5 py-2 text-sm font-bold ${onAccent} ${a.bg}`
              }
              title={actionDemoTitle}
            >
              {site.nav.ctaLabel}
            </span>
          ) : (
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
          )}
        </div>
      </nav>

      <section className="relative flex min-h-screen items-center justify-center px-6 pt-20 text-center">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${site.hero.backgroundImage}')` }}
        />
        <div
          className={
            p
              ? "absolute inset-0 bg-[color-mix(in_srgb,var(--p-bg)_78%,transparent)]"
              : "absolute inset-0 bg-zinc-950/70"
          }
        />
        <div
          className={hasHighlight && p ? "absolute inset-0 opacity-[0.22]" : "absolute inset-0 opacity-15"}
          style={heroRadial}
        />
        <div className="relative z-10 mx-auto max-w-3xl">
          <p
            className={
              p
                ? `mb-4 text-sm uppercase tracking-widest ${eyebrowTone}`
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
            {blockedDecorativeHref(site.hero.primaryCta.href) ? (
              <span
                className={
                  p
                    ? `cursor-default select-none rounded-full px-8 py-4 text-lg font-bold ${onAccent} bg-[var(--p-accent)]`
                    : `cursor-default select-none rounded-full px-8 py-4 text-lg font-bold ${onAccent} ${a.bg}`
                }
                title={actionDemoTitle}
              >
                {site.hero.primaryCta.label}
              </span>
            ) : (
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
            )}
            {blockedDecorativeHref(site.hero.secondaryCta.href) ? (
              <span
                className={
                  p
                    ? "cursor-default select-none rounded-full border border-[color:var(--p-accent)] bg-transparent px-8 py-4 text-lg text-[var(--p-accent)]"
                    : `cursor-default select-none rounded-full border border-zinc-600 px-8 py-4 text-lg ${a.borderNav} ${a.text}`
                }
                title={actionDemoTitle}
              >
                {site.hero.secondaryCta.label}
              </span>
            ) : (
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
            )}
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
                className={p ? featureBarClass : `mb-4 h-1 w-10 rounded-full ${a.bg}`}
                aria-hidden
              />
              <h3
                className={
                  p
                    ? p.featureTitlesUseMainText
                      ? "mb-3 text-xl font-bold text-[var(--p-text)]"
                      : "mb-3 text-xl font-bold text-[var(--p-accent)]"
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

      {site.beforeAfter ? (
        <TreatmentBeforeAfter
          section={site.beforeAfter}
          palette={p}
          accent={site.theme.accent}
        />
      ) : null}

      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <p
              className={
                p
                  ? `mb-2 text-sm uppercase tracking-widest ${eyebrowTone}`
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
        id={menuSectionId}
        className={
          p
            ? "bg-[color-mix(in_srgb,var(--p-secondary)_38%,var(--p-bg))] px-6 py-20"
            : "bg-zinc-900 px-6 py-20"
        }
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <p
              className={
                p
                  ? `mb-2 text-sm uppercase tracking-widest ${eyebrowTone}`
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
                  ? `mb-2 text-sm uppercase tracking-widest ${eyebrowTone}`
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
                  className={p ? contactDotClass : `mt-1.5 h-2 w-2 shrink-0 rounded-full ${a.bg}`}
                  aria-hidden
                />
                <div>
                  <p className={p ? "font-semibold text-[var(--p-text)]" : "font-semibold text-white"}>
                    {site.contact.address.label}
                  </p>
                  {site.contact.address.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                  {showAddressMapLink ? (
                    decorative ? (
                      <span
                        className={
                          p
                            ? "mt-3 inline-flex cursor-default select-none items-center gap-1.5 rounded-full border border-[color:var(--p-accent)] px-3 py-1.5 text-sm font-medium text-[var(--p-accent)]"
                            : `mt-3 inline-flex cursor-default select-none items-center gap-1.5 rounded-full border border-zinc-500 px-3 py-1.5 text-sm font-medium ${a.borderNav} ${a.text}`
                        }
                        title={actionDemoTitle}
                      >
                        {addressMapLabel}
                      </span>
                    ) : (
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
                    )
                  ) : null}
                </div>
              </div>
              <div className="flex gap-4">
                <span
                  className={p ? contactDotClass : `mt-1.5 h-2 w-2 shrink-0 rounded-full ${a.bg}`}
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
                  className={p ? contactDotClass : `mt-1.5 h-2 w-2 shrink-0 rounded-full ${a.bg}`}
                  aria-hidden
                />
                <div>
                  <p className={p ? "font-semibold text-[var(--p-text)]" : "font-semibold text-white"}>
                    Phone
                  </p>
                  <p>{site.contact.phone}</p>
                </div>
              </div>
              {hasEmail ? (
                <div className="flex gap-4">
                  <span
                    className={p ? contactDotClass : `mt-1.5 h-2 w-2 shrink-0 rounded-full ${a.bg}`}
                    aria-hidden
                  />
                  <div>
                    <p
                      className={p ? "font-semibold text-[var(--p-text)]" : "font-semibold text-white"}
                    >
                      Email
                    </p>
                    <p>{site.contact.email}</p>
                  </div>
                </div>
              ) : null}
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
              {showReservationCall && site.contact.phone?.trim() ? (
                decorative ? (
                  <span
                    className={
                      p
                        ? `flex w-full cursor-default select-none items-center justify-center gap-2 rounded-full py-4 font-bold ${onAccent} bg-[var(--p-accent)]`
                        : `flex w-full cursor-default select-none items-center justify-center gap-2 rounded-full py-4 font-bold ${onAccent} ${a.bg}`
                    }
                    title={actionDemoTitle}
                  >
                    Call {site.contact.phone}
                  </span>
                ) : (
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
                )
              ) : null}
              {hasEmail ? (
                decorative ? (
                  <span
                    className={
                      p
                        ? "flex w-full cursor-default select-none items-center justify-center gap-2 rounded-full border border-[color:var(--p-accent)] py-4 text-[var(--p-accent)]"
                        : `flex w-full cursor-default select-none items-center justify-center gap-2 rounded-full border border-zinc-600 py-4 ${a.borderNav} ${a.text}`
                    }
                    title={actionDemoTitle}
                  >
                    Email us
                  </span>
                ) : (
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
                )
              ) : null}
            </div>
            <ReservationSocialLinks
              social={site.contact.social}
              address={site.contact.address}
              palette={p}
              accent={site.theme.accent}
              decorative={decorative}
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

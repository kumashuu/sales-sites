import type { SiteConfig } from "@sales-sites/lib";
import { ACCENT, type Accent } from "./accent-tokens";

export type TreatmentBeforeAfterProps = {
  section: NonNullable<SiteConfig["beforeAfter"]>;
  palette: SiteConfig["theme"]["palette"] | undefined;
  accent: Accent;
};

/**
 * 美容室テンプレ用: 施術例を Before / After の2枚組で表示。
 * `SalesSite` のギャラリー・特徴ブロックとは別コンポーネント（専用レイアウト）。
 */
export function TreatmentBeforeAfter({
  section,
  palette: p,
  accent,
}: TreatmentBeforeAfterProps) {
  const a = ACCENT[accent];
  const lb = section.labels?.before ?? "Before";
  const la = section.labels?.after ?? "After";
  const hasHighlight = !!p?.highlight?.trim();

  const eyebrowTone = p
    ? hasHighlight
      ? "text-[var(--p-highlight)]"
      : "text-[var(--p-accent)]"
    : a.text;

  return (
    <section
      className={
        p
          ? "border-t border-[color:var(--p-secondary)] bg-[color-mix(in_srgb,var(--p-secondary)_22%,var(--p-bg))] px-6 py-20"
          : "border-t border-zinc-800 bg-zinc-950/40 px-6 py-20"
      }
      aria-labelledby="before-after-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p
            className={
              p
                ? `mb-2 text-sm uppercase tracking-widest ${eyebrowTone}`
                : `mb-2 text-sm uppercase tracking-widest ${a.text}`
            }
          >
            {section.sectionEyebrow}
          </p>
          <h2
            id="before-after-heading"
            className={`text-4xl font-bold ${p ? "text-[var(--p-text)]" : "text-white"}`}
          >
            {section.sectionTitle}
          </h2>
          {section.subtitle ? (
            <p
              className={
                p
                  ? "mx-auto mt-4 max-w-2xl text-lg text-[var(--p-sub)]"
                  : "mx-auto mt-4 max-w-2xl text-lg text-zinc-400"
              }
            >
              {section.subtitle}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-16">
          {section.items.map((item, idx) => (
            <figure
              key={`${item.before.src}-${item.after.src}-${idx}`}
              className={
                p
                  ? "rounded-2xl border border-[color:var(--p-secondary)] bg-[var(--p-bg)] p-6 md:p-8"
                  : `rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 md:p-8`
              }
            >
              {item.title ? (
                <h3
                  className={`mb-6 text-center text-xl font-bold ${p ? "text-[var(--p-text)]" : "text-white"}`}
                >
                  {item.title}
                </h3>
              ) : null}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
                <div className="flex flex-col gap-2">
                  <p
                    className={
                      p
                        ? "text-xs font-bold uppercase tracking-widest text-[var(--p-sub)]"
                        : "text-xs font-bold uppercase tracking-widest text-zinc-500"
                    }
                  >
                    {lb}
                  </p>
                  <div
                    className={
                      p
                        ? "overflow-hidden rounded-xl border border-[color:var(--p-secondary)] ring-1 ring-[color:color-mix(in_srgb,var(--p-accent)_35%,transparent)]"
                        : "overflow-hidden rounded-xl border border-zinc-700 ring-1 ring-zinc-600/50"
                    }
                  >
                    <img
                      src={item.before.src}
                      alt={item.before.alt}
                      className="aspect-[4/5] w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <p
                    className={
                      p
                        ? "text-xs font-bold uppercase tracking-widest text-[var(--p-sub)]"
                        : "text-xs font-bold uppercase tracking-widest text-zinc-500"
                    }
                  >
                    {la}
                  </p>
                  <div
                    className={
                      p
                        ? "overflow-hidden rounded-xl border border-[color:var(--p-secondary)] ring-2 ring-[color:color-mix(in_srgb,var(--p-accent)_55%,transparent)]"
                        : "overflow-hidden rounded-xl border border-zinc-600 ring-2 ring-amber-500/30"
                    }
                  >
                    <img
                      src={item.after.src}
                      alt={item.after.alt}
                      className="aspect-[4/5] w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
              {item.caption ? (
                <figcaption
                  className={
                    p
                      ? "mt-6 text-center text-sm text-[var(--p-sub)]"
                      : "mt-6 text-center text-sm text-zinc-400"
                  }
                >
                  {item.caption}
                </figcaption>
              ) : (
                <figcaption className="sr-only">
                  {item.title ? `${item.title}. ` : ""}
                  Comparison: {lb} and {la}.
                </figcaption>
              )}
            </figure>
          ))}
        </div>

        {section.footerNote ? (
          <p
            className={
              p
                ? "mt-12 text-center text-sm text-[var(--p-sub)]"
                : "mt-12 text-center text-sm text-zinc-500"
            }
          >
            {section.footerNote}
          </p>
        ) : null}
      </div>
    </section>
  );
}

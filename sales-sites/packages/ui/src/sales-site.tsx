import type { SiteConfig } from "@sales-sites/lib";
import { telHref } from "@sales-sites/lib";

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

export function SalesSite({ site }: { site: SiteConfig }) {
  const a = ACCENT[site.theme.accent];

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans">
      <nav className="fixed top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className={`text-xs uppercase tracking-widest ${a.text}`}>
              {site.brand.locationLine}
            </p>
            <h1 className="text-lg font-bold tracking-wide">{site.brand.name}</h1>
          </div>
          <a
            href={site.nav.ctaHref}
            className={`rounded-full px-5 py-2 text-sm font-bold text-zinc-950 transition-colors ${a.bg} ${a.bgHover}`}
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
        <div className="absolute inset-0 bg-zinc-950/70" />
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `radial-gradient(ellipse at 50% 50%, ${a.radial} 0%, transparent 70%)`,
          }}
        />
        <div className="relative z-10 mx-auto max-w-3xl">
          <p className={`mb-4 text-sm uppercase tracking-widest ${a.text}`}>{site.hero.eyebrow}</p>
          <h2 className="mb-6 text-6xl font-bold leading-none tracking-tight md:text-8xl">
            {site.hero.title}{" "}
            <span className={a.text}>{site.hero.highlight}</span>
          </h2>
          <p className="mb-10 text-xl leading-relaxed text-zinc-300 md:text-2xl">
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
              className={`rounded-full px-8 py-4 text-lg font-bold text-zinc-950 transition-colors ${a.bg} ${a.bgHover}`}
            >
              {site.hero.primaryCta.label}
            </a>
            <a
              href={site.hero.secondaryCta.href}
              className={`rounded-full border border-zinc-600 px-8 py-4 text-lg transition-colors ${a.borderNav} ${a.textHover}`}
            >
              {site.hero.secondaryCta.label}
            </a>
          </div>
          <div className="mt-16 flex flex-col items-center justify-center gap-6 text-sm text-zinc-400 sm:flex-row">
            {site.hero.meta.map((m) => (
              <span key={m.text}>
                {m.icon} {m.text}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-800 px-6 py-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
          {site.features.map((f) => (
            <div
              key={f.title}
              className={`rounded-2xl border border-zinc-800 bg-zinc-900 p-8 transition-colors ${a.borderCard}`}
            >
              <div className="mb-4 text-4xl">{f.icon}</div>
              <h3 className={`mb-3 text-xl font-bold ${a.text}`}>{f.title}</h3>
              <p className="leading-relaxed text-zinc-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <p className={`mb-2 text-sm uppercase tracking-widest ${a.text}`}>{site.gallery.eyebrow}</p>
            <h2 className="text-4xl font-bold">{site.gallery.title}</h2>
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

      <section id="menu" className="bg-zinc-900 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <p className={`mb-2 text-sm uppercase tracking-widest ${a.text}`}>{site.menu.sectionEyebrow}</p>
            <h2 className="text-4xl font-bold">{site.menu.sectionTitle}</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {site.menu.items.map((item) => (
              <div
                key={item.name}
                className={`flex items-start justify-between rounded-xl border border-zinc-700 bg-zinc-800 p-5 transition-colors ${a.borderMenu}`}
              >
                <div>
                  <h4 className="mb-1 font-semibold text-white">{item.name}</h4>
                  <p className="text-sm text-zinc-400">{item.desc}</p>
                </div>
                <span className={`ml-4 shrink-0 font-bold ${a.text}`}>{item.price}</span>
              </div>
            ))}
          </div>
          {site.menu.footerNote ? (
            <p className="mt-8 text-center text-sm text-zinc-500">{site.menu.footerNote}</p>
          ) : null}
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div>
            <p className={`mb-2 text-sm uppercase tracking-widest ${a.text}`}>{site.contact.sectionEyebrow}</p>
            <h2 className="mb-8 text-4xl font-bold">{site.contact.sectionTitle}</h2>
            <div className="space-y-5 text-zinc-300">
              <div className="flex gap-4">
                <span className={`text-xl ${a.text}`}>📍</span>
                <div>
                  <p className="font-semibold text-white">{site.contact.address.label}</p>
                  {site.contact.address.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>
              <div className="flex gap-4">
                <span className={`text-xl ${a.text}`}>🕔</span>
                <div>
                  <p className="font-semibold text-white">{site.contact.hours.label}</p>
                  {site.contact.hours.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>
              <div className="flex gap-4">
                <span className={`text-xl ${a.text}`}>📞</span>
                <div>
                  <p className="font-semibold text-white">Phone</p>
                  <p>{site.contact.phone}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className={`text-xl ${a.text}`}>✉️</span>
                <div>
                  <p className="font-semibold text-white">Email</p>
                  <p>{site.contact.email}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center">
            <h3 className="mb-3 text-2xl font-bold">{site.reservation.title}</h3>
            <p className="mb-8 text-zinc-400">{site.reservation.subtitle}</p>
            <div className="space-y-3">
              <a
                href={telHref(site.contact.phone)}
                className={`flex w-full items-center justify-center gap-2 rounded-full py-4 font-bold text-zinc-950 transition-colors ${a.bg} ${a.bgHover}`}
              >
                📞 Call {site.contact.phone}
              </a>
              <a
                href={`mailto:${site.contact.email}`}
                className={`flex w-full items-center justify-center gap-2 rounded-full border border-zinc-600 py-4 transition-colors ${a.borderNav} ${a.textHover}`}
              >
                ✉️ Email Us
              </a>
            </div>
            <div className="mt-8 flex justify-center gap-6 border-t border-zinc-800 pt-6">
              {site.contact.social.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-sm text-zinc-400 transition-colors ${a.textHover}`}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-800 px-6 py-8 text-center text-sm text-zinc-500">
        <p className="mb-1 text-lg font-bold text-white">{site.footer.brandLine}</p>
        <p>{site.footer.subLine}</p>
        <p className="mt-4">© {site.footer.year} {site.brand.name}. All rights reserved.</p>
      </footer>
    </div>
  );
}

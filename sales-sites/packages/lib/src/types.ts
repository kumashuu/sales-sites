export type AccentKey = "amber" | "emerald" | "rose";

export type SiteTemplate = "restaurant" | "cafe" | "salon";

export interface SiteConfig {
  siteKey: string;
  template: SiteTemplate;
  brand: {
    name: string;
    locationLine: string;
  };
  seo: {
    title: string;
    description: string;
  };
  theme: {
    accent: AccentKey;
  };
  nav: {
    ctaLabel: string;
    ctaHref: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    highlight: string;
    descriptionLines: string[];
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
    backgroundImage: string;
    meta: { icon: string; text: string }[];
  };
  features: { icon: string; title: string; desc: string }[];
  gallery: {
    title: string;
    eyebrow: string;
    images: { src: string; alt: string }[];
  };
  menu: {
    sectionEyebrow: string;
    sectionTitle: string;
    footerNote?: string;
    items: { name: string; desc: string; price: string }[];
  };
  contact: {
    sectionEyebrow: string;
    sectionTitle: string;
    address: { label: string; lines: string[] };
    hours: { label: string; lines: string[] };
    phone: string;
    email: string;
    social: { label: string; href: string }[];
  };
  reservation: {
    title: string;
    subtitle: string;
  };
  footer: {
    brandLine: string;
    subLine: string;
    year: number;
  };
}

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
    /** 指定時はライト系UI。未指定は従来のダークテーマ + accent */
    palette?: {
      background: string;
      mainText: string;
      subText: string;
      accent: string;
      secondary: string;
    };
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
    /** 絵文字は使わない（共通設計） */
    meta: { text: string }[];
  };
  /** 絵文字は使わない。見出し上の装飾はテーマ色のバーで表示 */
  features: { title: string; desc: string }[];
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
    address: {
      label: string;
      lines: string[];
      /** 省略時は住所行から Google マップ検索 URL を自動生成 */
      mapHref?: string;
      /** 地図リンクの表示文言（省略時は "Open in maps"） */
      mapLinkLabel?: string;
    };
    hours: { label: string; lines: string[] };
    phone: string;
    email: string;
    /** 予約カード下部の固定3種（未設定のリンクは表示しない）。maps 省略時は address から地図URLを生成 */
    social: {
      instagram?: string;
      facebook?: string;
      maps?: string;
    };
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

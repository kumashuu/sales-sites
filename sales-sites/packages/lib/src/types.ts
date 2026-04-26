export type AccentKey = "amber" | "emerald" | "rose" | "yellow";

export type SiteTemplate = "restaurant" | "cafe" | "salon" | "beauty";

/**
 * サイト全体の欧文・和文のベースフォント。
 * - `notoSansJp`: Noto Sans JP（Google Fonts）
 * - `vabiDasabi`: 手書き丸みの雰囲気 → Web では **Kiwi Maru**（Google Fonts）を使用
 * - `hiroMisake`: 筆文字風 → Web では **Yuji Boku**（Google Fonts）を使用
 * （実名フォントファイルを自前で持つ場合はレイアウトの `localFont` に差し替え可能）
 */
export type SiteFontPreset = "notoSansJp" | "vabiDasabi" | "hiroMisake";

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
    /** 未指定時は `notoSansJp` */
    fontPreset?: SiteFontPreset;
    /** 指定時はライト系UI。未指定は従来のダークテーマ + accent */
    palette?: {
      background: string;
      mainText: string;
      subText: string;
      accent: string;
      secondary: string;
      /** 暖色の灯り・アクセント（省略時は eyebrow 等は accent を使用） */
      highlight?: string;
      /** アクセント色の上の文字（明るい黄などでは #0A0A0A 推奨）。省略時は白 */
      accentForeground?: string;
      /** true のとき特徴カードの見出しを mainText に（明るい黄アクセントで読みやすくする） */
      featureTitlesUseMainText?: boolean;
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
  /**
   * 美容室向けなど: 施術の Before / After ギャラリー。
   * 未指定のサイトではレンダリングしない（既存テンプレとの互換）。
   */
  beforeAfter?: {
    sectionEyebrow: string;
    sectionTitle: string;
    subtitle?: string;
    /** 画像下のラベル（省略時は Before / After） */
    labels?: { before: string; after: string };
    footerNote?: string;
    items: {
      /** カード見出し（例: 縮毛矯正） */
      title?: string;
      caption?: string;
      before: { src: string; alt: string };
      after: { src: string; alt: string };
    }[];
  };
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
      /** false のとき住所ブロック下の地図リンク（外部URL）を出さない。販促テンプレ用 */
      showMapLink?: boolean;
    };
    hours: { label: string; lines: string[] };
    phone: string;
    /** false のとき予約カード内の「Call」ボタン（tel:）を出さない。番号は左カラムにテキストのまま表示可 */
    showCallButton?: boolean;
    /** 未設定・空のときは連絡欄のメール行と予約カードのメールボタンを出さない */
    email?: string;
    /**
     * 予約カード下部: Instagram / Facebook / Location（未設定のキーは非表示）。
     * `maps` を **空文字** にすると Location を出さず、住所からの自動地図URLも使わない。
     */
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

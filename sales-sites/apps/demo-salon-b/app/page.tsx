import type { SiteConfig } from "@sales-sites/lib";
import { SalesSite } from "@sales-sites/ui";
import site from "../data/site.json";

export default function Home() {
  return <SalesSite site={site as SiteConfig} />;
}

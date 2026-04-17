import type { Metadata } from "next";
import type { SiteConfig } from "./types";

export function buildMetadata(site: SiteConfig): Metadata {
  return {
    title: site.seo.title,
    description: site.seo.description,
  };
}

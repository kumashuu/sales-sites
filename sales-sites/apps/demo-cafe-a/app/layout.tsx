import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { SiteConfig } from "@sales-sites/lib";
import { buildMetadata } from "@sales-sites/lib";
import "./globals.css";
import site from "../data/site.json";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteConfig = site as SiteConfig;
const palette = siteConfig.theme.palette;

export const metadata: Metadata = buildMetadata(siteConfig);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className={
          palette
            ? "flex min-h-full flex-col font-sans antialiased"
            : "flex min-h-full flex-col bg-zinc-950 font-sans text-white antialiased"
        }
        style={
          palette
            ? { backgroundColor: palette.background, color: palette.mainText }
            : undefined
        }
      >
        {children}
      </body>
    </html>
  );
}

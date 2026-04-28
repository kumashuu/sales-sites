import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { buildMetadata } from "@sales-sites/lib";
import { getSiteFont } from "@sales-sites/ui";
import "./globals.css";
import { getSite } from "../lib/site";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteConfig = getSite();
const siteFont = getSiteFont(siteConfig.theme.fontPreset);
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
      className={`${siteFont.variable} ${geistMono.variable} h-full antialiased`}
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

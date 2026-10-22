import type { Metadata } from "next";
import { findEntry } from "@/lib/cms-catalog";
import localFont from "next/font/local";
import { Suspense } from "react";
import { LocaleFrame } from "@/i18n/locale-frame";
import "./globals.css";

const montserrat = localFont({
  src: [
    { path: "../fonts/montserrat-400.ttf", weight: "400", style: "normal" },
    { path: "../fonts/montserrat-600.ttf", weight: "600", style: "normal" },
    { path: "../fonts/montserrat-700.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-montserrat",
});

const sourceSerif = localFont({
  src: "../fonts/source-serif-4-600.ttf",
  weight: "600",
  style: "normal",
  variable: "--font-source-serif",
});

const inter = localFont({
  src: "../fonts/inter-600.ttf",
  weight: "600",
  style: "normal",
  variable: "--font-inter",
});

const barlow = localFont({
  src: [
    {
      path: "../fonts/barlow-semi-condensed-400.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/barlow-semi-condensed-800.woff2",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-barlow",
});

const barlowCondensed = localFont({
  src: [
    { path: "../fonts/barlow-condensed-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/barlow-condensed-600.woff2", weight: "600", style: "normal" },
    { path: "../fonts/barlow-condensed-800.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-barlow-condensed",
});

export const instant = false;

const homeTitle = findEntry(["home"], "document_title");
const homeDescription = findEntry(["home"], "document_description");

export const metadata: Metadata = {
  title: homeTitle?.en ?? "",
  description: homeDescription?.en ?? "",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${sourceSerif.variable} ${inter.variable} ${barlow.variable} ${barlowCondensed.variable} h-full`}
    >
      <body className="min-h-full">
        <Suspense fallback={null}>
          <LocaleFrame>{children}</LocaleFrame>
        </Suspense>
      </body>
    </html>
  );
}

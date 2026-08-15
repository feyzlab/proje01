import type { Metadata } from "next";
import localFont from "next/font/local";
import { DEFAULT_OG_PATH } from "@/lib/og-constants";
import "./globals.css";

const inter = localFont({
  src: [
    { path: "./fonts/inter-latin-ext.woff2", weight: "100 900", style: "normal" },
    { path: "./fonts/inter-latin.woff2", weight: "100 900", style: "normal" },
  ],
  variable: "--font-inter",
  display: "swap",
  adjustFontFallback: "Arial",
});

const interTight = localFont({
  src: [
    {
      path: "./fonts/inter-tight-latin-ext.woff2",
      weight: "100 900",
      style: "normal",
    },
    { path: "./fonts/inter-tight-latin.woff2", weight: "100 900", style: "normal" },
  ],
  variable: "--font-inter-tight",
  display: "swap",
  adjustFontFallback: "Arial",
});

const SITE_URL = "https://proje01.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "PROJE 01 – Tadilat & Mimarlık | İzmir İç Mimarlık",
    template: "%s | PROJE 01",
  },
  description:
    "Konut, ofis ve ticari mekan projelerinde iç mekan tasarımı, tadilat ve özel üretim çözümlerle estetik ve işlevsel alanlar tasarlıyoruz. İzmir & Manisa.",
  keywords: [
    "iç mimarlık",
    "tadilat",
    "anahtar teslim tadilat",
    "mimarlık",
    "İzmir iç mimar",
    "Manisa tadilat",
    "ofis tasarımı",
    "ev tadilatı",
  ],
  authors: [{ name: "Proje 01" }],
  creator: "Proje 01 – Egekale Group",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: SITE_URL,
    siteName: "PROJE 01",
    title: "PROJE 01 – Tadilat & Mimarlık",
    description:
      "Mimarlık, iç mimarlık ve anahtar teslim tadilat çözümleri. İzmir & Manisa.",
    images: [
      {
        url: DEFAULT_OG_PATH,
        width: 1200,
        height: 630,
        alt: "Proje 01 – Mimarlık, iç mimarlık ve anahtar teslim tadilat",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PROJE 01 – Tadilat & Mimarlık",
    description:
      "Mimarlık, iç mimarlık ve anahtar teslim tadilat çözümleri. İzmir & Manisa.",
    images: [DEFAULT_OG_PATH],
  },
  icons: {
    icon: "/favicon-32.png",
    apple: "/apple-touch-icon.png",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${inter.variable} ${interTight.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://cdn.sanity.io" />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--color-bg)] text-[var(--color-ink)]">
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { GlobalHeader } from "@/app/components/GlobalHeader";
import { REVOSONG_CORE_DESCRIPTION } from "@/lib/brand-copy";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://revosong.onokun.com";
const googleAnalyticsId =
  process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || "G-Y70ES6P0WL";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "MUSIC CHARTS - AI生成・オリジナル楽曲のランキング",
  description: `${REVOSONG_CORE_DESCRIPTION} AI生成楽曲とオリジナル楽曲を、みんなの「いいね」でランキング。YouTube、SoundCloud、Spotify対応。`,
  keywords: [
    "MUSIC CHARTS",
    "REVOSONG",
    "AI音楽",
    "AI生成楽曲",
    "音楽ランキング",
    "DTM",
    "Suno",
    "Udio",
    "ランキングサイト",
    "オリジナル楽曲",
    "応援",
    "応援ソング",
    "音楽キャンペーン",
  ],
  authors: [{ name: "おのくん", url: "https://onokun.com/" }],
  creator: "おのくん",
  publisher: "REVOSONG",
  verification: {
    google: "R_e8E9Ga3FSMDd3Z_H1SpU8hkM8lMW25IpkPWFbMAxM",
  },
  openGraph: {
    title: "MUSIC CHARTS - AI生成・オリジナル楽曲のランキング",
    description: REVOSONG_CORE_DESCRIPTION,
    type: "website",
    url: baseUrl,
    siteName: "MUSIC CHARTS",
    locale: "ja_JP",
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "MUSIC CHARTS - AI生成・オリジナル楽曲のランキング",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MUSIC CHARTS - AI生成・オリジナル楽曲のランキング",
    description: REVOSONG_CORE_DESCRIPTION,
    images: [`${baseUrl}/og-image.png`],
    creator: "@onokun_official",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${googleAnalyticsId}');
          `}
        </Script>
        <GlobalHeader />
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GlobalHeader } from "@/app/components/GlobalHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://revosong.onokun.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "MUSIC CHARTS - AI生成・オリジナル楽曲のランキング",
  description: "AI生成楽曲とオリジナル楽曲を、みんなの「いいね」でランキング。YouTube、SoundCloud、Spotify対応。誰でも無料で投稿・視聴・投票できるオープンなプラットフォーム。",
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
  ],
  authors: [{ name: "おのくん", url: "https://onokun.com/" }],
  creator: "おのくん",
  publisher: "REVOSONG",
  verification: {
    google: "R_e8E9Ga3FSMDd3Z_H1SpU8hkM8lMW25IpkPWFbMAxM",
  },
  openGraph: {
    title: "MUSIC CHARTS - AI生成・オリジナル楽曲のランキング",
    description: "AI生成楽曲とオリジナル楽曲を、みんなの「いいね」でランキング。YouTube、SoundCloud、Spotify対応。",
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
    description: "AI生成楽曲とオリジナル楽曲を、みんなの「いいね」でランキング。",
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
        <GlobalHeader />
        {children}
      </body>
    </html>
  );
}

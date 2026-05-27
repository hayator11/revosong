import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://revosong.onokun.com';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: '応援ソング殿堂入り - MUSIC CHARTS',
  description: 'MUSIC CHARTSの過去キャンペーンで受賞した応援ソング。テーマプロポーザーが選んだ心に残る楽曲を紹介。AI生成・オリジナル楽曲の応援コミュニティの歴史。',
  keywords: ['応援ソング', '殿堂入り', '受賞', 'キャンペーン', 'AI音楽'],
  openGraph: {
    title: '応援ソング殿堂入り - MUSIC CHARTS',
    description: 'MUSIC CHARTSの過去キャンペーンで受賞した応援ソング。テーマプロポーザーが選んだ心に残る楽曲を紹介。',
    type: 'website',
    url: `${baseUrl}/campaigns/awards`,
    siteName: 'MUSIC CHARTS',
    locale: 'ja_JP',
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: '応援ソング殿堂入り - MUSIC CHARTS',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '応援ソング殿堂入り - MUSIC CHARTS',
    description: 'MUSIC CHARTSの過去キャンペーンで受賞した応援ソング。テーマプロポーザーが選んだ心に残る楽曲を紹介。',
    images: [`${baseUrl}/og-image.png`],
  },
};

export default function AwardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

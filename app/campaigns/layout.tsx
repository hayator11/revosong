import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://revosong.onokun.com';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: 'キャンペーン一覧 - MUSIC CHARTS',
  description: 'AI生成・オリジナル楽曲の応援キャンペーン一覧。テーマに沿った曲を投稿して、コミュニティでランキング。応援ソング殿堂入りを目指そう。',
  keywords: ['キャンペーン', 'テーマ', '応援', 'ランキング', 'AI音楽'],
  openGraph: {
    title: 'キャンペーン一覧 - MUSIC CHARTS',
    description: 'AI生成・オリジナル楽曲の応援キャンペーン。テーマに沿った曲を投稿して、コミュニティでランキング。',
    type: 'website',
    url: `${baseUrl}/campaigns`,
    siteName: 'MUSIC CHARTS',
    locale: 'ja_JP',
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'キャンペーン一覧 - MUSIC CHARTS',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'キャンペーン一覧 - MUSIC CHARTS',
    description: 'AI生成・オリジナル楽曲の応援キャンペーン。テーマに沿った曲を投稿して、コミュニティでランキング。',
    images: [`${baseUrl}/og-image.png`],
  },
};

export default function CampaignsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

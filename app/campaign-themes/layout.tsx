import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://revosong.onokun.com';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: 'テーマ募集 - MUSIC CHARTS',
  description: '次のキャンペーンのテーマを募集中。あなたの想いや思いをテーマにして、みんなで応援できる音楽の世界を作りませんか？テーマを投稿して、新しいキャンペーンを実現しよう。',
  keywords: ['テーマ募集', 'テーマ投稿', 'キャンペーン', '応援', 'AI音楽'],
  openGraph: {
    title: 'テーマ募集 - MUSIC CHARTS',
    description: '次のキャンペーンのテーマを募集中。あなたの想いや思いをテーマにして、みんなで応援できる音楽の世界を作りませんか？',
    type: 'website',
    url: `${baseUrl}/campaign-themes`,
    siteName: 'MUSIC CHARTS',
    locale: 'ja_JP',
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'テーマ募集 - MUSIC CHARTS',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'テーマ募集 - MUSIC CHARTS',
    description: '次のキャンペーンのテーマを募集中。あなたの想いや思いをテーマにして、みんなで応援できる音楽の世界を作りませんか？',
    images: [`${baseUrl}/og-image.png`],
  },
};

export default function CampaignThemesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

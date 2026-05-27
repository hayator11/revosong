import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://revosong.onokun.com';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: 'REVOSONG キャンペーン について - MUSIC CHARTS',
  description: 'REVOSONGキャンペーンプロジェクトについて。応援の力で音楽が生まれる、参加型・共創型の音楽プロジェクト。テーマ投稿から応援ソング選出までの流れを紹介。',
  keywords: ['REVOSONG', 'キャンペーン', '応援', '共創', 'AI音楽'],
  openGraph: {
    title: 'REVOSONG キャンペーン について - MUSIC CHARTS',
    description: '応援の力で音楽が生まれる、参加型・共創型の音楽プロジェクト「REVOSONGキャンペーン」について詳しく紹介。',
    type: 'website',
    url: `${baseUrl}/campaigns/about`,
    siteName: 'MUSIC CHARTS',
    locale: 'ja_JP',
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'REVOSONG キャンペーン について - MUSIC CHARTS',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'REVOSONG キャンペーン について - MUSIC CHARTS',
    description: '応援の力で音楽が生まれる、参加型・共創型の音楽プロジェクト「REVOSONGキャンペーン」について詳しく紹介。',
    images: [`${baseUrl}/og-image.png`],
  },
};

export default function CampaignsAboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

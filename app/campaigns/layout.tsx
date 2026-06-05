import { Metadata } from 'next';
import { REVOSONG_CORE_DESCRIPTION } from '@/lib/brand-copy';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://revosong.onokun.com';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: 'REVOSONG キャンペーン | 想いを音楽に変える応援ソング企画',
  description: `${REVOSONG_CORE_DESCRIPTION} テーマに沿った曲を投稿し、コミュニティで応援を広げるキャンペーン一覧です。`,
  keywords: ['REVOSONG', 'キャンペーン', '応援ソング', 'テーマ', '応援', 'ランキング', 'AI音楽', 'オリジナル楽曲'],
  openGraph: {
    title: 'REVOSONG キャンペーン | 想いを音楽に変える応援ソング企画',
    description: `${REVOSONG_CORE_DESCRIPTION} テーマに沿った曲を投稿して、コミュニティでランキング。`,
    type: 'website',
    url: `${baseUrl}/campaigns`,
    siteName: 'MUSIC CHARTS',
    locale: 'ja_JP',
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'REVOSONG キャンペーン | 想いを音楽に変える応援ソング企画',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'REVOSONG キャンペーン | 想いを音楽に変える応援ソング企画',
    description: REVOSONG_CORE_DESCRIPTION,
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

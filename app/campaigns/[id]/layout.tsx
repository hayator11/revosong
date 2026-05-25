import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';

interface CampaignData {
  id: number;
  title: string;
  description: string;
  ogp_image_url?: string;
}

// キャンペーンデータを取得してMetadataを生成
export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const resolvedParams = await params;
  const campaignId = parseInt(resolvedParams.id);

  try {
    // キャンペーンデータを取得
    const { data: campaign } = await supabase
      .from('campaigns')
      .select('id, title, description, ogp_image_url')
      .eq('id', campaignId)
      .single();

    if (!campaign) {
      return {
        title: 'キャンペーン - REVOSONG',
        description: 'REVOSONGのキャンペーン詳細ページです',
      };
    }

    // OGP画像URL（なければAPI経由で動的生成）
    const ogpImageUrl = campaign.ogp_image_url || `/api/og/campaigns/${campaignId}`;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://revosong.onokun.com';

    return {
      title: `${campaign.title} - REVOSONG`,
      description: campaign.description || 'REVOSONGのキャンペーンに参加しよう',
      openGraph: {
        title: campaign.title,
        description: campaign.description || 'REVOSONGのキャンペーンに参加しよう',
        type: 'website',
        images: [
          {
            url: ogpImageUrl.startsWith('http') ? ogpImageUrl : `${baseUrl}${ogpImageUrl}`,
            width: 1200,
            height: 630,
            alt: campaign.title,
          },
        ],
        url: `${baseUrl}/campaigns/${campaignId}`,
      },
      twitter: {
        card: 'summary_large_image',
        title: campaign.title,
        description: campaign.description || 'REVOSONGのキャンペーンに参加しよう',
        images: [ogpImageUrl.startsWith('http') ? ogpImageUrl : `${baseUrl}${ogpImageUrl}`],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'キャンペーン - REVOSONG',
      description: 'REVOSONGのキャンペーン詳細ページです',
    };
  }
}

export default function CampaignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';

interface CampaignData {
  id: number;
  title: string;
  description: string;
  ogp_image_url?: string;
}

// サーバーサイド専用 Supabase クライアント
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  return createClient(supabaseUrl, supabaseServiceKey);
}

// キャンペーンデータを取得してMetadataを生成
export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const resolvedParams = await params;
  const campaignId = parseInt(resolvedParams.id);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://revosong.onokun.com';

  try {
    const supabase = getSupabaseClient();

    // キャンペーンデータを取得
    const { data: campaign, error } = await supabase
      .from('campaigns')
      .select('id, title, description, ogp_image_url')
      .eq('id', campaignId)
      .single();

    if (error || !campaign) {
      return {
        title: 'キャンペーン - REVOSONG',
        description: 'REVOSONGのキャンペーン詳細ページです',
      };
    }

    // OGP画像URL
    const ogpImageUrl = campaign.ogp_image_url || `/api/og/campaigns/${campaignId}`;
    const fullOgpUrl = ogpImageUrl.startsWith('http') ? ogpImageUrl : `${baseUrl}${ogpImageUrl}`;

    return {
      title: `${campaign.title} - REVOSONG`,
      description: campaign.description || 'REVOSONGのキャンペーンに参加しよう！',
      metadataBase: new URL(baseUrl),
      openGraph: {
        title: campaign.title,
        description: campaign.description || 'REVOSONGのキャンペーンに参加しよう！',
        type: 'website',
        images: [
          {
            url: fullOgpUrl,
            width: 1200,
            height: 630,
            alt: campaign.title,
          },
        ],
        url: `/campaigns/${campaignId}`,
      },
      twitter: {
        card: 'summary_large_image',
        title: campaign.title,
        description: campaign.description || 'REVOSONGのキャンペーンに参加しよう！',
        images: [fullOgpUrl],
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

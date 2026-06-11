import type { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://revosong.onokun.com'

// サーバーサイド専用 Supabase クライアント
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(supabaseUrl, supabaseServiceKey)
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticUrls = [
    '',
    '/campaigns',
    '/campaigns/awards',
    '/campaigns/about',
    '/campaign-themes',
    '/campaign-themes/apply',
    '/campaign-themes/submit',
    '/playlists',
    '/about',
    '/information',
    '/services',
  ]

  const staticPages: MetadataRoute.Sitemap = staticUrls.map((path) => ({
    url: `${BASE_URL}${path}`,
  }))

  try {
    const supabase = getSupabaseClient()

    // 公開キャンペーンデータを取得（開催中・過去の詳細ページを含める）
    const { data: campaigns } = await supabase
      .from('campaigns')
      .select('id, updated_at')
      .order('updated_at', { ascending: false })
      .limit(1000)

    // 動的ページ: キャンペーン詳細
    const campaignPages: MetadataRoute.Sitemap = (campaigns || []).map((campaign) => ({
      url: `${BASE_URL}/campaigns/${campaign.id}`,
      ...(campaign.updated_at ? { lastModified: new Date(campaign.updated_at) } : {}),
    }))

    return [...staticPages, ...campaignPages]
  } catch (error) {
    console.error('Error generating sitemap:', error)

    // フォールバック: エラー時は静的ページのみ
    return staticPages
  }
}

import type { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://revosong.onokun.com'

// サーバーサイド専用 Supabase クライアント
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(supabaseUrl, supabaseServiceKey)
}

function getStaticPages(): MetadataRoute.Sitemap {
  const now = new Date()

  return [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/campaigns`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/campaign-themes`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/campaigns/awards`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/campaigns/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/campaign-themes/apply`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/campaign-themes/submit`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/playlists`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/information`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/services`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = getStaticPages()

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

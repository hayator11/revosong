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
  try {
    const supabase = getSupabaseClient()

    // キャンペーンデータを取得
    const { data: campaigns } = await supabase
      .from('campaigns')
      .select('id, updated_at')
      .eq('is_active', true)
      .limit(1000)

    // テーマデータを取得
    const { data: themes } = await supabase
      .from('campaign_themes')
      .select('id, updated_at')
      .eq('status', 'approved')
      .limit(500)

    // 静的ページ
    const staticPages: MetadataRoute.Sitemap = [
      {
        url: BASE_URL,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${BASE_URL}/campaigns`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${BASE_URL}/campaigns/awards`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${BASE_URL}/campaigns/about`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      },
      {
        url: `${BASE_URL}/campaign-themes`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${BASE_URL}/campaign-themes/apply`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      },
      {
        url: `${BASE_URL}/campaign-themes/submit`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      },
      {
        url: `${BASE_URL}/about`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      },
      {
        url: `${BASE_URL}/information`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      },
      {
        url: `${BASE_URL}/services`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      },
    ]

    // 動的ページ: キャンペーン詳細
    const campaignPages: MetadataRoute.Sitemap = (campaigns || []).map((campaign) => ({
      url: `${BASE_URL}/campaigns/${campaign.id}`,
      lastModified: campaign.updated_at ? new Date(campaign.updated_at) : new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }))

    // 動的ページ: キャンペーンテーマ詳細（該当ページがあれば）
    const themePages: MetadataRoute.Sitemap = (themes || []).map((theme) => ({
      url: `${BASE_URL}/campaign-themes/${theme.id}`,
      lastModified: theme.updated_at ? new Date(theme.updated_at) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))

    return [...staticPages, ...campaignPages, ...themePages]
  } catch (error) {
    console.error('Error generating sitemap:', error)

    // フォールバック: エラー時は静的ページのみ
    return [
      {
        url: BASE_URL,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${BASE_URL}/campaigns`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${BASE_URL}/campaign-themes`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${BASE_URL}/about`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      },
    ]
  }
}

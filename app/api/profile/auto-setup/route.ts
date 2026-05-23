import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { userId, email, snsData } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    // Service role key でクライアント作成（RLS 回避）
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    )

    const profileData: any = {
      id: userId,
      email: email,
    }

    // SNS データを追加
    if (snsData) {
      if (snsData.twitter_url) profileData.twitter_url = snsData.twitter_url
      if (snsData.github_url) profileData.github_url = snsData.github_url
      if (snsData.discord_url) profileData.discord_url = snsData.discord_url
    }

    console.log('Creating/updating profile via API:', profileData)

    const { data, error } = await supabase
      .from('profiles')
      .upsert(profileData, { onConflict: 'id' })
      .select()

    if (error) {
      console.error('Profile upsert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('Profile created/updated successfully:', data)
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

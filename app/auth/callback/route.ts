import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const provider = requestUrl.searchParams.get('provider')

  if (code) {
    // Supabase クライアントを初期化
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    )

    try {
      // OAuth コードをセッションに交換
      const { data: { session }, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)

      if (sessionError || !session?.user) {
        console.error('Session exchange error:', {
          message: sessionError?.message,
          code: sessionError?.code,
          fullError: sessionError,
          session: session
        })
        return NextResponse.redirect(new URL('/auth/error', requestUrl.origin))
      }

      const user = session.user

      // プロフィール情報を更新（SNS URL を自動抽出）
      try {
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        let snsUpdate: Record<string, string> = {}

        // ユーザーメタデータから SNS 情報を抽出
        if (user.user_metadata) {
          const handle = user.user_metadata.user_name || user.user_metadata.preferred_username

          if (provider === 'x' || user.identities?.some((i: any) => i.provider === 'twitter')) {
            if (handle) {
              snsUpdate.twitter_url = `https://twitter.com/${handle}`
            }
          } else if (provider === 'github' || user.identities?.some((i: any) => i.provider === 'github')) {
            if (handle) {
              snsUpdate.github_url = `https://github.com/${handle}`
            }
          } else if (provider === 'discord' || user.identities?.some((i: any) => i.provider === 'discord')) {
            const discordId = user.user_metadata.sub
            if (discordId) {
              snsUpdate.discord_url = `https://discord.com/users/${discordId}`
            }
          }
        }

        if (existingProfile) {
          // プロフィール更新
          if (Object.keys(snsUpdate).length > 0) {
            await supabase
              .from('profiles')
              .update({
                ...snsUpdate,
                updated_at: new Date().toISOString(),
              })
              .eq('id', user.id)
          }
        } else {
          // プロフィール作成
          await supabase
            .from('profiles')
            .insert({
              id: user.id,
              email: user.email,
              ...snsUpdate,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
        }
      } catch (profileError: any) {
        console.error('Profile update error:', {
          message: profileError?.message,
          fullError: profileError
        })
        // プロフィール更新失敗は致命的ではない
      }

      // プロフィールページにリダイレクト
      return NextResponse.redirect(new URL('/profile', requestUrl.origin))
    } catch (error) {
      console.error('OAuth error:', error)
      return NextResponse.redirect(new URL('/auth/error', requestUrl.origin))
    }
  }

  // コードがない場合はホームページにリダイレクト
  return NextResponse.redirect(new URL('/', requestUrl.origin))
}

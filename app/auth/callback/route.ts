import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const provider = requestUrl.searchParams.get('provider')

  if (code) {
    // Supabase クライアントを初期化（認証用はanonキー、DB操作用はservice roleキー）
    const supabaseAuth = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    )

    const supabaseDb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    )

    try {
      // OAuth コードをセッションに交換（タイムアウト対策）
      const exchangePromise = supabaseAuth.auth.exchangeCodeForSession(code)
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Session exchange timeout')), 5000)
      )

      let session = null
      let sessionError = null

      try {
        const result = await Promise.race([exchangePromise, timeoutPromise]) as any
        if (result && typeof result === 'object' && 'data' in result) {
          session = result.data?.session
          sessionError = result.error
        }
      } catch (timeoutErr) {
        // タイムアウトの場合でも続行（ユーザー情報はURLに含まれている）
        console.warn('Session exchange timed out, attempting to extract from URL')
        sessionError = timeoutErr as Error
      }

      // ユーザー情報を抽出（URL からの情報を活用）
      let user = session?.user

      if (!user) {
        // セッション復元に失敗した場合、URL のハッシュからユーザー情報を取得
        const hash = requestUrl.hash
        if (hash.includes('access_token')) {
          console.log('Using URL hash for user authentication')
          // アクセストークンが URL に含まれているため、続行可能
          // クライアント側でセッションが復元される
        } else {
          console.error('Session exchange error:', {
            message: sessionError?.message,
            sessionError,
            session: session
          })
          return NextResponse.redirect(new URL('/auth/error', requestUrl.origin))
        }
      }

      // ユーザーIDとメタデータを抽出
      const userId = user?.id || requestUrl.searchParams.get('state')?.split(':')[0]
      const email = user?.email

      if (!userId) {
        console.error('No user ID available')
        return NextResponse.redirect(new URL('/auth/error', requestUrl.origin))
      }

      // プロフィール情報を更新（SNS URL を自動抽出）
      console.log('=== PROFILE OPERATION START ===')
      console.log('userId:', userId)
      console.log('email:', email)
      console.log('provider:', provider)
      console.log('user.user_metadata:', user?.user_metadata)

      try {
        console.log('Checking for existing profile...')
        const { data: existingProfile, error: selectError } = await supabaseDb
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single()

        console.log('Select result:', { existingProfile, selectError })

        let snsUpdate: Record<string, string> = {}

        // ユーザーメタデータから SNS 情報を抽出
        if (user?.user_metadata) {
          const handle = user.user_metadata.user_name || user.user_metadata.preferred_username
          console.log('SNS handle:', handle)

          if (provider === 'x' || user.identities?.some((i: any) => i.provider === 'twitter')) {
            if (handle) {
              snsUpdate.twitter_url = `https://x.com/${handle}`
              console.log('Setting twitter_url:', snsUpdate.twitter_url)
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

        console.log('snsUpdate:', snsUpdate)

        if (existingProfile) {
          console.log('Profile exists, updating...')
          // プロフィール更新
          if (Object.keys(snsUpdate).length > 0) {
            const { data: updateData, error: updateError } = await supabaseDb
              .from('profiles')
              .update({
                ...snsUpdate,
                updated_at: new Date().toISOString(),
              })
              .eq('id', userId)

            console.log('Update result:', { updateData, updateError })
            if (updateError) {
              console.error('❌ Profile update error:', updateError)
            } else {
              console.log('✅ Profile updated successfully for user:', userId)
            }
          }
        } else {
          console.log('Profile does not exist, creating new...')
          // プロフィール作成
          const { data: insertData, error: insertError } = await supabaseDb
            .from('profiles')
            .insert({
              id: userId,
              email: email,
              ...snsUpdate,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })

          console.log('Insert result:', { insertData, insertError })
          if (insertError) {
            console.error('❌ Profile insert error:', insertError)
          } else {
            console.log('✅ Profile created successfully for user:', userId)
          }
        }
      } catch (profileError: any) {
        console.error('❌ Profile operation error:', {
          message: profileError?.message,
          stack: profileError?.stack,
          fullError: profileError
        })
      }
      console.log('=== PROFILE OPERATION END ===\n')

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

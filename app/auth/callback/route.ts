import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const error_description = searchParams.get('error_description')

  // エラーハンドリング
  if (error || error_description) {
    console.error('OAuth Error:', error, error_description)
    return NextResponse.redirect(
      new URL(`/?error=${encodeURIComponent(error || 'unknown_error')}&error_description=${encodeURIComponent(error_description || '')}`, request.url)
    )
  }

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    try {
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

      if (exchangeError) {
        console.error('Exchange Error:', exchangeError)
        return NextResponse.redirect(
          new URL(`/?error=${encodeURIComponent(exchangeError.message)}`, request.url)
        )
      }

      // 認証成功 - ホームページにリダイレクト
      return NextResponse.redirect(new URL('/', request.url))
    } catch (err) {
      console.error('Callback Error:', err)
      return NextResponse.redirect(
        new URL('/?error=callback_error', request.url)
      )
    }
  }

  // コードなし
  return NextResponse.redirect(new URL('/?error=no_code', request.url))
}

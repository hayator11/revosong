import { NextResponse } from 'next/server'

export async function GET() {
  // Supabase OAuth はクライアント側で自動的に処理されるため、
  // このルートは単にホームページにリダイレクトします
  return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'))
}

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const adminPassword = process.env.ADMIN_PASSWORD ?? 'armacorpsol'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (typeof body.password !== 'string' || body.password !== adminPassword) {
      return NextResponse.json({ error: 'Invalid admin password.' }, { status: 401 })
    }

    if (body.action === 'unlock') {
      return NextResponse.json({ ok: true })
    }

    const token = body.token
    if (!token || typeof token !== 'object') {
      return NextResponse.json({ error: 'Token details are required.' }, { status: 400 })
    }

    const tokenAddress = String(token.token_address ?? '').trim()
    const tokenName = String(token.token_name ?? '').trim()
    const tokenSymbol = String(token.token_symbol ?? '').trim().toUpperCase()
    const creatorHandle = String(token.creator_handle ?? '').trim().replace(/^@/, '')
    const logoUri = String(token.logo_uri ?? '').trim() || null

    if (!/^0x[a-fA-F0-9]{40}$/.test(tokenAddress) || !tokenName || !tokenSymbol || !creatorHandle) {
      return NextResponse.json({ error: 'Enter a valid contract address and complete token details.' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } },
    )

    const { error } = await supabase.from('token_registry').upsert({
      token_address: tokenAddress,
      token_name: tokenName,
      token_symbol: tokenSymbol,
      creator_handle: creatorHandle,
      logo_uri: logoUri,
    }, { onConflict: 'token_address' })

    if (error) {
      return NextResponse.json({ error: 'Could not save token.' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }
}

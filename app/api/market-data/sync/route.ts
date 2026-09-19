import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const maxDuration = 60

const API_BASE = 'https://api.geckoterminal.com/api/v2'
const NETWORK = process.env.GECKOTERMINAL_NETWORK ?? 'robinhood-chain'
const RETRIES = 3

type Pool = {
  id?: string
  attributes?: {
    base_token_price_usd?: string | null
    base_token_price_native_currency?: string | null
    market_cap_usd?: string | null
    fdv_usd?: string | null
    reserve_in_usd?: string | null
    volume_usd?: { h24?: string | null }
    price_change_percentage?: { h24?: string | null }
  }
}

async function fetchWithRetry(url: string) {
  let lastError = 'Market-data provider request failed.'
  for (let attempt = 0; attempt < RETRIES; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { accept: 'application/json' },
        next: { revalidate: 0 },
      })
      if (response.ok) return await response.json() as { data?: Pool[] }
      lastError = `Provider returned ${response.status}.`
      if (response.status !== 429 && response.status < 500) break
    } catch (error) {
      lastError = error instanceof Error ? error.message : lastError
    }
    await new Promise((resolve) => setTimeout(resolve, 500 * 2 ** attempt))
  }
  throw new Error(lastError)
}

function numberOrZero(value: string | null | undefined) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && request.headers.get('authorization') !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = getSupabaseServerClient()
  const [{ data: launches, error: launchesError }, { data: registered, error: registeredError }] = await Promise.all([
    supabase.from('launches').select('token_address, token_symbol').not('token_address', 'is', null),
    supabase.from('token_registry').select('token_address, token_symbol').not('token_address', 'is', null),
  ])
  if (launchesError || registeredError) {
    return NextResponse.json({ error: launchesError?.message ?? registeredError?.message }, { status: 500 })
  }

  const tokens = new Map<string, string>()
  for (const token of [...(launches ?? []), ...(registered ?? [])]) {
    if (token.token_address) tokens.set(token.token_address.toLowerCase(), token.token_symbol)
  }

  const results: Array<{ address: string; status: 'synced' | 'failed'; error?: string }> = []
  for (const [address, symbol] of tokens) {
    try {
      const payload = await fetchWithRetry(`${API_BASE}/networks/${NETWORK}/tokens/${address}/pools`)
      const pool = (payload.data ?? []).sort((a, b) => numberOrZero(b.attributes?.reserve_in_usd) - numberOrZero(a.attributes?.reserve_in_usd))[0]
      if (!pool?.attributes) throw new Error('No indexed liquidity pool found.')
      const attributes = pool.attributes
      const { error } = await supabase.from('market_data').upsert({
        token_symbol: symbol,
        token_address: address,
        pool_address: pool.id?.split('_')[1] ?? null,
        market_cap_native: numberOrZero(attributes.market_cap_usd || attributes.fdv_usd),
        volume_24h_native: numberOrZero(attributes.volume_usd?.h24),
        price_native: numberOrZero(attributes.base_token_price_native_currency || attributes.base_token_price_usd),
        liquidity_native: numberOrZero(attributes.reserve_in_usd),
        price_change_24h: numberOrZero(attributes.price_change_percentage?.h24),
        source: `GeckoTerminal/${NETWORK}`,
        synced_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'token_symbol' })
      if (error) throw new Error(error.message)
      results.push({ address, status: 'synced' })
    } catch (error) {
      results.push({ address, status: 'failed', error: error instanceof Error ? error.message : 'Sync failed.' })
    }
  }

  return NextResponse.json({ network: NETWORK, synced: results.filter((result) => result.status === 'synced').length, results })
}

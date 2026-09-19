import { createClient } from '@supabase/supabase-js'

let browserClient: ReturnType<typeof createClient> | undefined

export function getSupabaseBrowserClient() {
  if (!browserClient) {
    browserClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
  }

  return browserClient
}

export type LaunchRecord = {
  id: string
  tx_hash: string
  wallet_address: string
  creator_handle: string
  token_name: string
  token_symbol: string
  description: string | null
  logo_uri: string
  website: string | null
  x_url: string | null
  chain_id: string
  status: 'submitted' | 'confirmed' | 'failed'
  created_at: string
}

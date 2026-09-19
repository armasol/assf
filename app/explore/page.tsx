import { getSupabaseServerClient } from '@/lib/supabase/server';
import { ExploreClient, type Token } from './ExploreClient';

export default async function ExplorePage() {
  const { data: launches, error } = await getSupabaseServerClient()
    .from('launches')
    .select('id, token_name, token_symbol, creator_handle, logo_uri, status, created_at')
    .order('created_at', { ascending: false });

  if (error) console.error('[v0] Could not load explore launches:', error.message);

  const tokens: Token[] = (launches ?? []).map((launch, index) => ({
    rank: index + 1,
    ticker: `$${launch.token_symbol}`,
    name: launch.token_name,
    creator: launch.creator_handle,
    marketCap: 'Unavailable',
    volume: launch.status,
    change: new Date(launch.created_at).toLocaleDateString(),
    art: launch.logo_uri || launch.token_symbol.slice(0, 2).toUpperCase(),
  }));

  return <ExploreClient tokens={tokens} />;
}

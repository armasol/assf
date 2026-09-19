import { getSupabaseServerClient } from '@/lib/supabase/server';
import { ExploreClient, type Token } from './ExploreClient';

export default async function ExplorePage() {
  const supabase = getSupabaseServerClient();
  const [{ data: launches, error: launchError }, { data: trades, error: tradeError }, { data: marketRows, error: marketError }] = await Promise.all([
    supabase.from('launches').select('id, token_name, token_symbol, creator_handle, logo_uri, status, created_at').order('created_at', { ascending: false }),
    supabase.from('trade_ledger').select('quantity, price_native').gte('occurred_at', new Date(Date.now() - 86400000).toISOString()),
    supabase.from('market_data').select('token_symbol, price_change_24h').order('price_change_24h', { ascending: false }).limit(1),
  ]);

  if (launchError) console.error('[v0] Could not load explore launches:', launchError.message);
  if (tradeError) console.error('[v0] Could not load explore trades:', tradeError.message);
  if (marketError) console.error('[v0] Could not load explore market data:', marketError.message);

  const tradeVolume = (trades ?? []).reduce((sum, trade) => sum + Number(trade.quantity) * Number(trade.price_native), 0);
  const topMarket = marketRows?.[0];
  const topMover = topMarket ? `${Number(topMarket.price_change_24h).toFixed(2)}%` : '0.00%';
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

  return <ExploreClient tokens={tokens} tradeVolume={`${tradeVolume.toFixed(4)} RBH`} topMover={topMover} />;
}

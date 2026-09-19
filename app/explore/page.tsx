import { getSupabaseServerClient } from '@/lib/supabase/server';
import { ExploreClient, type Token } from './ExploreClient';

export default async function ExplorePage() {
  const supabase = getSupabaseServerClient();
  const [{ data: launches, error: launchError }, { data: registeredTokens, error: registryError }, { data: trades, error: tradeError }, { data: marketRows, error: marketError }] = await Promise.all([
    supabase.from('launches').select('id, token_name, token_symbol, creator_handle, logo_uri, token_address, status, created_at').order('created_at', { ascending: false }),
    supabase.from('token_registry').select('token_name, token_symbol, creator_handle, logo_uri, token_address, created_at').order('created_at', { ascending: false }),
    supabase.from('trade_ledger').select('quantity, price_native').gte('occurred_at', new Date(Date.now() - 86400000).toISOString()),
    supabase.from('market_data').select('token_symbol, token_address, market_cap_native, volume_24h_native, price_native, liquidity_native, price_change_24h, synced_at').order('price_change_24h', { ascending: false }),
  ]);

  if (launchError) console.error('[v0] Could not load explore launches:', launchError.message);
  if (registryError) console.error('[v0] Could not load registered tokens:', registryError.message);
  if (tradeError) console.error('[v0] Could not load explore trades:', tradeError.message);
  if (marketError) console.error('[v0] Could not load explore market data:', marketError.message);

  const tradeVolume = (trades ?? []).reduce((sum, trade) => sum + Number(trade.quantity) * Number(trade.price_native), 0);
  const marketByAddress = new Map((marketRows ?? []).filter((row) => row.token_address).map((row) => [row.token_address!.toLowerCase(), row]));
  const topMarket = marketRows?.[0];
  const topMover = topMarket ? `${Number(topMarket.price_change_24h).toFixed(2)}%` : '0.00%';
  const tokens: Token[] = [...(launches ?? []).map((launch) => {
    const market = launch.token_address ? marketByAddress.get(launch.token_address.toLowerCase()) : undefined;
    return {
      ticker: `$${launch.token_symbol}`,
      name: launch.token_name,
      creator: launch.creator_handle,
      marketCap: market ? `${Number(market.market_cap_native).toFixed(2)} USD` : 'Not priced',
      volume: market ? `${Number(market.volume_24h_native).toFixed(2)} USD` : (launch.status || 'Recorded'),
      change: market ? `${Number(market.price_change_24h).toFixed(2)}%` : new Date(launch.created_at).toLocaleDateString(),
      art: launch.logo_uri || launch.token_symbol.slice(0, 2).toUpperCase(),
      tokenAddress: launch.token_address ?? undefined,
    };
  }), ...(registeredTokens ?? []).map((token) => {
    const market = marketByAddress.get(token.token_address.toLowerCase());
    return {
      ticker: `$${token.token_symbol}`,
      name: token.token_name,
      creator: token.creator_handle,
      marketCap: market ? `${Number(market.market_cap_native).toFixed(2)} USD` : 'Not priced',
      volume: market ? `${Number(market.volume_24h_native).toFixed(2)} USD` : 'Verified',
      change: market ? `${Number(market.price_change_24h).toFixed(2)}%` : new Date(token.created_at).toLocaleDateString(),
      art: token.logo_uri || token.token_symbol.slice(0, 2).toUpperCase(),
      tokenAddress: token.token_address,
    };
  })].map((token, index) => ({ ...token, rank: index + 1 }));

  return <ExploreClient tokens={tokens} tradeVolume={`${tradeVolume.toFixed(4)} RBH`} topMover={topMover} />;
}

'use client';

import { useMemo, useState } from 'react';
import { Reveal } from '@/components/Reveal';
import { PageHeader, StatCard, TokenCard } from '@/components/ui';
import { SearchIcon } from '@/components/icons';

type Token = {
  rank: number;
  ticker: string;
  name: string;
  creator: string;
  marketCap: string;
  volume: string;
  change: string;
  art: string;
};

export function ExploreClient({ tokens, tradeVolume, topMover }: { tokens: Token[]; tradeVolume: string; topMover: string }) {
  const [sort, setSort] = useState<'Newest'>('Newest');
  const [q, setQ] = useState('');
  const filtered = useMemo(() => tokens.filter((token) =>
    `${token.ticker} ${token.name} ${token.creator}`.toLowerCase().includes(q.toLowerCase()),
  ), [q, tokens]);
  const topToken = tokens[0];

  return <div className="page-wrap content-page">
    <Reveal><PageHeader title="Explore" description="Creator-linked tokens launched on Pons for Twitch communities." /></Reveal>
    {topToken ? <Reveal delay={60}><div className="feature-market interactive-card"><div className="feature-token-art">{topToken.art}</div><div className="feature-copy"><span className="hot-label">● LATEST LAUNCH</span><h2>{topToken.ticker} <small>{topToken.name}</small></h2><p>creator-linked <b>@{topToken.creator}</b></p></div><div className="feature-stats"><div><span>STATUS</span><strong>{topToken.volume}</strong></div><div><span>LAUNCHED</span><strong>On-chain</strong></div><div><span>ACTIVITY</span><strong>{topToken.change}</strong></div></div></div></Reveal> : <Reveal delay={60}><div className="empty-state">No launches have been recorded yet.</div></Reveal>}
    <Reveal><div className="stats-grid four"><StatCard label="TOKENS ON PONS" value={String(tokens.length)} note="from Supabase"/><StatCard label="CREATORS LINKED" value={String(new Set(tokens.map((token) => token.creator)).size)} note="from recorded launches"/><StatCard label="TRADE VOLUME" value={tradeVolume} note="24h from trade ledger" accent/><StatCard label="TOP MOVER" value={topMover} note="market data snapshot"/></div></Reveal>
    <Reveal><div className="toolbar"><div className="segmented"><button className={sort === 'Newest' ? 'active' : ''} onClick={() => setSort('Newest')}>Newest</button></div><label className="inline-search"><SearchIcon size={18}/><input value={q} onChange={(event) => setQ(event.target.value)} placeholder="Search tokens or @handles"/></label></div></Reveal>
    <Reveal><div className="token-grid four explore-grid">{filtered.map((token) => <TokenCard key={`${token.ticker}-${token.rank}`} token={token}/>)}</div>{tokens.length === 0 ? <div className="empty-state">No tokens match because no launch records exist yet.</div> : filtered.length === 0 ? <div className="empty-state">No tokens match your search.</div> : null}</Reveal>
  </div>;
}

export type { Token };

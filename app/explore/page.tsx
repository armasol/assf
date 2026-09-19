'use client';

import { useMemo, useState } from 'react';
import { Reveal } from '@/components/Reveal';
import { PageHeader, StatCard, TokenCard } from '@/components/ui';
import { SearchIcon, TwitchIcon } from '@/components/icons';
import { tokens } from '@/lib/data';

export default function ExplorePage() {
  const [sort, setSort] = useState<'Market cap'|'Volume'|'Newest'>('Market cap');
  const [q, setQ] = useState('');
  const filtered = useMemo(() => tokens.filter(t => `${t.ticker} ${t.name} ${t.creator}`.toLowerCase().includes(q.toLowerCase())), [q]);
  return <div className="page-wrap content-page">
    <Reveal><PageHeader title="Explore" description="Creator-linked tokens launched on Pons for Twitch communities." /></Reveal>
    <Reveal delay={60}><div className="feature-market interactive-card"><div className="feature-token-art">KC</div><div className="feature-copy"><span className="hot-label">● MOST TRADED TODAY</span><h2>$KAI <small>Kai Coin</small></h2><p><TwitchIcon size={18}/>tips <b>@kaicenat</b></p></div><div className="feature-stats"><div><span>MARKET CAP</span><strong>$28.6K</strong></div><div><span>VOLUME 24H</span><strong>$334K</strong></div><div><span>24H</span><strong className="up">+35.5%</strong></div></div></div></Reveal>
    <Reveal><div className="stats-grid four"><StatCard label="TOKENS ON PONS" value="169" note="creator-linked"/><StatCard label="TWITCH CREATORS" value="122" note="linked channels"/><StatCard label="VOLUME, 24H" value="$2.97M" note="across tracked tokens" accent/><StatCard label="TOP MOVER" value="$KAI" note="+35.5% in 24h"/></div></Reveal>
    <Reveal><div className="toolbar"><div className="segmented">{(['Volume','Market cap','Newest'] as const).map(s=><button key={s} className={sort===s?'active':''} onClick={()=>setSort(s)}>{s}</button>)}</div><label className="inline-search"><SearchIcon size={18}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search tokens or @handles"/></label></div></Reveal>
    <Reveal><div className="token-grid four explore-grid">{filtered.map(t => <TokenCard key={t.ticker} token={t}/>)}</div>{filtered.length===0 && <div className="empty-state">No tokens match your search.</div>}</Reveal>
  </div>;
}

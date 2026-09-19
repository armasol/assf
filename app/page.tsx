import Link from 'next/link';
import { creators } from '@/lib/data';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { Reveal } from '@/components/Reveal';
import { SectionTitle, TokenCard } from '@/components/ui';
import { ArrowIcon, CheckIcon, GiftIcon, RocketIcon, SparkIcon, TwitchIcon } from '@/components/icons';

export default async function HomePage() {
  const { data: launches, error } = await getSupabaseServerClient()
    .from('launches')
    .select('id, tx_hash, creator_handle, token_name, token_symbol, description, logo_uri, status, created_at')
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) console.error('[v0] Could not load launch stats:', error.message);

  const liveTokens = (launches ?? []).map((launch, index) => ({
    rank: index + 1,
    ticker: `$${launch.token_symbol}`,
    name: launch.token_name,
    creator: launch.creator_handle,
    marketCap: 'On-chain',
    volume: launch.status,
    change: 'Submitted',
    art: launch.logo_uri,
  }));
  const displayedReceipts = (launches ?? []).slice(0, 6).map((launch) => ({
    id: launch.id.slice(0, 8).toUpperCase(),
    handle: `@${launch.creator_handle}`,
    amount: launch.status,
    time: new Date(launch.created_at).toLocaleDateString(),
    lifetime: launch.token_symbol,
  }));

  return <div className="home-page page-wrap">
    <section className="hero">
      <Reveal>
        <div className="hero-badge"><span className="pulse-dot"/>Built for Twitch communities · on Robinhood Chain</div>
        <h1>Route token fees<br/>to any <span className="twitch-word"><TwitchIcon size={50}/>Twitch</span> creator.</h1>
        <p>Launch a creator-linked token on Pons. Pick a Twitch channel, create the coin, and route creator fees to the person behind the stream.</p>
        <div className="hero-actions"><Link className="button primary" href="/launch">Launch a token<RocketIcon size={18}/></Link><Link className="button ghost" href="/docs">Read the docs<ArrowIcon size={18}/></Link></div>
      </Reveal>

      <Reveal delay={100} className="hero-board-wrap">
        <div className="hero-board">
          <div className="hero-live-card">
            <div className="stream-screen"><div className="stream-glow"/><div className="live-pill">LIVE</div><div className="stream-center"><TwitchIcon size={46}/><strong>KAICENAT</strong><span>Just Chatting · 82.4K viewers</span></div><div className="chat-stack"><span>W stream</span><span>launch it 👀</span><span>PONS!</span></div></div>
            <div className="stream-foot"><div><strong>Kai Cenat</strong><span>@kaicenat</span></div><button>Open <ArrowIcon size={14}/></button></div>
          </div>
<div className="hero-fees-card">
  <div className="mini-label">CREATOR FEES ROUTED</div><strong className="big-number">No ledger data</strong><p className="muted">Fees appear here after recorded payments.</p>
  </div>
          <div className="hero-route-card">
            <div className="mini-label">FEES ROUTE TO</div><div className="route-search">@kaicenat</div><div className="profile-pill"><div className="avatar">KC</div><div><strong>Kai Cenat</strong><span>@kaicenat</span></div><TwitchIcon size={18}/></div><div className="route-ok"><CheckIcon size={16}/>Creator linked on Twitch</div>
          </div>
          <div className="hero-how-card"><div className="mini-label">HOW IT WORKS</div><ol><li><span>1</span>Pick a Twitch creator</li><li><span>2</span>Launch on Pons</li><li><span>3</span>Route creator fees</li></ol></div>
        </div>
      </Reveal>
    </section>

    <Reveal><section className="home-section"><SectionTitle title="Top tokens" link="Explore all"/><div className="token-grid four">{liveTokens.length ? liveTokens.slice(0,4).map(t => <TokenCard key={t.ticker} token={t}/>) : <p className="empty-state">No launches yet. Be the first to launch a token.</p>}</div></section></Reveal>

    <Reveal><section className="split-section home-section">
      <div><SectionTitle title="Top Twitch creators" link="View all" href="/analytics"/><div className="creator-list">{creators.slice(0,4).map((c,i)=><div className="creator-item" key={c.handle}><span className="creator-rank">{i+1}</span><div className="avatar">{c.initials}</div><div className="creator-main"><strong>{c.name}</strong><span>@{c.handle} · {c.followers} followers</span></div><div className="creator-fee"><strong>—</strong><span>no fee ledger</span></div></div>)}</div></div>
      <div><SectionTitle title="Recent creator fees" link="Payments" href="/payments"/><div className="receipt-list compact">{displayedReceipts.length ? displayedReceipts.slice(0,4).map(r=><div className="receipt-row" key={r.id}><div className="gift-icon"><GiftIcon size={17}/></div><div><strong>{r.handle}</strong><span>{r.time}</span></div><strong>{r.amount}</strong></div>) : <p className="empty-state">No fee activity recorded yet.</p>}</div></div>
    </section></Reveal>

    <Reveal><section className="cta-band"><div className="cta-glow"/><div><div className="eyebrow"><SparkIcon size={14}/>CREATOR-LINKED BY DEFAULT</div><h2>A launchpad built around the streamer.</h2><p>Keep the flow simple: pick the creator, build the token, launch it on Pons.</p></div><Link href="/launch" className="button light">Start a launch<ArrowIcon size={18}/></Link></section></Reveal>
  </div>;
}

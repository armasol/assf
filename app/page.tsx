import Link from 'next/link';
import { creators, receipts, tokens } from '@/lib/data';
import { Reveal } from '@/components/Reveal';
import { SectionTitle, TokenCard } from '@/components/ui';
import { ArrowIcon, CheckIcon, GiftIcon, RocketIcon, SparkIcon, TwitchIcon } from '@/components/icons';

export default function HomePage() {
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
            <div className="mini-label">CREATOR FEES ROUTED</div><strong className="big-number">$12,884.42</strong><div className="chart"><span style={{height:'26%'}}/><span style={{height:'34%'}}/><span style={{height:'30%'}}/><span style={{height:'42%'}}/><span style={{height:'38%'}}/><span style={{height:'54%'}}/><span style={{height:'61%'}}/><span style={{height:'76%'}}/><span style={{height:'94%'}}/></div><div className="chart-foot"><span>24h activity</span><span className="up">+18.4%</span></div>
          </div>
          <div className="hero-route-card">
            <div className="mini-label">FEES ROUTE TO</div><div className="route-search">@kaicenat</div><div className="profile-pill"><div className="avatar">KC</div><div><strong>Kai Cenat</strong><span>@kaicenat</span></div><TwitchIcon size={18}/></div><div className="route-ok"><CheckIcon size={16}/>Creator linked on Twitch</div>
          </div>
          <div className="hero-how-card"><div className="mini-label">HOW IT WORKS</div><ol><li><span>1</span>Pick a Twitch creator</li><li><span>2</span>Launch on Pons</li><li><span>3</span>Route creator fees</li></ol></div>
        </div>
      </Reveal>
    </section>

    <Reveal><section className="home-section"><SectionTitle title="Top tokens" link="Explore all"/><div className="token-grid four">{tokens.slice(0,4).map(t => <TokenCard key={t.ticker} token={t}/>)}</div></section></Reveal>

    <Reveal><section className="split-section home-section">
      <div><SectionTitle title="Top Twitch creators" link="View all" href="/analytics"/><div className="creator-list">{creators.slice(0,4).map((c,i)=><div className="creator-item" key={c.handle}><span className="creator-rank">{i+1}</span><div className="avatar">{c.initials}</div><div className="creator-main"><strong>{c.name}</strong><span>@{c.handle} · {c.followers} followers</span></div><div className="creator-fee"><strong>{c.fees}</strong><span>fees</span></div></div>)}</div></div>
      <div><SectionTitle title="Recent creator fees" link="Payments" href="/payments"/><div className="receipt-list compact">{receipts.slice(0,4).map(r=><div className="receipt-row" key={r.id}><div className="gift-icon"><GiftIcon size={17}/></div><div><strong>{r.handle}</strong><span>{r.time}</span></div><strong>{r.amount}</strong></div>)}</div></div>
    </section></Reveal>

    <Reveal><section className="cta-band"><div className="cta-glow"/><div><div className="eyebrow"><SparkIcon size={14}/>CREATOR-LINKED BY DEFAULT</div><h2>A launchpad built around the streamer.</h2><p>Keep the flow simple: pick the creator, build the token, launch it on Pons.</p></div><Link href="/launch" className="button light">Start a launch<ArrowIcon size={18}/></Link></section></Reveal>
  </div>;
}

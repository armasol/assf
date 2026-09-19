import { Reveal } from '@/components/Reveal';
import { PageHeader, StatCard } from '@/components/ui';
import { creators } from '@/lib/data';
import { GiftIcon } from '@/components/icons';

export default function AnalyticsPage() {
  const bars = ['100%','72%','58%','47%','36%'];
  return <div className="page-wrap content-page">
    <Reveal><PageHeader title="Analytics" description="A clean view of launch activity, creator routing, and Twitch-linked tokens." /></Reveal>
    <Reveal><div className="stats-grid four"><StatCard label="CREATOR FEES" value="$12,884.42" note="lifetime" accent/><StatCard label="24H VOLUME" value="$2.97M" note="tracked on Pons"/><StatCard label="CREATORS LINKED" value="122" note="Twitch channels"/><StatCard label="TOKENS LAUNCHED" value="169" note="all time"/></div></Reveal>
    <Reveal><div className="analytics-panel"><div className="section-title"><div><h2>Top earners</h2><p className="muted">Twitch creators ranked by routed fees.</p></div><span className="muted">All creators →</span></div><div className="earner-list">{creators.map((c,i)=><div className="earner-row" key={c.handle}><span className="creator-rank">{i+1}</span><div className="avatar">{c.initials}</div><div className="earner-main"><div><strong>{c.name}</strong><span>@{c.handle} · {c.followers}</span></div><div className="progress"><span style={{width: bars[i]}}/></div></div><div className="earner-value"><strong><GiftIcon size={15}/>{c.fees}</strong><span>routed fees</span></div></div>)}</div></div></Reveal>
  </div>;
}

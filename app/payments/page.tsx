import { Reveal } from '@/components/Reveal';
import { PageHeader, StatCard } from '@/components/ui';
import { GiftIcon, TwitchIcon } from '@/components/icons';
import { receipts } from '@/lib/data';

export default function PaymentsPage() {
  return <div className="page-wrap content-page">
    <Reveal><PageHeader title="Payments" description="A front-end ledger of creator fees routed from Pons launches to Twitch creators." /></Reveal>
    <Reveal><div className="stats-grid four"><StatCard label="ROUTED TO CREATORS" value="$12,884.42" note="across 122 Twitch channels" accent/><StatCard label="FEES PROCESSED" value="$20,351.90" note="lifetime mock ledger"/><StatCard label="TOKENS LINKED" value="169" note="launched on Pons"/><StatCard label="RECEIPTS" value="351" note="one per routed batch"/></div></Reveal>
    <Reveal><section className="receipts-section"><div className="section-title"><h2>Latest receipts</h2><span className="muted">351 printed</span></div><div className="receipt-grid">{receipts.map(r=><div className="paper-receipt" key={r.id}><div className="receipt-left"><div className="avatar purple"><TwitchIcon size={18}/></div><div><span>{r.id}</span><strong>{r.handle}</strong><small>{r.time}</small></div></div><div className="receipt-right"><strong>{r.amount}</strong><span>{r.lifetime} lifetime</span></div></div>)}</div></section></Reveal>
  </div>;
}

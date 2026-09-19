import { Reveal } from '@/components/Reveal';
import { PageHeader, StatCard } from '@/components/ui';
import { GiftIcon } from '@/components/icons';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export default async function AnalyticsPage() {
  const supabase = getSupabaseServerClient();
  const [{ data: launches }, { data: payments }, { data: trades }] = await Promise.all([
    supabase.from('launches').select('creator_handle'),
    supabase.from('payment_ledger').select('creator_handle, amount_native, status').eq('status', 'confirmed'),
    supabase.from('trade_ledger').select('quantity, price_native, occurred_at').gte('occurred_at', new Date(Date.now() - 86400000).toISOString()),
  ]);
  const feesByCreator = new Map<string, number>();
  for (const payment of payments ?? []) feesByCreator.set(payment.creator_handle, (feesByCreator.get(payment.creator_handle) ?? 0) + Number(payment.amount_native));
  const topEarners = [...feesByCreator.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  const volume = (trades ?? []).reduce((sum, trade) => sum + Number(trade.quantity) * Number(trade.price_native), 0);
  const maxFees = topEarners[0]?.[1] ?? 0;
  return <div className="page-wrap content-page">
    <Reveal><PageHeader title="Analytics" description="Launch activity and creator routing calculated from Supabase ledgers." /></Reveal>
    <Reveal><div className="stats-grid four"><StatCard label="CREATOR FEES" value={`${topEarners.reduce((sum, [, amount]) => sum + amount, 0).toFixed(4)} RBH`} note="confirmed payment ledger" accent/><StatCard label="24H VOLUME" value={`${volume.toFixed(4)} RBH`} note="confirmed trade ledger"/><StatCard label="CREATORS LINKED" value={String(new Set((launches ?? []).map((launch) => launch.creator_handle)).size)} note="recorded launches"/><StatCard label="TOKENS LAUNCHED" value={String((launches ?? []).length)} note="database records"/></div></Reveal>
    <Reveal><div className="analytics-panel"><div className="section-title"><div><h2>Top earners</h2><p className="muted">Creators ranked by confirmed payment records.</p></div><span className="muted">{topEarners.length} ranked</span></div><div className="earner-list">{topEarners.length ? topEarners.map(([handle, amount], i) => <div className="earner-row" key={handle}><span className="creator-rank">{i + 1}</span><div className="avatar">{handle.slice(0, 2).toUpperCase()}</div><div className="earner-main"><div><strong>@{handle}</strong><span>confirmed payments</span></div><div className="progress"><span style={{width: `${maxFees ? (amount / maxFees) * 100 : 0}%`}}/></div></div><div className="earner-value"><strong><GiftIcon size={15}/>{amount.toFixed(4)} RBH</strong><span>routed fees</span></div></div>) : <p className="empty-state">No confirmed payment records exist yet.</p>}</div></div></Reveal>
  </div>;
}

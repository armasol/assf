import { Reveal } from '@/components/Reveal';
import { PageHeader, StatCard } from '@/components/ui';
import { TwitchIcon } from '@/components/icons';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export default async function PaymentsPage() {
  const { data: launches, error } = await getSupabaseServerClient()
    .from('launches')
    .select('id, token_name, token_symbol, creator_handle, status, tx_hash, created_at')
    .order('created_at', { ascending: false });

  if (error) console.error('[v0] Could not load payment records:', error.message);

  const records = launches ?? [];
  const creators = new Set(records.map((launch) => launch.creator_handle));
  const confirmed = records.filter((launch) => launch.status === 'confirmed');

  return <div className="page-wrap content-page">
    <Reveal><PageHeader title="Payments" description="Launch records and on-chain transaction receipts from Supabase." /></Reveal>
    <Reveal><div className="stats-grid four"><StatCard label="LAUNCH RECORDS" value={String(records.length)} note="database records" accent/><StatCard label="CREATORS LINKED" value={String(creators.size)} note="unique handles"/><StatCard label="CONFIRMED" value={String(confirmed.length)} note="confirmed records"/><StatCard label="PAYMENT TOTAL" value="Unavailable" note="no payment ledger connected"/></div></Reveal>
    <Reveal><section className="receipts-section"><div className="section-title"><h2>Latest database records</h2><span className="muted">{records.length} recorded</span></div><div className="receipt-grid">{records.length ? records.map((record) => <div className="paper-receipt" key={record.id}><div className="receipt-left"><div className="avatar purple"><TwitchIcon size={18}/></div><div><span>{record.token_symbol}</span><strong>@{record.creator_handle}</strong><small>{new Date(record.created_at).toLocaleString()}</small></div></div><div className="receipt-right"><strong>{record.status}</strong><span>{record.tx_hash ? `${record.tx_hash.slice(0, 10)}…` : 'No transaction hash'}</span></div></div>) : <p className="empty-state">No payment or launch records are stored yet.</p>}</div></section></Reveal>
  </div>;
}

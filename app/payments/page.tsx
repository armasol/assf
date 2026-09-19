import { Reveal } from '@/components/Reveal';
import { PageHeader, StatCard } from '@/components/ui';
import { TwitchIcon } from '@/components/icons';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export default async function PaymentsPage() {
  const supabase = getSupabaseServerClient();
  const [{ data: launches, error: launchError }, { data: payments, error: paymentError }] = await Promise.all([
    supabase.from('launches').select('id, token_name, token_symbol, creator_handle, status, tx_hash, created_at').order('created_at', { ascending: false }),
    supabase.from('payment_ledger').select('id, creator_handle, amount_native, asset_symbol, status, tx_hash, created_at').order('created_at', { ascending: false }),
  ]);

  if (launchError) console.error('[v0] Could not load launch records:', launchError.message);
  if (paymentError) console.error('[v0] Could not load payment records:', paymentError.message);

  const records = launches ?? [];
  const paymentRecords = payments ?? [];
  const creators = new Set(records.map((launch) => launch.creator_handle));
  const confirmed = records.filter((launch) => launch.status === 'confirmed');
  const confirmedPayments = paymentRecords.filter((payment) => payment.status === 'confirmed');
  const paymentTotal = confirmedPayments.reduce((sum, payment) => sum + Number(payment.amount_native), 0);
  const paymentAsset = confirmedPayments[0]?.asset_symbol ?? 'RBH';

  return <div className="page-wrap content-page">
    <Reveal><PageHeader title="Payments" description="Launch records and on-chain transaction receipts from Supabase." /></Reveal>
    <Reveal><div className="stats-grid four"><StatCard label="LAUNCH RECORDS" value={String(records.length)} note="database records" accent/><StatCard label="CREATORS LINKED" value={String(creators.size)} note="unique handles"/><StatCard label="CONFIRMED" value={String(confirmed.length)} note="confirmed launches"/><StatCard label="PAYMENT TOTAL" value={`${paymentTotal.toFixed(4)} ${paymentAsset}`} note={`${confirmedPayments.length} confirmed payments`}/></div></Reveal>
    <Reveal><section className="receipts-section"><div className="section-title"><h2>Latest database records</h2><span className="muted">{records.length} recorded</span></div><div className="receipt-grid">{records.length ? records.map((record) => <div className="paper-receipt" key={record.id}><div className="receipt-left"><div className="avatar purple"><TwitchIcon size={18}/></div><div><span>{record.token_symbol}</span><strong>@{record.creator_handle}</strong><small>{new Date(record.created_at).toLocaleString()}</small></div></div><div className="receipt-right"><strong>{record.status}</strong><span>{record.tx_hash ? `${record.tx_hash.slice(0, 10)}…` : 'No transaction hash'}</span></div></div>) : <p className="empty-state">No payment or launch records are stored yet.</p>}</div></section></Reveal>
  </div>;
}

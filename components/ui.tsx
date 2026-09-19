import Link from 'next/link';
import { ArrowIcon, TwitchIcon } from './icons';
import { Token } from '@/lib/data';

export function PageHeader({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: React.ReactNode }) {
  return <div className="page-header"><div>{eyebrow && <div className="eyebrow">{eyebrow}</div>}<h1>{title}</h1>{description && <p>{description}</p>}</div>{action}</div>;
}

export function StatCard({ label, value, note, accent = false }: { label: string; value: string; note?: string; accent?: boolean }) {
  return <div className="stat-card"><span>{label}</span><strong className={accent ? 'accent-text' : ''}>{value}</strong>{note && <small>{note}</small>}</div>;
}

export function TokenCard({ token }: { token: Token }) {
  return <div className="token-card interactive-card">
    <div className="token-art"><div className="rank-pill">#{token.rank}</div><div className="art-orb">{token.art.startsWith('http') || token.art.startsWith('/') ? <img src={token.art} alt={`${token.name} logo`} /> : token.art}</div><div className="mc-pill">{token.marketCap} MC</div></div>
    <div className="token-card-body"><div className="token-title"><strong>{token.ticker}</strong><span>{token.name}</span></div><div className="creator-row"><TwitchIcon size={15}/><span>@{token.creator}</span></div>{token.tokenAddress && <a className="contract-link" href={`https://robinhoodchain.blockscout.com/address/${token.tokenAddress}`} target="_blank" rel="noreferrer">{token.tokenAddress.slice(0, 6)}…{token.tokenAddress.slice(-4)}</a>}<div className="token-metrics"><span>24h vol <b>{token.volume}</b></span><span className={token.positive ? 'up' : 'down'}>{token.change}</span></div></div>
  </div>;
}

export function SectionTitle({ title, link, href = '/explore' }: { title: string; link?: string; href?: string }) {
  return <div className="section-title"><h2>{title}</h2>{link && <Link href={href}>{link}<ArrowIcon size={15}/></Link>}</div>;
}

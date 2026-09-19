'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Analytics } from '@/components/AnalyticsDummy';
import { tokens, creators } from '@/lib/data';
import { ArrowIcon, ChartIcon, CloseIcon, CoinsIcon, DocsIcon, GiftIcon, HomeIcon, RocketIcon, SearchIcon, SparkIcon, TwitchIcon, WalletIcon } from './icons';

const nav = [
  { href: '/', label: 'Home', Icon: HomeIcon },
  { href: '/explore', label: 'Explore', Icon: SearchIcon },
  { href: '/payments', label: 'Payments', Icon: CoinsIcon },
  { href: '/analytics', label: 'Analytics', Icon: ChartIcon },
  { href: '/launch', label: 'Launch', Icon: RocketIcon },
  { href: '/get-paid', label: 'Get paid', Icon: GiftIcon },
  { href: '/docs', label: 'Docs', Icon: DocsIcon },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [wallet, setWallet] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    const tokenResults = tokens.filter(t => `${t.ticker} ${t.name} ${t.creator}`.toLowerCase().includes(q)).slice(0, 4).map(t => ({ type: 'Token', title: `${t.ticker} ${t.name}`, subtitle: `@${t.creator}`, href: '/explore' }));
    const creatorResults = creators.filter(c => `${c.handle} ${c.name}`.toLowerCase().includes(q)).slice(0, 4).map(c => ({ type: 'Creator', title: c.name, subtitle: `@${c.handle}`, href: '/get-paid' }));
    return [...tokenResults, ...creatorResults].slice(0, 6);
  }, [query]);

  const connect = () => {
    setWallet(v => !v);
    setToast(wallet ? 'Wallet disconnected' : 'Demo wallet connected');
    window.setTimeout(() => setToast(''), 2200);
  };

  return (
    <div className={`app-shell ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-top">
          <Link href="/" className="brand" aria-label="Home">
            <div className="brand-mark">P</div>
            {!collapsed && <span className="brand-word">tipped</span>}
          </Link>
          <button className="icon-button collapse-button" onClick={() => setCollapsed(v => !v)} aria-label="Toggle sidebar">
            <span className={collapsed ? 'chevron-flip' : ''}>‹‹</span>
          </button>
        </div>
        <nav className="side-nav">
          {nav.map(({ href, label, Icon }) => {
            const active = pathname === href;
            return <Link key={href} href={href} className={`side-link ${active ? 'active' : ''}`} title={label}><Icon size={20}/>{!collapsed && <span>{label}</span>}</Link>;
          })}
        </nav>
        <div className="sidebar-foot">
          <div className="side-badge"><TwitchIcon size={18}/></div>
          {!collapsed && <div><strong>tipped</strong><span>Creator fees on Twitch</span></div>}
        </div>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMobileOpen(v => !v)}>☰</button>
          <button className="top-search" onClick={() => setSearchOpen(true)}><SearchIcon size={18}/><span>Search tokens or Twitch creators</span><kbd>⌘ K</kbd></button>
          <div className="top-actions">
            <button className="button primary small" onClick={() => router.push('/launch')}>Launch</button>
            <button className={`button ghost small wallet-button ${wallet ? 'connected' : ''}`} onClick={connect}><WalletIcon size={16}/><span>{wallet ? '0x7A…9B2' : 'Connect wallet'}</span></button>
          </div>
        </header>
        <div className="top-accent" />
        <main className="main-content">{children}</main>
      </div>

      {mobileOpen && <button className="scrim" onClick={() => setMobileOpen(false)} aria-label="Close menu"/>}

      {searchOpen && <div className="modal-backdrop" onMouseDown={() => setSearchOpen(false)}>
        <div className="search-modal" onMouseDown={(e) => e.stopPropagation()}>
          <div className="search-modal-input"><SearchIcon/><input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by token, ticker, or Twitch creator"/><button className="icon-button" onClick={() => setSearchOpen(false)}><CloseIcon/></button></div>
          <div className="search-results">
            {!query && <div className="search-empty"><SparkIcon/><div><strong>Search the launchpad</strong><span>Try “Kai”, “$KAI”, or a Twitch handle.</span></div></div>}
            {query && results.length === 0 && <div className="search-empty"><SearchIcon/><div><strong>No matches yet</strong><span>Try another name or ticker.</span></div></div>}
            {results.map((r, i) => <button key={`${r.title}-${i}`} className="search-result" onClick={() => { setSearchOpen(false); setQuery(''); router.push(r.href); }}><div className="avatar tiny">{r.title.slice(0,2).replace('$','')}</div><div><strong>{r.title}</strong><span>{r.type} · {r.subtitle}</span></div><ArrowIcon size={18}/></button>)}
          </div>
        </div>
      </div>}

      {toast && <div className="toast"><span className="toast-dot" />{toast}</div>}
      <Analytics />
    </div>
  );
}

'use client';

import { ChangeEvent, useMemo, useState } from 'react';
import { Reveal } from '@/components/Reveal';
import { CheckIcon, RocketIcon, TwitchIcon, UploadIcon, WalletIcon } from '@/components/icons';
import { creators } from '@/lib/data';

export default function LaunchPage() {
  const [creator, setCreator] = useState('kaicenat');
  const [name, setName] = useState('Kai Coin');
  const [ticker, setTicker] = useState('KAI');
  const [description, setDescription] = useState('A creator-linked token for the Twitch community.');
  const [image, setImage] = useState<string>('');
  const [website, setWebsite] = useState('');
  const [x, setX] = useState('');
  const [firstBuy, setFirstBuy] = useState('None');
  const [done, setDone] = useState(false);
  const selected = useMemo(() => creators.find(c=>c.handle===creator) || creators[0], [creator]);

  const upload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(String(reader.result));
    reader.readAsDataURL(file);
  };

  return <div className="page-wrap content-page launch-page">
    <Reveal><div className="launch-heading"><div className="eyebrow">LAUNCH ON PONS · ROBINHOOD CHAIN</div><h1>Launch a creator-linked token.</h1><p>Pick the Twitch creator first, then shape the coin. This first pass is a polished front-end flow; the chain transaction can be wired next.</p></div></Reveal>
    <div className="launch-layout">
      <Reveal><form className="launch-form" onSubmit={(e)=>{e.preventDefault();setDone(true)}}>
        <section className="form-section"><div className="form-section-title"><span>1</span><div><strong>Who gets linked?</strong><small>Twitch creator</small></div></div><div className="creator-chips">{creators.slice(0,5).map(c=><button type="button" key={c.handle} className={`creator-chip ${creator===c.handle?'selected':''}`} onClick={()=>setCreator(c.handle)}><div className="avatar tiny">{c.initials}</div><div><strong>{c.name}</strong><span>@{c.handle}</span></div>{creator===c.handle&&<CheckIcon size={15}/>}</button>)}</div><label className="field"><span>Or enter a Twitch handle</span><div className="field-input with-icon"><TwitchIcon size={17}/><input value={creator} onChange={e=>setCreator(e.target.value.replace('@',''))} placeholder="creatorhandle"/></div></label></section>

        <section className="form-section"><div className="form-section-title"><span>2</span><div><strong>The token</strong><small>Name, ticker, story</small></div></div><div className="form-row"><label className="field grow"><span>Name</span><input value={name} onChange={e=>setName(e.target.value)} placeholder="Creator Coin" required/></label><label className="field ticker-field"><span>Ticker</span><div className="ticker-input"><b>$</b><input value={ticker} onChange={e=>setTicker(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,7))} placeholder="COIN" required/></div></label></div><label className="field"><span>Description <em>optional</em></span><textarea value={description} onChange={e=>setDescription(e.target.value)} rows={4}/></label><label className="upload-zone"><input type="file" accept="image/*" onChange={upload}/>{image?<img src={image} alt="Token preview"/>:<><div className="upload-icon"><UploadIcon/></div><strong>Drop token art or click to choose</strong><span>PNG, JPEG or WebP · square works best</span></>}</label><div className="form-row"><label className="field grow"><span>Website <em>optional</em></span><input value={website} onChange={e=>setWebsite(e.target.value)} placeholder="https://"/></label><label className="field grow"><span>X <em>optional</em></span><input value={x} onChange={e=>setX(e.target.value)} placeholder="https://x.com/..."/></label></div></section>

        <section className="form-section"><div className="form-section-title"><span>3</span><div><strong>Your first buy</strong><small>Optional</small></div></div><div className="buy-options">{['None','0.1 ETH','0.25 ETH','0.5 ETH','1 ETH'].map(v=><button type="button" key={v} className={firstBuy===v?'selected':''} onClick={()=>setFirstBuy(v)}>{v}</button>)}</div></section>

        <div className="launch-summary"><div><WalletIcon size={19}/><p><strong>Two actions in one flow.</strong><br/>Connect a wallet, confirm the token, then hand off launch execution to Pons.</p></div><button className="button primary full" type="submit">Launch on Pons<RocketIcon size={18}/></button></div>
      </form></Reveal>

      <Reveal delay={80}><aside className="launch-preview-wrap"><div className="preview-label">LIVE PREVIEW</div><div className="token-preview-card"><div className="preview-art">{image?<img src={image} alt="Token art"/>:<span>{ticker.slice(0,2)||'P'}</span>}<div className="preview-live">PONS</div></div><div className="preview-body"><div className="profile-pill"><div className="avatar tiny">{selected.initials}</div><div><strong>{selected.name}</strong><span>@{selected.handle}</span></div><TwitchIcon size={17}/></div><h3>${ticker || 'TOKEN'} <span>{name || 'Token name'}</span></h3><p>{description || 'Your token description appears here.'}</p><div className="preview-metrics"><div><span>Creator</span><strong>@{selected.handle}</strong></div><div><span>Launch</span><strong>Pons</strong></div></div></div></div><div className="when-launch"><span className="mini-label">WHEN YOU LAUNCH</span><div><b>1</b><p>The coin metadata is prepared with the Twitch creator attached.</p></div><div><b>2</b><p>Pons handles the launch step on Robinhood Chain.</p></div><div><b>3</b><p>The creator-linked routing becomes visible across the front-end.</p></div></div></aside></Reveal>
    </div>
    {done && <div className="modal-backdrop"><div className="success-modal"><div className="success-icon"><CheckIcon size={34}/></div><h2>Front-end flow complete.</h2><p>${ticker} is ready for the Pons transaction layer. No on-chain action was submitted in this front-end build.</p><button className="button primary" onClick={()=>setDone(false)}>Back to launch</button></div></div>}
  </div>;
}

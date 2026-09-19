'use client';

import { ChangeEvent, useMemo, useState } from 'react';
import { encodeFunctionData, parseEther } from 'viem';
import { Reveal } from '@/components/Reveal';
import { CheckIcon, RocketIcon, TwitchIcon, UploadIcon, WalletIcon } from '@/components/icons';
import { creators } from '@/lib/data';

const ROBINHOOD_CHAIN_ID = '0x1237';
const PONS_FACTORY = '0xA5aAb3F0c6EeadF30Ef1D3Eb997108E976351feB' as `0x${string}`;
const ROBINHOOD_CHAIN = {
  chainId: ROBINHOOD_CHAIN_ID,
  chainName: 'Robinhood Chain Mainnet',
  nativeCurrency: { name: 'Robinhood Chain', symbol: 'RHO', decimals: 18 },
  rpcUrls: ['https://rpc.mainnet.chain.robinhood.com'],
  blockExplorerUrls: ['https://robinhoodchain.blockscout.com'],
};

type EthereumProvider = { request: (args: { method: string; params?: unknown[] }) => Promise<unknown> };

const PONS_ABI = [
  { type: 'function', name: 'launchFee', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  { type: 'function', name: 'launchConfigCount', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  { type: 'function', name: 'dexConfigCount', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  { type: 'function', name: 'launchToken', stateMutability: 'payable', inputs: [{ name: 'params', type: 'tuple', components: [
    { name: 'name', type: 'string' }, { name: 'symbol', type: 'string' }, { name: 'logo', type: 'string' }, { name: 'description', type: 'string' },
    { name: 'socials', type: 'tuple', components: [{ name: 'twitter', type: 'string' }, { name: 'telegram', type: 'string' }, { name: 'discord', type: 'string' }, { name: 'website', type: 'string' }, { name: 'farcaster', type: 'string' }] },
    { name: 'feeWallet', type: 'address' },
  ] }, { name: 'launchConfigId', type: 'uint256' }, { name: 'dexId', type: 'uint256' }, { name: 'salt', type: 'bytes32' }], outputs: [{ type: 'address' }] },
] as const;

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
  const [pending, setPending] = useState(false);
  const [txHash, setTxHash] = useState('');
  const selected = useMemo(() => creators.find(c=>c.handle===creator) || creators[0], [creator]);

  const connectAndLaunch = async () => {
    const ethereum = (window as Window & { ethereum?: EthereumProvider }).ethereum;
    if (!ethereum) {
      window.alert('MetaMask is required to launch on Robinhood Chain.');
      return;
    }

    try {
      setPending(true);
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' }) as string[];
      const wallet = accounts[0] as `0x${string}`;
      try {
        await ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: ROBINHOOD_CHAIN_ID }] });
      } catch (error) {
        if ((error as { code?: number }).code !== 4902) throw error;
        await ethereum.request({ method: 'wallet_addEthereumChain', params: [ROBINHOOD_CHAIN] });
      }
      const launchFee = await ethereum.request({ method: 'eth_call', params: [{ to: PONS_FACTORY, data: encodeFunctionData({ abi: PONS_ABI, functionName: 'launchFee' }) }, 'latest'] }) as string;
      const launchConfigCount = BigInt(await ethereum.request({ method: 'eth_call', params: [{ to: PONS_FACTORY, data: encodeFunctionData({ abi: PONS_ABI, functionName: 'launchConfigCount' }) }, 'latest'] }) as string);
      const dexConfigCount = BigInt(await ethereum.request({ method: 'eth_call', params: [{ to: PONS_FACTORY, data: encodeFunctionData({ abi: PONS_ABI, functionName: 'dexConfigCount' }) }, 'latest'] }) as string);
      if (launchConfigCount === BigInt(0) || dexConfigCount === BigInt(0)) throw new Error('Pons has no active launch configuration yet.');
      const data = encodeFunctionData({ abi: PONS_ABI, functionName: 'launchToken', args: [{ name, symbol: ticker, logo: image, description, socials: { twitter: x, telegram: '', discord: '', website, farcaster: '' }, feeWallet: wallet }, BigInt(0), BigInt(0), `0x${crypto.getRandomValues(new Uint8Array(32)).reduce((s, b) => s + b.toString(16).padStart(2, '0'), '')}`] });
      const hash = await ethereum.request({ method: 'eth_sendTransaction', params: [{ from: wallet, to: PONS_FACTORY, data, value: launchFee }] }) as string;
      setTxHash(hash);
      setDone(true);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Launch transaction was rejected or failed.');
    } finally {
      setPending(false);
    }
  };

  const upload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(String(reader.result));
    reader.readAsDataURL(file);
  };

  return <div className="page-wrap content-page launch-page">
    <Reveal><div className="launch-heading"><div className="eyebrow">LAUNCH ON PONS · ROBINHOOD CHAIN MAINNET</div><h1>Launch a creator-linked token.</h1><p>Connect MetaMask to submit a real launch transaction on Robinhood Chain Mainnet. You pay the Pons launch fee and any network gas directly from your wallet.</p></div></Reveal>
    <div className="launch-layout">
      <Reveal><form className="launch-form" onSubmit={(e)=>{e.preventDefault();void connectAndLaunch()}}>
        <section className="form-section"><div className="form-section-title"><span>1</span><div><strong>Who gets linked?</strong><small>Twitch creator</small></div></div><div className="creator-chips">{creators.slice(0,5).map(c=><button type="button" key={c.handle} className={`creator-chip ${creator===c.handle?'selected':''}`} onClick={()=>setCreator(c.handle)}><div className="avatar tiny">{c.initials}</div><div><strong>{c.name}</strong><span>@{c.handle}</span></div>{creator===c.handle&&<CheckIcon size={15}/>}</button>)}</div><label className="field"><span>Or enter a Twitch handle</span><div className="field-input with-icon"><TwitchIcon size={17}/><input value={creator} onChange={e=>setCreator(e.target.value.replace('@',''))} placeholder="creatorhandle"/></div></label></section>

        <section className="form-section"><div className="form-section-title"><span>2</span><div><strong>The token</strong><small>Name, ticker, story</small></div></div><div className="form-row"><label className="field grow"><span>Name</span><input value={name} onChange={e=>setName(e.target.value)} placeholder="Creator Coin" required/></label><label className="field ticker-field"><span>Ticker</span><div className="ticker-input"><b>$</b><input value={ticker} onChange={e=>setTicker(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,7))} placeholder="COIN" required/></div></label></div><label className="field"><span>Description <em>optional</em></span><textarea value={description} onChange={e=>setDescription(e.target.value)} rows={4}/></label><label className="upload-zone"><input type="file" accept="image/*" onChange={upload}/>{image?<img src={image} alt="Token preview"/>:<><div className="upload-icon"><UploadIcon/></div><strong>Drop token art or click to choose</strong><span>PNG, JPEG or WebP · square works best</span></>}</label><div className="form-row"><label className="field grow"><span>Website <em>optional</em></span><input value={website} onChange={e=>setWebsite(e.target.value)} placeholder="https://"/></label><label className="field grow"><span>X <em>optional</em></span><input value={x} onChange={e=>setX(e.target.value)} placeholder="https://x.com/..."/></label></div></section>

        <section className="form-section"><div className="form-section-title"><span>3</span><div><strong>Your first buy</strong><small>Keep it free</small></div></div><div className="buy-options">{['None'].map(v=><button type="button" key={v} className={firstBuy===v?'selected':''} onClick={()=>setFirstBuy(v)}>{v}</button>)}</div></section>

        <div className="launch-summary"><div><WalletIcon size={19}/><p><strong>Two actions in one flow.</strong><br/>Connect a wallet, confirm the token, then hand off launch execution to Pons.</p></div><button className="button primary full" type="submit" disabled={pending}>{pending ? 'Confirm transaction in MetaMask…' : 'Launch on Pons'}{!pending && <RocketIcon size={18}/>}</button></div>
      </form></Reveal>

      <Reveal delay={80}><aside className="launch-preview-wrap"><div className="preview-label">LIVE PREVIEW</div><div className="token-preview-card"><div className="preview-art">{image?<img src={image} alt="Token art"/>:<span>{ticker.slice(0,2)||'P'}</span>}<div className="preview-live">PONS</div></div><div className="preview-body"><div className="profile-pill"><div className="avatar tiny">{selected.initials}</div><div><strong>{selected.name}</strong><span>@{selected.handle}</span></div><TwitchIcon size={17}/></div><h3>${ticker || 'TOKEN'} <span>{name || 'Token name'}</span></h3><p>{description || 'Your token description appears here.'}</p><div className="preview-metrics"><div><span>Creator</span><strong>@{selected.handle}</strong></div><div><span>Launch</span><strong>Pons</strong></div></div></div></div><div className="when-launch"><span className="mini-label">WHEN YOU LAUNCH</span><div><b>1</b><p>The coin metadata is prepared with the Twitch creator attached.</p></div><div><b>2</b><p>Pons handles the launch step on Robinhood Chain.</p></div><div><b>3</b><p>The creator-linked routing becomes visible across the front-end.</p></div></div></aside></Reveal>
    </div>
    {done && <div className="modal-backdrop"><div className="success-modal"><div className="success-icon"><CheckIcon size={34}/></div><h2>Wallet ready for launch.</h2><p>${ticker} is prepared for Robinhood Chain Mainnet. Pons launch execution will submit the on-chain transaction in the next step.</p><button className="button primary" onClick={()=>setDone(false)}>Back to launch</button></div></div>}
  </div>;
}

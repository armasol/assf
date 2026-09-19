'use client';

import { ChangeEvent, useMemo, useState } from 'react';
import { decodeEventLog, encodeFunctionData } from 'viem';
import { Reveal } from '@/components/Reveal';
import { CheckIcon, RocketIcon, TwitchIcon, UploadIcon, WalletIcon } from '@/components/icons';
import { creators } from '@/lib/data';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

const ROBINHOOD_CHAIN_ID = '0x1237';
const DEFAULT_LOGO_URI = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logotwitch-RVMQJk7F2Shbt9HBAVjuK0wVsmheoL.png';
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
  { type: 'event', name: 'TokenLaunched', anonymous: false, inputs: [{ name: 'token', type: 'address', indexed: true }, { name: 'creator', type: 'address', indexed: true }] },
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
      const data = encodeFunctionData({ abi: PONS_ABI, functionName: 'launchToken', args: [{ name: name.trim().slice(0, 64), symbol: ticker.trim().slice(0, 7), logo: DEFAULT_LOGO_URI, description: description.trim().slice(0, 240), socials: { twitter: x.trim().slice(0, 120), telegram: '', discord: '', website: website.trim().slice(0, 120), farcaster: '' }, feeWallet: wallet }, BigInt(0), BigInt(0), `0x${crypto.getRandomValues(new Uint8Array(32)).reduce((s, b) => s + b.toString(16).padStart(2, '0'), '')}`] });
      const hash = await ethereum.request({ method: 'eth_sendTransaction', params: [{ from: wallet, to: PONS_FACTORY, data, value: launchFee }] }) as string;
      setTxHash(hash);

      let receipt: { status?: string; blockNumber?: string; logs?: Array<{ address: string; topics: string[]; data: string }> } | null = null;
      for (let attempt = 0; attempt < 60; attempt += 1) {
        await new Promise((resolve) => window.setTimeout(resolve, 2_000));
        receipt = await ethereum.request({ method: 'eth_getTransactionReceipt', params: [hash] }) as { status?: string } | null;
        if (receipt) break;
      }
      if (!receipt) throw new Error('Transaction is still pending. Check MetaMask or the Robinhood Chain explorer for its status.');
      if (receipt.status !== '0x1') throw new Error('The launch transaction failed on Robinhood Chain. No launch was recorded.');

      let tokenAddress: string | null = null;
      for (const log of receipt.logs ?? []) {
        try {
          const decoded = decodeEventLog({ abi: PONS_ABI, data: log.data as `0x${string}`, topics: log.topics as [`0x${string}`, ...`0x${string}`[]] });
          if (decoded.eventName === 'TokenLaunched') {
            const args = decoded.args as { token?: string };
            tokenAddress = args.token ?? null;
            break;
          }
        } catch {
          // Ignore unrelated logs; the factory event is the source of truth.
        }
      }
      if (!tokenAddress) throw new Error('The launch was confirmed, but Pons did not emit a token address. The launch was not recorded so it can be reconciled safely.');

      const { error: recordError } = await getSupabaseBrowserClient().from('launches').insert({
        tx_hash: hash,
        wallet_address: wallet,
        creator_handle: creator.trim().replace(/^@/, '').slice(0, 80),
        token_name: name.trim().slice(0, 64),
        token_symbol: ticker.trim().slice(0, 7),
        description: description.trim().slice(0, 240) || null,
        logo_uri: DEFAULT_LOGO_URI,
        website: website.trim().slice(0, 120) || null,
        x_url: x.trim().slice(0, 120) || null,
        chain_id: ROBINHOOD_CHAIN_ID,
        token_address: tokenAddress,
        block_number: receipt.blockNumber ? BigInt(receipt.blockNumber).toString() : null,
        status: 'confirmed',
      } as never);
      if (recordError) console.error('[v0] Could not save launch record:', recordError.message);
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
    reader.onload = () => setImage(URL.createObjectURL(file));
    reader.readAsDataURL(file);
  };

  return <div className="page-wrap content-page launch-page">
    <Reveal><div className="launch-heading"><div className="eyebrow">LAUNCH ON PONS · ROBINHOOD CHAIN MAINNET</div><h1>Launch a creator-linked token.</h1><p>Connect MetaMask to submit a real launch transaction on Robinhood Chain Mainnet. You pay the Pons launch fee and any network gas directly from your wallet.</p></div></Reveal>
    <div className="launch-layout">
      <Reveal><form className="launch-form" onSubmit={(e)=>{e.preventDefault();void connectAndLaunch()}}>
        <section className="form-section"><div className="form-section-title"><span>1</span><div><strong>Who gets linked?</strong><small>Twitch creator</small></div></div><div className="creator-chips">{creators.slice(0,5).map(c=><button type="button" key={c.handle} className={`creator-chip ${creator===c.handle?'selected':''}`} onClick={()=>setCreator(c.handle)}><div className="avatar tiny">{c.initials}</div><div><strong>{c.name}</strong><span>@{c.handle}</span></div>{creator===c.handle&&<CheckIcon size={15}/>}</button>)}</div><label className="field"><span>Or enter a Twitch handle</span><div className="field-input with-icon"><TwitchIcon size={17}/><input value={creator} onChange={e=>setCreator(e.target.value.replace('@',''))} placeholder="creatorhandle"/></div></label></section>

        <section className="form-section"><div className="form-section-title"><span>2</span><div><strong>The token</strong><small>Name, ticker, story</small></div></div><div className="form-row"><label className="field grow"><span>Name</span><input value={name} onChange={e=>setName(e.target.value)} placeholder="Creator Coin" required/></label><label className="field ticker-field"><span>Ticker</span><div className="ticker-input"><b>$</b><input value={ticker} onChange={e=>setTicker(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,7))} placeholder="COIN" required/></div></label></div><label className="field"><span>Description <em>optional</em></span><textarea value={description} onChange={e=>setDescription(e.target.value)} rows={4}/></label><label className="upload-zone"><input type="file" accept="image/*" onChange={upload}/>{image?<img src={image} alt="Token preview"/>:<><div className="upload-icon"><UploadIcon/></div><strong>Drop token art or click to choose</strong><span>PNG, JPEG or WebP · preview only; launches use the hosted logo</span></>}</label><div className="form-row"><label className="field grow"><span>Website <em>optional</em></span><input value={website} onChange={e=>setWebsite(e.target.value)} placeholder="https://"/></label><label className="field grow"><span>X <em>optional</em></span><input value={x} onChange={e=>setX(e.target.value)} placeholder="https://x.com/..."/></label></div></section>

        <section className="form-section"><div className="form-section-title"><span>3</span><div><strong>Your first buy</strong><small>Optional buyer-funded purchase</small></div></div><div className="buy-options">{['None'].map(v=><button type="button" key={v} className={firstBuy===v?'selected':''} onClick={()=>setFirstBuy(v)}>{v}</button>)}</div></section>

        <div className="launch-summary"><div><WalletIcon size={19}/><p><strong>Two actions in one flow.</strong><br/>Connect a wallet, confirm the token, then hand off launch execution to Pons.</p></div><button className="button primary full" type="submit" disabled={pending}>{pending ? 'Confirm transaction in MetaMask…' : 'Launch on Pons'}{!pending && <RocketIcon size={18}/>}</button></div>
      </form></Reveal>

      <Reveal delay={80}><aside className="launch-preview-wrap"><div className="preview-label">LIVE PREVIEW</div><div className="token-preview-card"><div className="preview-art">{image?<img src={image} alt="Token art"/>:<img src={DEFAULT_LOGO_URI} alt="Subbed token logo"/>}<div className="preview-live">PONS</div></div><div className="preview-body"><div className="profile-pill"><div className="avatar tiny">{selected.initials}</div><div><strong>{selected.name}</strong><span>@{selected.handle}</span></div><TwitchIcon size={17}/></div><h3>${ticker || 'TOKEN'} <span>{name || 'Token name'}</span></h3><p>{description || 'Your token description appears here.'}</p><div className="preview-metrics"><div><span>Creator</span><strong>@{selected.handle}</strong></div><div><span>Launch</span><strong>Pons</strong></div></div></div></div><div className="when-launch"><span className="mini-label">WHEN YOU LAUNCH</span><div><b>1</b><p>The coin metadata is prepared with the Twitch creator attached.</p></div><div><b>2</b><p>Pons handles the launch step on Robinhood Chain.</p></div><div><b>3</b><p>The creator-linked routing becomes visible across the front-end.</p></div></div></aside></Reveal>
    </div>
    {done && <div className="modal-backdrop"><div className="success-modal"><div className="success-icon"><CheckIcon size={34}/></div><h2>Launch transaction submitted.</h2><p>${ticker} was submitted to Pons on Robinhood Chain Mainnet. Confirm the transaction in MetaMask, then check the explorer for its final status.</p>{txHash&&<a className="button ghost" href={`${ROBINHOOD_CHAIN.blockExplorerUrls[0]}/tx/${txHash}`} target="_blank" rel="noreferrer">View transaction</a>}<button className="button primary" onClick={()=>setDone(false)}>Back to launch</button></div></div>}
  </div>;
}

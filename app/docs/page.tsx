import Link from 'next/link';
import { Reveal } from '@/components/Reveal';
import { ArrowIcon, CheckIcon, CoinsIcon, GiftIcon, RocketIcon, TwitchIcon, WalletIcon } from '@/components/icons';

const toc = ['Overview','Launch flow','Creator linking','Pons handoff','Wallet connection','Front-end states','Next integration pass'];
export default function DocsPage() {
  return <div className="page-wrap docs-page">
    <aside className="docs-toc"><span>ON THIS PAGE</span>{toc.map((x,i)=><a href={`#doc-${i}`} key={x}>{i+1}. {x}</a>)}</aside>
    <article className="docs-article">
      <Reveal><div className="eyebrow">PRODUCT DOCS</div><h1>How subbed works</h1><p className="docs-lead">subbed is a creator-linked launchpad front-end for Twitch communities. A user chooses a Twitch creator, configures a token, and hands the final launch step to Pons on Robinhood Chain.</p><div className="docs-callout"><span>This build</span><strong>Front-end complete</strong><p>Navigation, discovery, launch configuration, creator pages, wallet UI states, responsive design, and motion are included.</p></div></Reveal>
      <Reveal><section id="doc-0"><h2>1. Overview</h2><p>The core idea is intentionally simple: the creator identity comes first. Tokens are represented as being attached to a Twitch handle, making the creator relationship visible throughout Explore, Analytics, Payments, and Launch.</p><div className="doc-flow">{[[RocketIcon,'Launch'],[TwitchIcon,'Creator'],[CoinsIcon,'Token'],[GiftIcon,'Fees'],[WalletIcon,'Wallet']].map(([Icon,label]:any)=><div key={label}><span><Icon size={20}/></span><strong>{label}</strong></div>)}</div></section></Reveal>
      <Reveal><section id="doc-1"><h2>2. Launch flow</h2><p>The launch screen uses three clear sections: creator, token, and optional first buy. The right-side preview updates immediately so the user can see how the token will appear before submitting.</p><ul><li><CheckIcon size={16}/>Choose a Twitch creator or type a handle.</li><li><CheckIcon size={16}/>Set name, ticker, description, artwork, and optional links.</li><li><CheckIcon size={16}/>Choose an optional first-buy amount.</li><li><CheckIcon size={16}/>Submit the final action to the future Pons integration.</li></ul></section></Reveal>
      <Reveal><section id="doc-2"><h2>3. Creator linking</h2><p>Creator identities are represented by Twitch handles and can later be resolved against the Twitch API if you choose to add authenticated Twitch data. The UI is already shaped for name, avatar, handle, follower count, and linked tokens.</p></section></Reveal>
      <Reveal><section id="doc-3"><h2>4. Pons handoff</h2><p>The current build does not invent a contract or transaction API. It provides a clean front-end boundary where the actual Pons launch request can be wired once the exact interface is confirmed.</p><div className="code-box"><span>UI action</span><code>Launch → validate fields → connect wallet → Pons transaction</code></div></section></Reveal>
      <Reveal><section id="doc-4"><h2>5. Wallet connection</h2><p>The header includes a working demo connection state. Replace the local UI toggle with your preferred EVM connector when the on-chain pass begins.</p></section></Reveal>
      <Reveal><section id="doc-5"><h2>6. Front-end states</h2><p>Search, navigation, creator selection, image upload preview, form controls, sorting, filtering, mobile navigation, modal states, and scroll reveals all work in the current project.</p></section></Reveal>
      <Reveal><section id="doc-6"><h2>7. Next integration pass</h2><p>Once you are happy with the front-end, the clean next step is to wire real wallet auth, the Pons launch call, chain reads, and real Twitch creator lookup—without changing the overall interface.</p><Link href="/launch" className="button primary">Open launch flow<ArrowIcon size={17}/></Link></section></Reveal>
    </article>
  </div>;
}

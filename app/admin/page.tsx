'use client'

import { FormEvent, useState } from 'react'

type TokenDraft = {
  token_address: string
  token_name: string
  token_symbol: string
  creator_handle: string
  logo_uri: string
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authorized, setAuthorized] = useState(false)
  const [token, setToken] = useState<TokenDraft>({ token_address: '', token_name: '', token_symbol: '', creator_handle: '', logo_uri: '' })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function unlock(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    setMessage('')
    const response = await fetch('/api/admin/tokens', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, action: 'unlock' }),
    })
    setLoading(false)
    if (response.status === 401) {
      setMessage('Incorrect admin password.')
      return
    }
    setAuthorized(true)
    setMessage('Admin access granted.')
  }

  async function addToken(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    setMessage('')
    const response = await fetch('/api/admin/tokens', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, token }),
    })
    const result = await response.json()
    setLoading(false)
    if (!response.ok) {
      setMessage(result.error ?? 'Could not add token.')
      return
    }
    setToken({ token_address: '', token_name: '', token_symbol: '', creator_handle: '', logo_uri: '' })
    setMessage('Token added to the public registry.')
  }

  return <main className="page-wrap content-page">
    <div className="page-header"><div><div className="eyebrow">ADMIN</div><h1>Token registry</h1><p>Add verified contract addresses found on Pons. Public pages only display records from this registry and confirmed launches.</p></div></div>
    {!authorized && <section className="form-section" style={{ maxWidth: 620 }}>
      <h2>Admin access</h2>
      <form className="launch-form" onSubmit={unlock}>
        <label className="field"><span>Admin password</span><input type="password" value={password} onChange={event => setPassword(event.target.value)} autoComplete="current-password" required /></label>
        <button className="button primary" disabled={loading}>{loading ? 'Checking…' : 'Continue'}</button>
      </form>
      {message && <p className="claim-result" role="status">{message}</p>}
    </section>}
    {authorized && <section className="form-section" style={{ maxWidth: 620, marginTop: 18 }}>
      <h2>Add verified token</h2>
      <form className="launch-form" onSubmit={addToken}>
        <label className="field"><span>Contract address</span><input value={token.token_address} onChange={event => setToken({ ...token, token_address: event.target.value })} placeholder="0x…" required /></label>
        <label className="field"><span>Token name</span><input value={token.token_name} onChange={event => setToken({ ...token, token_name: event.target.value })} required /></label>
        <label className="field"><span>Symbol</span><input value={token.token_symbol} onChange={event => setToken({ ...token, token_symbol: event.target.value })} required /></label>
        <label className="field"><span>Twitch creator handle</span><input value={token.creator_handle} onChange={event => setToken({ ...token, creator_handle: event.target.value })} placeholder="kaicenat" required /></label>
        <label className="field"><span>Logo URL <em>(optional)</em></span><input type="url" value={token.logo_uri} onChange={event => setToken({ ...token, logo_uri: event.target.value })} /></label>
        <button className="button primary" disabled={loading}>{loading ? 'Saving…' : 'Add token'}</button>
      </form>
      {message && <p className="claim-result" role="status">{message}</p>}
    </section>}
  </main>
}

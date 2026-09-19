'use client'

import { FormEvent, useState } from 'react'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

type TokenDraft = {
  token_address: string
  token_name: string
  token_symbol: string
  creator_handle: string
  logo_uri: string
}

export default function AdminPage() {
  const supabase = getSupabaseBrowserClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [token, setToken] = useState<TokenDraft>({ token_address: '', token_name: '', token_symbol: '', creator_handle: '', logo_uri: '' })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function signIn(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    setMessage('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    setMessage(error ? 'Sign in failed. Check your credentials.' : 'Signed in. You can now add verified tokens.')
  }

  async function addToken(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    setMessage('')
    const { error } = await (supabase.from('token_registry') as any).insert({
      ...token,
      logo_uri: token.logo_uri || null,
      token_address: token.token_address.trim(),
      token_symbol: token.token_symbol.trim().toUpperCase(),
      creator_handle: token.creator_handle.trim().replace(/^@/, ''),
    })
    setLoading(false)
    if (error) {
      setMessage(error.code === '23505' ? 'That contract address is already registered.' : `Could not add token: ${error.message}`)
      return
    }
    setToken({ token_address: '', token_name: '', token_symbol: '', creator_handle: '', logo_uri: '' })
    setMessage('Token added to the public registry.')
  }

  return <main className="page-wrap content-page">
    <div className="page-header"><div><div className="eyebrow">ADMIN</div><h1>Token registry</h1><p>Add verified contract addresses found on Pons. Public pages only display records from this registry and confirmed launches.</p></div></div>
    <section className="form-section" style={{ maxWidth: 620 }}>
      <h2>Admin sign in</h2>
      <form className="launch-form" onSubmit={signIn}>
        <label className="field"><span>Email</span><input type="email" value={email} onChange={event => setEmail(event.target.value)} required /></label>
        <label className="field"><span>Password</span><input type="password" value={password} onChange={event => setPassword(event.target.value)} required /></label>
        <button className="button primary" disabled={loading}>{loading ? 'Working…' : 'Sign in'}</button>
      </form>
    </section>
    <section className="form-section" style={{ maxWidth: 620, marginTop: 18 }}>
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
    </section>
  </main>
}

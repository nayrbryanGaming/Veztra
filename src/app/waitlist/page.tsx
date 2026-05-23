'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Users } from 'lucide-react'

// ── Warp-speed background (inline so this page is self-contained) ──────────
function WarpBg() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let id: number, frame = 0
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const cx = canvas.width / 2, cy = canvas.height / 2
      const max = Math.sqrt(cx * cx + cy * cy) * 1.4
      for (let i = 0; i < 120; i++) {
        const angle = (i / 120) * Math.PI * 2
        const prog = ((frame * 0.006 + i / 120) % 1)
        const s = Math.max(0, prog - 0.08) * max
        const e = prog * max
        const op = prog < 0.15 ? (prog / 0.15) * 0.35 : prog > 0.85 ? ((1 - prog) / 0.15) * 0.35 : 0.35
        const hue = 270 - prog * 60
        ctx.beginPath()
        ctx.strokeStyle = `hsla(${hue},${80 + prog * 20}%,70%,${op})`
        ctx.lineWidth = 0.6 + prog * 0.4
        ctx.moveTo(cx + Math.cos(angle) * s, cy + Math.sin(angle) * s)
        ctx.lineTo(cx + Math.cos(angle) * e, cy + Math.sin(angle) * e)
        ctx.stroke()
      }
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 80)
      g.addColorStop(0, 'rgba(153,69,255,0.15)')
      g.addColorStop(0.5, 'rgba(0,194,255,0.05)')
      g.addColorStop(1, 'transparent')
      ctx.fillStyle = g
      ctx.beginPath(); ctx.arc(cx, cy, 80, 0, Math.PI * 2); ctx.fill()
      frame++; id = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.6 }} />
}

// ── Main page ───────────────────────────────────────────────────────────────
type State = 'idle' | 'loading' | 'success' | 'duplicate' | 'error'

export default function WaitlistPage() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<State>('idle')
  const [errMsg, setErrMsg] = useState('')
  const [count, setCount] = useState<number | null>(null)

  // Fetch current count on mount
  useEffect(() => {
    fetch('/api/waitlist')
      .then(r => r.json())
      .then(d => { if (typeof d.count === 'number') setCount(d.count) })
      .catch(() => {})
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (state === 'loading' || state === 'success') return
    setState('loading')
    setErrMsg('')

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      })
      const data = await res.json()

      if (res.ok && data.success) {
        setState('success')
        if (typeof data.count === 'number') setCount(data.count)
      } else if (res.status === 409) {
        setState('duplicate')
      } else {
        setState('error')
        setErrMsg(data.error ?? 'Something went wrong. Try again.')
      }
    } catch {
      setState('error')
      setErrMsg('Network error. Please try again.')
    }
  }

  const isSuccess = state === 'success'
  const isDup = state === 'duplicate'
  const isErr = state === 'error'
  const isLoading = state === 'loading'

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-bg-void px-4">
      {/* Warp background */}
      <WarpBg />

      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(153,69,255,0.07) 0%, rgba(0,194,255,0.04) 50%, transparent 100%)',
        }}
      />

      {/* Back link */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-sm font-body text-text-muted hover:text-text-secondary transition-colors duration-200 z-10"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">
        <div
          className="rounded-3xl p-8 sm:p-10 flex flex-col items-center gap-6"
          style={{
            background: 'rgba(17,14,31,0.85)',
            border: '1px solid rgba(153,69,255,0.25)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: '0 0 60px rgba(153,69,255,0.12), 0 0 120px rgba(0,194,255,0.06)',
          }}
        >
          {/* Logo */}
          <div className="relative w-16 h-16">
            <Image
              src="/logo.png"
              alt="VEZTRA"
              fill
              className="object-contain drop-shadow-[0_0_20px_rgba(153,69,255,0.6)]"
            />
          </div>

          {/* Brand */}
          <div className="text-center space-y-1">
            <h1
              className="font-display font-extrabold tracking-[0.15em] text-3xl"
              style={{
                background: 'linear-gradient(90deg, #9945FF 0%, #00C2FF 60%, #14F195 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              VEZTRA
            </h1>
            <p className="font-display font-medium text-text-muted uppercase tracking-[0.2em] text-xs">
              FLEXIBLE VESTING.{' '}
              <span
                style={{
                  background: 'linear-gradient(90deg, #9945FF, #00C2FF)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                TRANSPARENT DISTRIBUTION.
              </span>
            </p>
          </div>

          {/* Heading */}
          {!isSuccess ? (
            <>
              <div className="text-center space-y-2">
                <h2 className="font-display font-bold text-text-primary text-xl">
                  Join the Early Access List
                </h2>
                <p className="font-body text-text-secondary text-sm leading-relaxed">
                  Be first to launch token streams, milestone unlocks, and DAO treasury
                  payouts on Solana — fully on-chain, no middlemen.
                </p>
              </div>

              {/* Count badge */}
              {count !== null && count > 0 && (
                <div
                  className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-body font-semibold"
                  style={{
                    background: 'rgba(153,69,255,0.12)',
                    border: '1px solid rgba(153,69,255,0.3)',
                    color: '#B57FFF',
                  }}
                >
                  <Users className="w-3.5 h-3.5" />
                  {count.toLocaleString()} {count === 1 ? 'person' : 'people'} already signed up
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="w-full space-y-3">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); if (state !== 'idle') setState('idle') }}
                    placeholder="your@email.com"
                    required
                    disabled={isLoading}
                    className="w-full px-5 py-3.5 rounded-2xl font-body text-sm text-text-primary placeholder-text-muted outline-none transition-all duration-200 disabled:opacity-50"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: isDup || isErr
                        ? '1px solid rgba(255,77,77,0.5)'
                        : 'rgba(153,69,255,0.25) solid 1px',
                    }}
                    onFocus={e => {
                      e.currentTarget.style.border = '1px solid rgba(153,69,255,0.6)'
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(153,69,255,0.1)'
                    }}
                    onBlur={e => {
                      e.currentTarget.style.border = isDup || isErr
                        ? '1px solid rgba(255,77,77,0.5)'
                        : '1px solid rgba(153,69,255,0.25)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !email.trim()}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-body font-semibold text-sm text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: isLoading
                      ? 'rgba(153,69,255,0.6)'
                      : 'linear-gradient(90deg, #9945FF 0%, #00C2FF 100%)',
                    boxShadow: isLoading ? 'none' : '0 0 20px rgba(153,69,255,0.3)',
                  }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Joining…
                    </>
                  ) : (
                    <>
                      Join Waitlist <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Inline error feedback */}
                {isDup && (
                  <p className="text-center text-xs font-body" style={{ color: '#FF9D4D' }}>
                    ✓ You&apos;re already on the list — we&apos;ll be in touch!
                  </p>
                )}
                {isErr && (
                  <p className="text-center text-xs font-body" style={{ color: '#FF6B6B' }}>
                    {errMsg}
                  </p>
                )}
              </form>
            </>
          ) : (
            /* ── Success state ── */
            <div className="flex flex-col items-center gap-5 text-center py-2">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  background: 'rgba(20,241,149,0.1)',
                  border: '1px solid rgba(20,241,149,0.3)',
                }}
              >
                <CheckCircle2 className="w-8 h-8" style={{ color: '#14F195' }} />
              </div>

              <div className="space-y-2">
                <h2 className="font-display font-bold text-text-primary text-xl">
                  You&apos;re on the list!
                </h2>
                <p className="font-body text-text-secondary text-sm leading-relaxed">
                  Welcome aboard. We&apos;ll notify you when VEZTRA early access opens.
                  Get ready to launch your first token stream on Solana.
                </p>
              </div>

              {count !== null && count > 0 && (
                <div
                  className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-body font-semibold"
                  style={{
                    background: 'rgba(20,241,149,0.1)',
                    border: '1px solid rgba(20,241,149,0.25)',
                    color: '#14F195',
                  }}
                >
                  <Users className="w-3.5 h-3.5" />
                  #{count.toLocaleString()} on the waitlist
                </div>
              )}

              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl font-body font-medium text-sm text-text-secondary border border-bg-border hover:border-sol-purple/40 hover:text-text-primary transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to home
              </Link>
            </div>
          )}

          {/* Footer note */}
          {!isSuccess && (
            <p className="text-xs font-body text-text-muted text-center">
              No spam. Just early access updates.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

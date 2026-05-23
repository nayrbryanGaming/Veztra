'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { clsx } from 'clsx'

const faqs = [
  {
    q: 'What is VEZTRA?',
    a: 'VEZTRA is a token distribution protocol on Solana. It lets project teams create vesting streams for team members, investors, and contributors — directly on-chain, with no intermediary.',
  },
  {
    q: 'Who controls the locked tokens?',
    a: 'Nobody. Tokens are locked in a PDA-controlled vault — a program-derived address with no private key. Only the on-chain program can release tokens, and only when the vesting schedule allows it.',
  },
  {
    q: 'What vesting schedules are supported?',
    a: 'Currently: cliff vesting (all tokens at a single date) and linear vesting (gradual release over time). Both support an optional cliff period before linear release begins.',
  },
  {
    q: 'What happens if a stream is cancelled?',
    a: 'Vesting freezes immediately. The recipient keeps everything already vested and can claim it at any time. Unvested tokens are returned to the stream creator.',
  },
  {
    q: 'Is the contract audited / open source?',
    a: 'The smart contract is open source. We are building on Solana devnet as part of the Mancer × Superteam Indonesia program.',
  },
  {
    q: 'What wallets are supported?',
    a: 'Phantom and Solflare. Both are supported via Solana wallet-adapter.',
  },
]

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-bg-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left text-text-primary hover:bg-bg-elevated transition-colors"
      >
        <span className="font-body font-medium">{q}</span>
        <ChevronDown className={clsx('w-4 h-4 text-text-muted shrink-0 transition-transform ml-4', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-text-secondary leading-relaxed">
          {a}
        </div>
      )}
    </div>
  )
}

export function FaqSection() {
  return (
    <section id="faq" className="py-24 px-4 sm:px-6 max-w-3xl mx-auto">
      <div className="text-center mb-12 space-y-3">
        <h2 className="font-display font-bold" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)' }}>
          Questions,{' '}
          <span
            className="italic"
            style={{
              background: 'linear-gradient(90deg, #9945FF, #14F195)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            answered.
          </span>
        </h2>
      </div>
      <div className="space-y-3">
        {faqs.map((item, i) => <FaqItem key={i} {...item} />)}
      </div>
    </section>
  )
}

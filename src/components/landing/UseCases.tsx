const useCases = [
  {
    audience: 'TEAMS',
    headline: "Enforce vesting on-chain,\nnot in spreadsheets.",
    body: "Give co-founders and employees their tokens over time. Standard 4-year vesting with 1-year cliff — enforce agreements on-chain.",
    example: '4-year linear · 1-year cliff',
  },
  {
    audience: 'INVESTORS',
    headline: "Deliver the unlock schedule\nyou committed to.",
    body: "Deliver the unlock schedule you committed to. Investors claim on their own — no manual transfers, no trust required.",
    example: '2-year linear · 3-month cliff',
  },
  {
    audience: 'COMMUNITY',
    headline: "Reward contributors\nfairly and transparently.",
    body: "Reward contributors, airdrop participants, or ecosystem grants. Each recipient sees only their own allocation.",
    example: 'Custom schedule per recipient',
  },
]

export function UseCases() {
  return (
    <section className="py-24 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16 space-y-3">
        <h2 className="font-display font-bold" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)' }}>
          Who uses{' '}
          <span
            className="italic"
            style={{
              background: 'linear-gradient(90deg, #9945FF, #14F195)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            VEZTRA.
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {useCases.map((uc) => (
          <div
            key={uc.audience}
            className="rounded-2xl p-px"
            style={{ background: 'linear-gradient(135deg, rgba(153,69,255,0.2), rgba(20,241,149,0.1))' }}
          >
            <div className="rounded-[calc(1rem-1px)] bg-bg-surface p-6 space-y-4 h-full">
              <p className="text-xs font-body font-semibold text-sol-purple uppercase tracking-widest">{uc.audience}</p>
              <h3 className="font-display font-bold text-xl text-text-primary whitespace-pre-line leading-snug">
                {uc.headline}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">{uc.body}</p>
              <div className="pt-2 border-t border-bg-border">
                <p className="text-xs font-mono text-text-muted">{uc.example}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

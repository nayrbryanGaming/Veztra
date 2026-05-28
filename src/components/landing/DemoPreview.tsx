'use client'

export function DemoPreview() {
  return (
    <section id="demo" className="py-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 space-y-3">
          <p className="text-xs font-body font-semibold text-sol-green uppercase tracking-widest">Demo · Live Preview</p>
          <h2 className="font-display font-bold" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)' }}>
            What your{' '}
            <span
              className="italic"
              style={{
                background: 'linear-gradient(90deg, #9945FF, #14F195)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              streams look like.
            </span>
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto text-sm">
            Every stream, its own card. See status, unlocked amount, and remaining time at a glance.
            Recipients only see their own allocation.
          </p>
        </div>

        {/* Demo card */}
        <div
          className="rounded-2xl p-px mx-auto max-w-lg"
          style={{ background: 'linear-gradient(135deg, rgba(153,69,255,0.5), rgba(20,241,149,0.3))' }}
        >
          <div className="rounded-[calc(1rem-1px)] bg-bg-surface p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-body font-semibold text-text-muted uppercase tracking-wider mb-1">Sample Stream</p>
                <p className="text-sm text-text-secondary">Linear Vesting · 24-month · cliff 3 months</p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-sol-green border border-sol-green/30 bg-sol-green/10 uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-sol-green animate-pulse" /> Active
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { label: 'Vested', value: '42.8%' },
                { label: 'Claimed', value: '30.0%' },
                { label: 'Remaining', value: '57.2%' },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-xs text-text-muted uppercase tracking-wider">{s.label}</p>
                  <p className="font-display font-bold text-lg text-text-primary">{s.value}</p>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="space-y-1.5">
              <div className="relative h-3 rounded-full bg-bg-border overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-sol-purple to-sol-green"
                  style={{ width: '42.8%', animation: 'progress-fill 2s ease-out' }}
                />
                <div
                  className="absolute left-0 top-0 h-full rounded-full bg-sol-green/70"
                  style={{ width: '30%', animation: 'progress-fill 2s ease-out' }}
                />
              </div>
              <p className="text-xs text-text-muted">42.8% vested · 30.0% claimed</p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-sm border-t border-bg-border pt-4">
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider">Total</p>
                <p className="font-mono font-semibold text-text-primary">10,000</p>
              </div>
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider">Unlocked</p>
                <p className="font-mono font-semibold text-sol-green">4,280</p>
              </div>
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider">Next Unlock</p>
                <p className="font-mono font-semibold text-text-primary">in 12 days</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="font-mono text-xs text-text-muted">recipient.sol</span>
              <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-body font-semibold bg-gradient-to-r from-sol-purple to-sol-green text-bg-void">
                Withdraw 1,280 →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

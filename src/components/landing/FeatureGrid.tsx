import { TrendingUp, BarChart3, ShieldX } from 'lucide-react'

const features = [
  {
    icon: TrendingUp,
    title: 'Linear Vesting',
    body: 'Tokens release gradually from start to end date. Recipients can claim anytime — the program enforces the exact unlock curve on-chain.',
    tags: ['Cliff support', 'Configurable duration'],
  },
  {
    icon: BarChart3,
    title: 'Cliff Vesting',
    body: 'No tokens until the cliff date — then the full unlocked amount becomes claimable. Perfect for team and investor lock-ups.',
    tags: ['Date-locked', 'Instant unlock at cliff'],
  },
  {
    icon: ShieldX,
    title: 'Cancel & Clawback',
    body: 'Stream creators can cancel any time. Vesting freezes instantly. Recipients keep everything already vested and have time to claim.',
    tags: ['Creator-controlled', 'Fair to recipients'],
  },
]

export function FeatureGrid() {
  return (
    <section id="product" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16 space-y-3">
        <p className="text-xs font-body font-semibold text-sol-green uppercase tracking-widest">Features</p>
        <h2 className="font-display font-bold" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)' }}>
          Everything a token distribution needs.{' '}
          <span
            className="italic"
            style={{
              background: 'linear-gradient(90deg, #9945FF, #14F195)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Nothing it doesn&apos;t.
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f) => {
          const Icon = f.icon
          return (
            <div
              key={f.title}
              className="group relative rounded-2xl p-px transition-all duration-300 hover:-translate-y-1"
              style={{
                background: 'linear-gradient(135deg, rgba(153,69,255,0.3), rgba(20,241,149,0.2))',
              }}
            >
              <div className="rounded-[calc(1rem-1px)] bg-bg-surface p-6 space-y-4 h-full">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sol-purple/20 to-sol-green/10 flex items-center justify-center group-hover:shadow-glow-sm transition-all">
                  <Icon
                    className="w-6 h-6"
                    style={{
                      stroke: 'url(#iconGrad)',
                    }}
                    color="#9945FF"
                  />
                </div>
                <h3 className="font-display font-bold text-lg text-text-primary">{f.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{f.body}</p>
                <div className="flex flex-wrap gap-2">
                  {f.tags.map((tag) => (
                    <span key={tag} className="text-xs px-3 py-1 rounded-full bg-bg-elevated border border-bg-border text-text-muted font-body font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

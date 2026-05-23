const steps = [
  {
    num: '01',
    title: 'Connect & Configure',
    body: 'Connect your Solana wallet (Phantom or Solflare) and choose a vesting type: linear or cliff.',
  },
  {
    num: '02',
    title: 'Create a Stream',
    body: "Enter the recipient's wallet address, token mint, total amount, start date, end date, and optional cliff date. Confirm in your wallet.",
  },
  {
    num: '03',
    title: 'Recipients Claim',
    body: 'When tokens unlock, recipients connect their wallet to the dashboard and claim available tokens with one click. No waiting for manual transfers.',
  },
  {
    num: '04',
    title: 'Cancel if Needed',
    body: "Stream creators can cancel any time. Unvested tokens return to the creator. Vested tokens stay claimable for the recipient.",
  },
]

export function HowItWorks() {
  return (
    <section id="how" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16 space-y-3">
        <p className="text-xs font-body font-semibold text-sol-green uppercase tracking-widest">How it works</p>
        <h2 className="font-display font-bold" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)' }}>
          Four steps.{' '}
          <span
            className="italic"
            style={{
              background: 'linear-gradient(90deg, #9945FF, #14F195)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            From setup to claim.
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        <div className="hidden lg:block absolute top-10 left-[25%] right-[25%] h-px bg-gradient-to-r from-sol-purple/30 to-sol-green/30" />

        {steps.map((step) => (
          <div key={step.num} className="relative space-y-4">
            <div className="relative">
              <span
                className="font-display font-black text-6xl absolute -top-2 -left-2 opacity-10 select-none pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, #9945FF, #14F195)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {step.num}
              </span>
              <div className="relative z-10 w-10 h-10 rounded-xl bg-gradient-to-br from-sol-purple to-sol-green flex items-center justify-center shadow-glow-sm">
                <span className="font-display font-bold text-sm text-bg-void">{step.num}</span>
              </div>
            </div>
            <h3 className="font-display font-bold text-lg text-text-primary">{step.title}</h3>
            <p className="text-sm text-text-secondary leading-relaxed">{step.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

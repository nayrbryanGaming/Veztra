import Link from 'next/link'
import { ArrowRight, ExternalLink } from 'lucide-react'

export function WaitlistCTA() {
  return (
    <section className="relative py-32 px-4 sm:px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-sol-purple/8 blur-3xl" />
      </div>

      <div className="relative max-w-3xl mx-auto text-center space-y-8">
        <h2 className="font-display font-bold" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
          Start distributing tokens{' '}
          <span
            className="italic"
            style={{
              background: 'linear-gradient(90deg, #9945FF, #14F195)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            with VEZTRA.
          </span>
        </h2>
        <p className="text-text-secondary text-lg">
          Connect your wallet and create your first stream in under 2 minutes.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-body font-semibold bg-gradient-to-r from-sol-purple to-sol-green text-bg-void hover:scale-[1.02] transition-all duration-200 shadow-glow-purple"
          >
            Launch App <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="https://github.com/nayrbryanGaming/Veztra"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-body font-medium text-text-secondary border border-bg-border hover:border-sol-purple/40 hover:text-text-primary transition-all duration-200"
          >
            View on GitHub <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  )
}

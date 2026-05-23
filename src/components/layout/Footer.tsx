import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'

export function Footer() {
  return (
    <footer className="border-t border-bg-border bg-bg-surface/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                <defs>
                  <linearGradient id="vGrad2" x1="0" y1="0" x2="28" y2="28">
                    <stop offset="0%" stopColor="#9945FF" />
                    <stop offset="100%" stopColor="#14F195" />
                  </linearGradient>
                </defs>
                <path d="M2 4 L14 22 L26 4" stroke="url(#vGrad2)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <circle cx="14" cy="22" r="2.5" fill="url(#vGrad2)" />
              </svg>
              <span className="font-display font-bold text-text-primary tracking-wide">VESTRA</span>
            </div>
            <p className="text-sm text-text-muted max-w-xs">
              Solana-native token vesting and distribution infrastructure.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 md:gap-12 text-sm text-text-secondary">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Product</p>
              <nav className="flex flex-col gap-2">
                <Link href="/#product" className="hover:text-text-primary transition-colors">Features</Link>
                <Link href="/dashboard" className="hover:text-text-primary transition-colors">Dashboard</Link>
                <Link href="/stream/create" className="hover:text-text-primary transition-colors">Create Stream</Link>
              </nav>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Links</p>
              <nav className="flex flex-col gap-2">
                <a href="https://github.com/nayrbryanGaming/Vestra" target="_blank" rel="noopener noreferrer" className="hover:text-text-primary transition-colors">GitHub</a>
                <a href="https://solana.com" target="_blank" rel="noopener noreferrer" className="hover:text-text-primary transition-colors">Solana</a>
              </nav>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-bg-border flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-text-muted font-mono">
            © 2026 VESTRA · BUILT ON SOLANA
          </p>
          <Badge variant="devnet">● DEVNET</Badge>
        </div>
      </div>
    </footer>
  )
}

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { WalletButton } from '@/components/wallet/WalletButton'
import { Badge } from '@/components/ui/Badge'
import { clsx } from 'clsx'

const VeztraLogo = () => (
  <div className="flex items-center gap-2.5">
    <img src="/logo.png" alt="VEZTRA" className="w-8 h-8 object-contain" />
    <span className="font-display font-bold text-lg tracking-wider"
      style={{
        background: 'linear-gradient(90deg, #9945FF, #00C2FF)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}
    >
      VEZTRA
    </span>
  </div>
)

const navLinks = [
  { href: '/#product', label: 'Product' },
  { href: '/#how', label: 'How it works' },
  { href: '/#demo', label: 'Demo' },
  { href: '/#faq', label: 'FAQ' },
]

export function Navbar() {
  const pathname = usePathname()
  const isApp = pathname !== '/'
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav className={clsx(
      'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
      (scrolled || isApp) ? 'bg-bg-surface/95 backdrop-blur-md border-b border-bg-border' : 'bg-transparent'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-3">
            <VeztraLogo />
            <Badge variant="devnet">DEVNET</Badge>
          </div>
        </Link>

        {!isApp && (
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-body text-text-secondary hover:text-text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}

        {isApp && (
          <div className="hidden md:flex items-center gap-6">
            {[
              { href: '/dashboard', label: 'Dashboard' },
              { href: '/explore', label: 'Explore' },
              { href: '/docs', label: 'Docs' },
            ].map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  'text-sm font-body transition-colors',
                  pathname === link.href ? 'text-sol-purple' : 'text-text-secondary hover:text-text-primary'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3">
          <WalletButton />
          {!isApp && (
            <Link
              href="/dashboard"
              className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-body font-medium text-bg-void hover:scale-[1.02] transition-all duration-200"
              style={{ background: 'linear-gradient(90deg, #9945FF, #00C2FF)' }}
            >
              Launch App
            </Link>
          )}
          {!isApp && (
            <button
              className="md:hidden text-text-secondary"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>

      {mobileOpen && !isApp && (
        <div className="md:hidden bg-bg-surface border-b border-bg-border px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block text-sm font-body text-text-secondary hover:text-text-primary transition-colors py-2"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/dashboard"
            className="block w-full text-center px-5 py-2.5 rounded-xl text-sm font-body font-medium text-bg-void"
            style={{ background: 'linear-gradient(90deg, #9945FF, #00C2FF)' }}
            onClick={() => setMobileOpen(false)}
          >
            Launch App
          </Link>
        </div>
      )}
    </nav>
  )
}

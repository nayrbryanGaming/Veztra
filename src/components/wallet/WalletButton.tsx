'use client'

import { useState, useRef, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { Wallet, ChevronDown, Copy, ExternalLink, LogOut, Check } from 'lucide-react'
import { truncateAddress } from '@/lib/format'
import { explorerUrl } from '@/lib/constants'
import { clsx } from 'clsx'

export function WalletButton({ className }: { className?: string }) {
  const { publicKey, disconnect, connected } = useWallet()
  const { setVisible } = useWalletModal()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleCopy = async () => {
    if (!publicKey) return
    await navigator.clipboard.writeText(publicKey.toBase58())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!connected || !publicKey) {
    return (
      <button
        onClick={() => setVisible(true)}
        className={clsx(
          'relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-body font-medium text-text-primary',
          'border border-transparent bg-clip-padding',
          'before:absolute before:inset-0 before:rounded-full before:p-px before:bg-gradient-brand before:-z-10',
          'hover:scale-[1.02] transition-all duration-200',
          className
        )}
      >
        <Wallet className="w-4 h-4" />
        Connect Wallet
      </button>
    )
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className={clsx(
          'relative inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-body font-medium text-text-primary',
          'bg-bg-elevated border border-bg-border',
          'hover:border-sol-purple/40 transition-all duration-200',
          className
        )}
      >
        <span className="w-2 h-2 rounded-full bg-sol-green" />
        <span className="font-mono text-xs">{truncateAddress(publicKey.toBase58())}</span>
        <ChevronDown className={clsx('w-3.5 h-3.5 transition-transform', dropdownOpen && 'rotate-180')} />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-bg-elevated border border-bg-border rounded-2xl shadow-card-hover z-50 overflow-hidden animate-slide-up">
          <div className="p-3 border-b border-bg-border">
            <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Connected</p>
            <p className="font-mono text-xs text-text-primary break-all">{publicKey.toBase58()}</p>
          </div>
          <div className="p-1">
            <button
              onClick={handleCopy}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-surface rounded-xl transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-sol-green" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Address'}
            </button>
            <a
              href={explorerUrl('address', publicKey.toBase58())}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-surface rounded-xl transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              View on Explorer
            </a>
            <button
              onClick={() => { setVisible(true); setDropdownOpen(false) }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-surface rounded-xl transition-colors"
            >
              <Wallet className="w-4 h-4" />
              Change Wallet
            </button>
            <button
              onClick={() => { disconnect(); setDropdownOpen(false) }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-text-danger hover:bg-text-danger/10 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

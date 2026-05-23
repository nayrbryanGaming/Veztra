'use client'

import { useState } from 'react'
import { Copy, Check, ExternalLink } from 'lucide-react'
import { truncateAddress } from '@/lib/format'
import { explorerUrl } from '@/lib/constants'
import { clsx } from 'clsx'

interface AddressDisplayProps {
  address: string
  showCopy?: boolean
  showExplorer?: boolean
  className?: string
}

export function AddressDisplay({ address, showCopy = true, showExplorer, className }: AddressDisplayProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <span className={clsx('inline-flex items-center gap-1.5', className)}>
      <span className="font-mono text-sm text-text-secondary">
        {truncateAddress(address)}
      </span>
      {showCopy && (
        <button
          onClick={handleCopy}
          className="text-text-muted hover:text-sol-green transition-colors"
          title="Copy address"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      )}
      {showExplorer && (
        <a
          href={explorerUrl('address', address)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-text-muted hover:text-sol-blue transition-colors"
          title="View on Explorer"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      )}
    </span>
  )
}

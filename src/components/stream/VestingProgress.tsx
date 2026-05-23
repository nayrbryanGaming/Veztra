'use client'

import { clsx } from 'clsx'

interface VestingProgressProps {
  totalAmount: number
  vestedAmount: number
  claimedAmount: number
  className?: string
}

export function VestingProgress({ totalAmount, vestedAmount, claimedAmount, className }: VestingProgressProps) {
  const vestedPct = totalAmount > 0 ? Math.min(100, (vestedAmount / totalAmount) * 100) : 0
  const claimedPct = totalAmount > 0 ? Math.min(vestedPct, (claimedAmount / totalAmount) * 100) : 0

  return (
    <div className={clsx('space-y-2', className)}>
      <div className="relative h-2.5 rounded-full bg-bg-border overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-sol-purple to-sol-green transition-all duration-1000"
          style={{ width: `${vestedPct}%` }}
        />
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-sol-green/80 transition-all duration-1000"
          style={{ width: `${claimedPct}%` }}
        />
      </div>
      <p className="text-xs text-text-muted">
        <span className="text-sol-green">{vestedPct.toFixed(1)}%</span> vested
        {claimedPct > 0 && (
          <> · <span className="text-text-secondary">{claimedPct.toFixed(1)}%</span> claimed</>
        )}
      </p>
    </div>
  )
}

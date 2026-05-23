'use client'

import { clsx } from 'clsx'

type BadgeVariant = 'active' | 'completed' | 'cancelled' | 'linear' | 'cliff' | 'milestone' | 'devnet' | 'default'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  active: 'border-sol-green/40 text-sol-green bg-sol-green/10',
  completed: 'border-sol-blue/40 text-sol-blue bg-sol-blue/10',
  cancelled: 'border-text-danger/40 text-text-danger bg-text-danger/10',
  linear: 'border-bg-border text-text-muted bg-bg-elevated',
  cliff: 'border-sol-blue/30 text-sol-blue bg-sol-blue/10',
  milestone: 'border-sol-purple/40 text-sol-purple bg-sol-purple/10',
  devnet: 'border-sol-green/40 text-sol-green bg-sol-green/10',
  default: 'border-bg-border text-text-secondary bg-bg-elevated',
}

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-body font-semibold border uppercase tracking-wider',
        variantStyles[variant],
        className
      )}
    >
      {(variant === 'active' || variant === 'devnet') && (
        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse-slow" />
      )}
      {children}
    </span>
  )
}

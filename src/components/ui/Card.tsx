'use client'

import { HTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  glow?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ hover, glow, children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'relative rounded-2xl p-px',
          'before:absolute before:inset-0 before:rounded-[inherit] before:bg-gradient-to-br before:from-sol-purple/30 before:to-sol-green/20 before:-z-10',
          hover && 'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover cursor-pointer',
          glow && 'shadow-glow-sm',
          className
        )}
        {...props}
      >
        <div className="rounded-[calc(1rem-1px)] bg-bg-surface h-full">
          {children}
        </div>
      </div>
    )
  }
)

Card.displayName = 'Card'

'use client'

import { forwardRef, InputHTMLAttributes } from 'react'
import { clsx } from 'clsx'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helper?: string
  mono?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helper, mono, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-body font-semibold text-text-secondary uppercase tracking-widest">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={clsx(
            'w-full bg-bg-elevated border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted',
            'transition-all duration-200 outline-none',
            'focus:border-sol-purple/60 focus:ring-1 focus:ring-sol-purple/30',
            mono && 'font-mono text-xs',
            error ? 'border-text-danger/60' : 'border-bg-border',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-text-danger">{error}</p>}
        {helper && !error && <p className="text-xs text-text-muted">{helper}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'

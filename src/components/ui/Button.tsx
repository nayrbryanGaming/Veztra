'use client'

import { forwardRef, ButtonHTMLAttributes } from 'react'
import { clsx } from 'clsx'
import { Loader2 } from 'lucide-react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  pill?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, pill, children, className, disabled, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center gap-2 font-body font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sol-purple/50 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]'

    const variants: Record<ButtonVariant, string> = {
      primary: 'bg-gradient-to-r from-sol-purple to-sol-green text-bg-void hover:scale-[1.02] shadow-glow-sm hover:shadow-glow-purple',
      secondary: 'border border-sol-purple/60 text-text-primary hover:scale-[1.02] hover:border-sol-purple hover:bg-sol-purple/5',
      ghost: 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated',
      danger: 'border border-text-danger/50 text-text-danger hover:bg-text-danger/10',
    }

    const sizes: Record<ButtonSize, string> = {
      sm: 'px-4 py-1.5 text-sm',
      md: 'px-6 py-2.5 text-sm',
      lg: 'px-8 py-3.5 text-base',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={clsx(
          base,
          variants[variant],
          sizes[size],
          pill ? 'rounded-full' : 'rounded-xl',
          className
        )}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

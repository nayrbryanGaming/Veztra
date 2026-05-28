'use client'

import Link from 'next/link'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { WarpBackground } from './WarpBackground'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16 bg-bg-void">
      {/* Animated warp-speed background */}
      <WarpBackground />

      {/* Subtle radial overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(153,69,255,0.06) 0%, rgba(0,194,255,0.03) 50%, transparent 100%)',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-8">
        {/* Badge */}
        <div className="animate-slide-up" style={{ animationDelay: '0.4s', opacity: 0, animationFillMode: 'forwards' }}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-body font-semibold text-sol-green border border-sol-green/30 bg-sol-green/10 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-sol-green animate-pulse" />
            Powered by Solana
          </span>
        </div>

        {/* Logo */}
        <div className="animate-slide-up flex justify-center" style={{ animationDelay: '0.5s', opacity: 0, animationFillMode: 'forwards' }}>
          <img
            src="/logo.png"
            alt="VEZTRA"
            className="w-24 h-24 object-contain drop-shadow-[0_0_30px_rgba(153,69,255,0.5)]"
          />
        </div>

        {/* Brand name */}
        <div className="animate-slide-up" style={{ animationDelay: '0.6s', opacity: 0, animationFillMode: 'forwards' }}>
          <h1 className="font-display font-extrabold tracking-[0.15em]" style={{ fontSize: 'clamp(3rem, 9vw, 7rem)' }}>
            <span
              style={{
                background: 'linear-gradient(90deg, #9945FF 0%, #00C2FF 60%, #14F195 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              VEZTRA
            </span>
          </h1>
        </div>

        {/* Tagline */}
        <div className="animate-slide-up" style={{ animationDelay: '0.75s', opacity: 0, animationFillMode: 'forwards' }}>
          <p className="font-display font-medium text-text-secondary uppercase tracking-[0.25em] text-sm sm:text-base">
            FLEXIBLE VESTING.{' '}
            <span
              style={{
                background: 'linear-gradient(90deg, #9945FF, #00C2FF)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              TRANSPARENT DISTRIBUTION.
            </span>
          </p>
        </div>

        {/* Subtitle */}
        <div className="animate-slide-up" style={{ animationDelay: '0.9s', opacity: 0, animationFillMode: 'forwards' }}>
          <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Manage token allocation, milestone unlocks, and treasury distribution
            with full on-chain transparency. Built for teams, DAOs, and investors on Solana.
          </p>
        </div>

        {/* CTAs */}
        <div
          className="animate-slide-up flex flex-wrap gap-4 justify-center"
          style={{ animationDelay: '1.05s', opacity: 0, animationFillMode: 'forwards' }}
        >
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-base font-body font-semibold text-bg-void hover:scale-[1.03] transition-all duration-200"
            style={{ background: 'linear-gradient(90deg, #9945FF, #00C2FF)' }}
          >
            Launch App <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="https://github.com/nayrbryanGaming/Veztra"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-base font-body font-medium text-text-primary border border-sol-purple/40 bg-sol-purple/5 hover:bg-sol-purple/10 hover:border-sol-purple/70 hover:scale-[1.02] transition-all duration-200"
          >
            View on GitHub <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Stats */}
        <div
          className="animate-slide-up grid grid-cols-3 gap-6 mt-16 pt-12 border-t border-bg-border"
          style={{ animationDelay: '1.2s', opacity: 0, animationFillMode: 'forwards' }}
        >
          {[
            { label: 'Total Distributed', value: '$0+' },
            { label: 'Active Streams', value: '0' },
            { label: 'Recipients Served', value: '0' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-xs font-body font-semibold text-text-muted uppercase tracking-wider mb-2">{stat.label}</p>
              <p
                className="font-display font-bold text-3xl"
                style={{
                  background: 'linear-gradient(90deg, #9945FF, #00C2FF)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-0.5 h-8 bg-gradient-to-b from-sol-purple to-transparent mx-auto" />
      </div>
    </section>
  )
}

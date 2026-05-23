'use client'

import Link from 'next/link'
import { ArrowRight, ExternalLink } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-sol-purple/10 blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-sol-green/8 blur-3xl animate-float" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-sol-purple/5 blur-3xl" />
        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#9945FF 1px, transparent 1px), linear-gradient(90deg, #9945FF 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-8">
        {/* Badge */}
        <div className="animate-slide-up" style={{ animationDelay: '0.4s', opacity: 0, animationFillMode: 'forwards' }}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-body font-semibold text-sol-green border border-sol-green/30 bg-sol-green/10 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-sol-green animate-pulse" />
            Powered by Solana
          </span>
        </div>

        {/* Headline */}
        <div className="animate-slide-up" style={{ animationDelay: '0.6s', opacity: 0, animationFillMode: 'forwards' }}>
          <h1 className="font-display font-extrabold leading-tight tracking-tight" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
            Flexible Vesting
            <br />
            Infrastructure,{' '}
            <span
              className="italic"
              style={{
                background: 'linear-gradient(90deg, #9945FF, #14F195)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Powered Onchain.
            </span>
          </h1>
        </div>

        {/* Subtitle */}
        <div className="animate-slide-up" style={{ animationDelay: '0.8s', opacity: 0, animationFillMode: 'forwards' }}>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Manage token allocation, milestone unlocks, and treasury distribution with
            transparency. Built for teams, DAOs, and investors on Solana.
          </p>
        </div>

        {/* CTAs */}
        <div className="animate-slide-up flex flex-wrap gap-4 justify-center" style={{ animationDelay: '1s', opacity: 0, animationFillMode: 'forwards' }}>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-base font-body font-semibold bg-gradient-to-r from-sol-purple to-sol-green text-bg-void hover:scale-[1.02] transition-all duration-200 shadow-glow-purple"
          >
            Launch App <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="https://github.com/nayrbryanGaming/Vestra"
            target="_blank"
            rel="noopener noreferrer"
            className="relative inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-base font-body font-medium text-text-primary border border-transparent bg-clip-padding before:absolute before:inset-0 before:rounded-full before:p-px before:bg-gradient-brand before:-z-10 hover:scale-[1.02] transition-all duration-200"
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
                  background: 'linear-gradient(90deg, #9945FF, #14F195)',
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

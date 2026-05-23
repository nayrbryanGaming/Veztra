'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { Plus, Inbox, Layers } from 'lucide-react'
import { useStreams } from '@/hooks/useStreams'
import { StreamCard } from '@/components/stream/StreamCard'
import { StreamCardSkeleton } from '@/components/ui/Skeleton'
import { Button } from '@/components/ui/Button'
import { formatRawAmount } from '@/lib/format'
import { ParsedStream } from '@/types/stream'
import { clsx } from 'clsx'

function EmptyState({ type }: { type: 'creator' | 'recipient' }) {
  return (
    <div className="col-span-2 flex flex-col items-center justify-center py-20 text-center space-y-4">
      {type === 'creator'
        ? <Plus className="w-12 h-12 text-text-muted" />
        : <Inbox className="w-12 h-12 text-text-muted" />}
      <div>
        <p className="font-display font-bold text-lg text-text-primary">
          {type === 'creator' ? 'No streams created yet' : 'No incoming streams'}
        </p>
        <p className="text-sm text-text-muted mt-1">
          {type === 'creator'
            ? 'Create your first vesting stream to get started.'
            : 'Ask your team or project to create a stream to your wallet.'}
        </p>
      </div>
      {type === 'creator' && (
        <Link href="/stream/create">
          <Button variant="primary" size="sm">Create Stream</Button>
        </Link>
      )}
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl p-px" style={{ background: 'linear-gradient(135deg, rgba(153,69,255,0.2), rgba(20,241,149,0.1))' }}>
      <div className="rounded-[calc(1rem-1px)] bg-bg-surface px-5 py-4">
        <p className="text-xs font-body font-semibold text-text-muted uppercase tracking-wider mb-1">{label}</p>
        <p className="font-display font-bold text-2xl text-text-primary">{value}</p>
      </div>
    </div>
  )
}

function calcTotals(streams: ParsedStream[]) {
  const active = streams.filter((s) => s.status === 'active').length
  const locked = streams.reduce((sum, s) => sum + (s.amount - s.claimedAmount), 0) / 1e6
  const claimed = streams.reduce((sum, s) => sum + s.claimedAmount, 0) / 1e6
  return { active, locked, claimed }
}

export default function DashboardPage() {
  const { publicKey, connected } = useWallet()
  const { setVisible } = useWalletModal()
  const { data, isLoading } = useStreams()
  const [tab, setTab] = useState<'creator' | 'recipient'>('creator')

  if (!connected) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center space-y-6 pt-16">
        <div className="space-y-2">
          <svg className="w-16 h-16 mx-auto mb-4" viewBox="0 0 28 28" fill="none">
            <defs>
              <linearGradient id="vGrad3" x1="0" y1="0" x2="28" y2="28">
                <stop offset="0%" stopColor="#9945FF" />
                <stop offset="100%" stopColor="#14F195" />
              </linearGradient>
            </defs>
            <path d="M2 4 L14 22 L26 4" stroke="url(#vGrad3)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="14" cy="22" r="2.5" fill="url(#vGrad3)" />
          </svg>
          <h1 className="font-display font-bold text-2xl text-text-primary">Connect your wallet to get started</h1>
          <p className="text-text-secondary text-sm max-w-xs mx-auto">
            View your active streams, claim tokens, and manage distributions.
          </p>
        </div>
        <Button variant="primary" size="lg" pill onClick={() => setVisible(true)}>
          Connect Wallet
        </Button>
      </div>
    )
  }

  const streams = tab === 'creator' ? (data?.creatorStreams ?? []) : (data?.recipientStreams ?? [])
  const totals = calcTotals(tab === 'creator' ? (data?.creatorStreams ?? []) : (data?.recipientStreams ?? []))

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="font-display font-bold text-3xl text-text-primary">Dashboard</h1>
          <Link href="/stream/create">
            <Button variant="primary" size="md" pill>
              <Plus className="w-4 h-4" /> Create Stream
            </Button>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-bg-elevated rounded-xl p-1 w-fit">
          {(['creator', 'recipient'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={clsx(
                'px-5 py-2 rounded-lg text-sm font-body font-medium transition-all',
                tab === t
                  ? 'bg-gradient-to-r from-sol-purple to-sol-green text-bg-void'
                  : 'text-text-secondary hover:text-text-primary'
              )}
            >
              {t === 'creator' ? 'As Creator' : 'As Recipient'}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard label="Active Streams" value={String(totals.active)} />
          <StatCard label="Total Locked" value={`${formatRawAmount(totals.locked)}`} />
          <StatCard label="Total Claimed" value={`${formatRawAmount(totals.claimed)}`} />
        </div>

        {/* Stream list */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {isLoading ? (
            <>
              <StreamCardSkeleton />
              <StreamCardSkeleton />
              <StreamCardSkeleton />
            </>
          ) : streams.length === 0 ? (
            <EmptyState type={tab} />
          ) : (
            streams.map((stream) => (
              <StreamCard key={stream.publicKey.toBase58()} stream={stream} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

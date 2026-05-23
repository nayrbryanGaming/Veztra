'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { useProgram } from '@/hooks/useProgram'
import { parseStreamAccount } from '@/lib/stream'
import { formatRawAmount, formatDate } from '@/lib/format'
import { StreamStatusBadge, VestingTypeBadge } from '@/components/stream/StreamStatusBadge'
import { AddressDisplay } from '@/components/ui/AddressDisplay'
import { Skeleton, StreamCardSkeleton } from '@/components/ui/Skeleton'
import { ParsedStream } from '@/types/stream'
import { ExternalLink, Search, Filter, TrendingUp, Users, Coins, Activity } from 'lucide-react'
import { explorerUrl } from '@/lib/constants'
import { clsx } from 'clsx'

type FilterType = 'all' | 'active' | 'completed' | 'cancelled'
type VestingFilter = 'all' | 'linear' | 'cliff' | 'milestone'

function StatBadge({ label, value, gradient }: { label: string; value: string; gradient: string }) {
  return (
    <div className="rounded-2xl p-px" style={{ background: gradient }}>
      <div className="rounded-[calc(1rem-1px)] bg-bg-surface px-5 py-4">
        <p className="text-xs font-body font-semibold text-text-muted uppercase tracking-wider mb-1">{label}</p>
        <p className="font-display font-bold text-2xl text-text-primary">{value}</p>
      </div>
    </div>
  )
}

function StreamRow({ stream }: { stream: ParsedStream }) {
  const amountNum = stream.amount / 1e6
  const claimableNum = stream.claimableAmount / 1e6

  return (
    <Link
      href={`/stream/${stream.publicKey.toBase58()}`}
      className="group flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl transition-all duration-200 border border-bg-border hover:border-sol-purple/30 hover:bg-bg-elevated"
    >
      <div className="flex items-center gap-2 min-w-0">
        <StreamStatusBadge status={stream.status} />
        <VestingTypeBadge type={stream.vestingType} />
      </div>

      <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
        <div>
          <p className="text-xs text-text-muted mb-0.5">From</p>
          <span className="font-mono text-xs text-text-secondary">
            {stream.creator.slice(0, 6)}…{stream.creator.slice(-4)}
          </span>
        </div>
        <div>
          <p className="text-xs text-text-muted mb-0.5">To</p>
          <span className="font-mono text-xs text-text-secondary">
            {stream.recipient.slice(0, 6)}…{stream.recipient.slice(-4)}
          </span>
        </div>
        <div>
          <p className="text-xs text-text-muted mb-0.5">Total</p>
          <span className="font-mono text-xs text-text-primary font-semibold">{formatRawAmount(amountNum)}</span>
        </div>
        <div>
          <p className="text-xs text-text-muted mb-0.5">Progress</p>
          <span className="font-mono text-xs" style={{ color: '#14F195' }}>{stream.progressPercent.toFixed(1)}%</span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-text-muted">
        <span>{formatDate(stream.startTime)}</span>
        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-sol-purple" />
      </div>
    </Link>
  )
}

export default function ExplorePage() {
  const program = useProgram()
  const [statusFilter, setStatusFilter] = useState<FilterType>('all')
  const [vestingFilter, setVestingFilter] = useState<VestingFilter>('all')
  const [search, setSearch] = useState('')

  const { data: allStreams, isLoading } = useQuery({
    queryKey: ['explore-streams'],
    queryFn: async (): Promise<ParsedStream[]> => {
      if (!program) return []
      const raw = await (program.account as any).stream.all()
      return (raw as any[]).map((s: any) => parseStreamAccount(s as any))
    },
    enabled: !!program,
    refetchInterval: 30_000,
    staleTime: 15_000,
  })

  const streams = allStreams ?? []

  // Stats
  const stats = {
    total: streams.length,
    active: streams.filter(s => s.status === 'active').length,
    totalLocked: streams.reduce((sum, s) => sum + (s.amount - s.claimedAmount), 0) / 1e6,
    totalClaimed: streams.reduce((sum, s) => sum + s.claimedAmount, 0) / 1e6,
  }

  // Filtered streams
  const filtered = streams.filter(s => {
    if (statusFilter !== 'all' && s.status !== statusFilter) return false
    if (vestingFilter !== 'all' && s.vestingType !== vestingFilter) return false
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      if (!s.creator.toLowerCase().includes(q) && !s.recipient.toLowerCase().includes(q)) return false
    }
    return true
  })

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="font-display font-bold text-3xl text-text-primary">Stream Explorer</h1>
          <p className="text-text-secondary mt-1">
            Browse all vesting streams on VEZTRA — fully on-chain, fully transparent.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatBadge
            label="Total Streams"
            value={isLoading ? '…' : String(stats.total)}
            gradient="linear-gradient(135deg, rgba(153,69,255,0.3), rgba(0,194,255,0.15))"
          />
          <StatBadge
            label="Active"
            value={isLoading ? '…' : String(stats.active)}
            gradient="linear-gradient(135deg, rgba(20,241,149,0.2), rgba(0,194,255,0.1))"
          />
          <StatBadge
            label="Total Locked"
            value={isLoading ? '…' : formatRawAmount(stats.totalLocked)}
            gradient="linear-gradient(135deg, rgba(153,69,255,0.2), rgba(20,241,149,0.1))"
          />
          <StatBadge
            label="Total Claimed"
            value={isLoading ? '…' : formatRawAmount(stats.totalClaimed)}
            gradient="linear-gradient(135deg, rgba(0,194,255,0.2), rgba(153,69,255,0.1))"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by wallet address…"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-bg-elevated border border-bg-border text-sm text-text-primary placeholder-text-muted outline-none focus:border-sol-purple/40 transition-colors font-mono"
            />
          </div>

          {/* Status filter */}
          <div className="flex gap-1 bg-bg-elevated rounded-xl p-1">
            {(['all', 'active', 'completed', 'cancelled'] as FilterType[]).map(f => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={clsx(
                  'px-3 py-1.5 rounded-lg text-xs font-body font-medium transition-all capitalize',
                  statusFilter === f
                    ? 'bg-gradient-to-r from-sol-purple to-sol-blue text-white'
                    : 'text-text-secondary hover:text-text-primary'
                )}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Vesting filter */}
          <div className="flex gap-1 bg-bg-elevated rounded-xl p-1">
            {(['all', 'linear', 'cliff', 'milestone'] as VestingFilter[]).map(f => (
              <button
                key={f}
                onClick={() => setVestingFilter(f)}
                className={clsx(
                  'px-3 py-1.5 rounded-lg text-xs font-body font-medium transition-all capitalize',
                  vestingFilter === f
                    ? 'bg-sol-purple/20 text-sol-purple border border-sol-purple/30'
                    : 'text-text-secondary hover:text-text-primary'
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Stream list */}
        <div className="space-y-2">
          {isLoading ? (
            <>
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center space-y-2">
              <Activity className="w-12 h-12 text-text-muted mx-auto" />
              <p className="text-text-muted text-sm">
                {streams.length === 0
                  ? 'No streams on devnet yet. Be the first to create one!'
                  : 'No streams match your filters.'}
              </p>
              {streams.length === 0 && (
                <Link
                  href="/stream/create"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-body font-semibold text-white mt-2"
                  style={{ background: 'linear-gradient(90deg, #9945FF, #00C2FF)' }}
                >
                  Create First Stream
                </Link>
              )}
            </div>
          ) : (
            <>
              <p className="text-xs text-text-muted">{filtered.length} stream{filtered.length !== 1 ? 's' : ''} found</p>
              {filtered.map(stream => (
                <StreamRow key={stream.publicKey.toBase58()} stream={stream} />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

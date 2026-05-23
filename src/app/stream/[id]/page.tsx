'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useStream } from '@/hooks/useStream'
import { StreamStatusBadge, VestingTypeBadge } from '@/components/stream/StreamStatusBadge'
import { VestingProgress } from '@/components/stream/VestingProgress'
import { WithdrawButton } from '@/components/stream/WithdrawButton'
import { CancelButton } from '@/components/stream/CancelButton'
import { AddressDisplay } from '@/components/ui/AddressDisplay'
import { Skeleton } from '@/components/ui/Skeleton'
import { Button } from '@/components/ui/Button'
import { formatDate, formatRawAmount, formatDuration } from '@/lib/format'
import { explorerUrl } from '@/lib/constants'

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-bg-border last:border-0">
      <span className="text-xs font-body font-semibold text-text-muted uppercase tracking-wider">{label}</span>
      <span className="text-sm text-text-primary">{children}</span>
    </div>
  )
}

export default function StreamDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { publicKey } = useWallet()
  const { data: stream, isLoading, error } = useStream(id)

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    )
  }

  if (error || !stream) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 max-w-5xl mx-auto text-center space-y-4">
        <p className="text-text-danger">Stream not found or error loading.</p>
        <Link href="/dashboard"><Button variant="secondary">Back to Dashboard</Button></Link>
      </div>
    )
  }

  const isRecipient = publicKey?.toBase58() === stream.recipient
  const isCreator = publicKey?.toBase58() === stream.creator

  const amountNum = stream.amount / 1e6
  const vestedNum = stream.vestedAmount / 1e6
  const claimedNum = stream.claimedAmount / 1e6
  const claimableNum = stream.claimableAmount / 1e6
  const remainingNum = (stream.amount - stream.claimedAmount) / 1e6

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> My Streams
          </Link>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <StreamStatusBadge status={stream.status} />
                <VestingTypeBadge type={stream.vestingType} />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-text-muted">{stream.publicKey.toBase58().slice(0, 8)}...{stream.publicKey.toBase58().slice(-8)}</span>
                <a href={explorerUrl('address', stream.publicKey.toBase58())} target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-sol-blue">
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Details panel */}
          <div className="rounded-2xl p-px" style={{ background: 'linear-gradient(135deg, rgba(153,69,255,0.2), rgba(20,241,149,0.1))' }}>
            <div className="rounded-[calc(1rem-1px)] bg-bg-surface p-6 space-y-6">
              <div>
                <p className="text-xs font-body font-semibold text-text-muted uppercase tracking-wider mb-3">Participants</p>
                <DetailRow label="Creator">
                  <AddressDisplay address={stream.creator} showCopy showExplorer />
                </DetailRow>
                <DetailRow label="Recipient">
                  <AddressDisplay address={stream.recipient} showCopy showExplorer />
                </DetailRow>
                <DetailRow label="Token Mint">
                  <AddressDisplay address={stream.mint} showCopy showExplorer />
                </DetailRow>
              </div>

              <div>
                <p className="text-xs font-body font-semibold text-text-muted uppercase tracking-wider mb-3">Amounts</p>
                <DetailRow label="Total Amount">
                  <span className="font-mono">{formatRawAmount(amountNum)} tokens</span>
                </DetailRow>
                <DetailRow label="Vested Amount">
                  <span className="font-mono text-sol-green">{formatRawAmount(vestedNum)} ({stream.progressPercent.toFixed(1)}%)</span>
                </DetailRow>
                <DetailRow label="Claimed Amount">
                  <span className="font-mono">{formatRawAmount(claimedNum)}</span>
                </DetailRow>
                <DetailRow label="Claimable Now">
                  <span className="font-mono text-sol-green">{formatRawAmount(claimableNum)}</span>
                </DetailRow>
                <DetailRow label="Remaining">
                  <span className="font-mono">{formatRawAmount(remainingNum)}</span>
                </DetailRow>
              </div>

              <div>
                <p className="text-xs font-body font-semibold text-text-muted uppercase tracking-wider mb-3">Schedule</p>
                <DetailRow label="Start Date">{formatDate(stream.startTime)}</DetailRow>
                <DetailRow label="End Date">{formatDate(stream.endTime)}</DetailRow>
                {stream.cliffTime && (
                  <DetailRow label="Cliff Date">{formatDate(stream.cliffTime)}</DetailRow>
                )}
                <DetailRow label="Duration">
                  {formatDuration(stream.startTime, stream.endTime)}
                </DetailRow>
              </div>
            </div>
          </div>

          {/* Visual panel */}
          <div className="rounded-2xl p-px" style={{ background: 'linear-gradient(135deg, rgba(153,69,255,0.2), rgba(20,241,149,0.1))' }}>
            <div className="rounded-[calc(1rem-1px)] bg-bg-surface p-6 space-y-6">
              <div>
                <p className="text-xs font-body font-semibold text-text-muted uppercase tracking-wider mb-4">Vesting Progress</p>
                <VestingProgress
                  totalAmount={stream.amount}
                  vestedAmount={stream.vestedAmount}
                  claimedAmount={stream.claimedAmount}
                />
              </div>

              {/* Timeline */}
              <div className="space-y-2">
                <p className="text-xs font-body font-semibold text-text-muted uppercase tracking-wider">Timeline</p>
                <div className="relative">
                  <div className="absolute left-3 top-0 bottom-0 w-px bg-bg-border" />
                  {[
                    { label: 'Stream starts', date: stream.startTime, color: 'bg-sol-purple' },
                    ...(stream.cliffTime ? [{ label: 'Cliff date', date: stream.cliffTime, color: 'bg-sol-blue' }] : []),
                    { label: 'Today', date: new Date(), color: 'bg-sol-green' },
                    { label: 'Stream ends', date: stream.endTime, color: 'bg-text-muted' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 mb-4 relative pl-8">
                      <div className={`absolute left-0 w-6 h-6 rounded-full ${item.color} flex items-center justify-center`}>
                        <div className="w-2 h-2 rounded-full bg-bg-void" />
                      </div>
                      <div>
                        <p className="text-xs font-body font-semibold text-text-secondary">{item.label}</p>
                        <p className="text-xs font-mono text-text-muted">{formatDate(item.date)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-bg-border">
                {isRecipient && <WithdrawButton stream={stream} />}
                {isCreator && (
                  <div className="space-y-2">
                    <p className="text-xs text-text-muted">
                      Cancelling will stop all future vesting. The recipient keeps all tokens
                      vested up to this moment.
                    </p>
                    <CancelButton stream={stream} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

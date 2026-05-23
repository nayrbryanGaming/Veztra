'use client'

import Link from 'next/link'
import { ParsedStream } from '@/types/stream'
import { Card } from '@/components/ui/Card'
import { StreamStatusBadge, VestingTypeBadge } from './StreamStatusBadge'
import { VestingProgress } from './VestingProgress'
import { WithdrawButton } from './WithdrawButton'
import { CancelButton } from './CancelButton'
import { UnlockMilestoneButton } from './UnlockMilestoneButton'
import { AddressDisplay } from '@/components/ui/AddressDisplay'
import { formatDate, formatTimeRemaining, formatRawAmount } from '@/lib/format'
import { useWallet } from '@solana/wallet-adapter-react'
import { ExternalLink } from 'lucide-react'

interface StreamCardProps {
  stream: ParsedStream
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-text-muted uppercase tracking-wider mb-1">{label}</p>
      <p className="text-sm font-mono text-text-primary font-semibold">{value}</p>
    </div>
  )
}

export function StreamCard({ stream }: StreamCardProps) {
  const { publicKey } = useWallet()
  const isRecipient = publicKey?.toBase58() === stream.recipient
  const isCreator = publicKey?.toBase58() === stream.creator

  const amountNum = stream.amount / 1e6
  const vestedNum = stream.vestedAmount / 1e6
  const claimedNum = stream.claimedAmount / 1e6

  return (
    <Card>
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <StreamStatusBadge status={stream.status} />
            <VestingTypeBadge type={stream.vestingType} />
          </div>
        </div>

        <div>
          <p className="text-xs text-text-muted mb-1">
            {isRecipient ? 'From' : 'To'}
          </p>
          <AddressDisplay address={isRecipient ? stream.creator : stream.recipient} showCopy />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <StatBlock label="Total" value={`${formatRawAmount(amountNum)}`} />
          <StatBlock label="Vested" value={`${formatRawAmount(vestedNum)}`} />
          <StatBlock label="Claimed" value={`${formatRawAmount(claimedNum)}`} />
        </div>

        <VestingProgress
          totalAmount={stream.amount}
          vestedAmount={stream.vestedAmount}
          claimedAmount={stream.claimedAmount}
        />

        <div className="text-xs text-text-muted space-y-1">
          <div className="flex justify-between">
            <span>Start: {formatDate(stream.startTime)}</span>
            <span>End: {formatDate(stream.endTime)}</span>
          </div>
          {stream.cliffTime && (
            <p>Cliff: {formatDate(stream.cliffTime)}</p>
          )}
          {stream.status === 'active' && (
            <p className="text-text-secondary">{stream.timeRemaining}</p>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-3 flex-wrap">
            {isRecipient && <WithdrawButton stream={stream} />}
            {isCreator && stream.vestingType === 'milestone' && <UnlockMilestoneButton stream={stream} />}
            {isCreator && <CancelButton stream={stream} />}
          </div>
          <Link
            href={`/stream/${stream.publicKey.toBase58()}`}
            className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors"
          >
            View Details <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </Card>
  )
}

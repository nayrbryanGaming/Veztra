'use client'

import { Button } from '@/components/ui/Button'
import { useWithdraw } from '@/hooks/useWithdraw'
import { ParsedStream } from '@/types/stream'
import { formatRawAmount } from '@/lib/format'

interface WithdrawButtonProps {
  stream: ParsedStream
}

export function WithdrawButton({ stream }: WithdrawButtonProps) {
  const withdraw = useWithdraw()

  if (stream.claimableAmount <= 0 || stream.status !== 'active') return null

  return (
    <Button
      variant="primary"
      size="sm"
      loading={withdraw.isPending}
      onClick={() => withdraw.mutate(stream)}
    >
      {withdraw.isPending ? 'Claiming...' : `Withdraw ${formatRawAmount(stream.claimableAmount / 1e6)}`}
    </Button>
  )
}

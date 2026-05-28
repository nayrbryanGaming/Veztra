import { Badge } from '@/components/ui/Badge'
import { StreamStatus, VestingType } from '@/types/stream'

export function StreamStatusBadge({ status }: { status: StreamStatus }) {
  return (
    <Badge variant={status}>
      {status.toUpperCase()}
    </Badge>
  )
}

export function VestingTypeBadge({ type }: { type: VestingType }) {
  return (
    <Badge variant={type}>
      {type.toUpperCase()}
    </Badge>
  )
}

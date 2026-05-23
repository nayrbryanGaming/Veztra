import { formatDistanceToNow, format, differenceInDays, differenceInMonths } from 'date-fns'

export function truncateAddress(address: string, chars = 4): string {
  if (!address) return ''
  return `${address.slice(0, chars)}...${address.slice(-chars)}`
}

export function formatAmount(amount: number, decimals = 6): string {
  const val = amount / Math.pow(10, decimals)
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(2)}M`
  if (val >= 1_000) return `${(val / 1_000).toFixed(2)}K`
  return val.toLocaleString('en-US', { maximumFractionDigits: 2 })
}

export function formatRawAmount(amount: number): string {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(2)}M`
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(2)}K`
  return amount.toLocaleString('en-US', { maximumFractionDigits: 2 })
}

export function formatDate(date: Date): string {
  return format(date, 'MMM d, yyyy')
}

export function formatDateShort(date: Date): string {
  return format(date, 'MMM d')
}

export function formatTimeRemaining(endDate: Date): string {
  const now = new Date()
  if (endDate <= now) return 'Completed'
  const months = differenceInMonths(endDate, now)
  const days = differenceInDays(endDate, now) % 30
  if (months > 0) return `${months}mo ${days}d remaining`
  return `${differenceInDays(endDate, now)}d remaining`
}

export function formatDuration(startDate: Date, endDate: Date): string {
  const months = differenceInMonths(endDate, startDate)
  const days = differenceInDays(endDate, startDate) % 30
  if (months > 0 && days > 0) return `${months} months ${days} days`
  if (months > 0) return `${months} months`
  return `${differenceInDays(endDate, startDate)} days`
}

export function formatPercent(value: number, total: number): string {
  if (total === 0) return '0%'
  return `${((value / total) * 100).toFixed(1)}%`
}

export function calcVestedAmount(
  totalAmount: number,
  startTime: number,
  endTime: number,
  cliffTime: number | null,
  vestingType: 'linear' | 'cliff' | 'milestone',
  now = Date.now() / 1000,
  milestoneUnlocked = false,
): number {
  if (now >= endTime) return totalAmount
  if (now < startTime) return 0

  // Milestone: all-or-nothing based on creator unlock
  if (vestingType === 'milestone') {
    return milestoneUnlocked ? totalAmount : 0
  }

  // Cliff: all tokens unlock at cliff_time
  if (vestingType === 'cliff') {
    const cliff = cliffTime ?? endTime
    return now >= cliff ? totalAmount : 0
  }

  // Linear: gradual release, optionally gated by cliff
  const cliff = cliffTime
  if (cliff && now < cliff) return 0

  const linearStart = startTime
  const elapsed = now - linearStart
  const duration = endTime - linearStart
  if (duration <= 0) return totalAmount

  return Math.floor((totalAmount * elapsed) / duration)
}

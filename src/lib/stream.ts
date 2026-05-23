import { StreamAccount, ParsedStream, VestingType, StreamStatus } from '@/types/stream'
import { calcVestedAmount, formatTimeRemaining } from './format'

export function parseStreamAccount(raw: StreamAccount): ParsedStream {
  const { publicKey, account } = raw

  const amount = account.amount.toNumber()
  const claimedAmount = account.claimedAmount.toNumber()
  const startTime = account.startTime.toNumber()
  const endTime = account.endTime.toNumber()
  const cliffTime = account.cliffTime ? account.cliffTime.toNumber() : null
  const milestoneUnlocked = account.milestoneUnlocked ?? false

  const vt = account.vestingType as any
  let vestingType: VestingType
  if ('cliff' in vt) vestingType = 'cliff'
  else if ('milestone' in vt) vestingType = 'milestone'
  else vestingType = 'linear'

  let status: StreamStatus = 'active'
  const rawStatus = account.status as any
  if ('cancelled' in rawStatus) status = 'cancelled'
  else if ('completed' in rawStatus) status = 'completed'

  const now = Date.now() / 1000
  const vestedAmount = status === 'cancelled'
    ? calcVestedAmount(amount, startTime, endTime, cliffTime, vestingType, Math.min(now, endTime), milestoneUnlocked)
    : calcVestedAmount(amount, startTime, endTime, cliffTime, vestingType, undefined, milestoneUnlocked)

  const claimableAmount = Math.max(0, vestedAmount - claimedAmount)
  const progressPercent = amount > 0 ? (vestedAmount / amount) * 100 : 0

  const endDate = new Date(endTime * 1000)

  return {
    publicKey,
    creator: account.creator.toBase58(),
    recipient: account.recipient.toBase58(),
    mint: account.mint.toBase58(),
    vault: account.vault.toBase58(),
    amount,
    claimedAmount,
    vestedAmount,
    claimableAmount,
    startTime: new Date(startTime * 1000),
    endTime: endDate,
    cliffTime: cliffTime ? new Date(cliffTime * 1000) : null,
    vestingType,
    status,
    progressPercent: Math.min(100, progressPercent),
    timeRemaining: status === 'active' ? formatTimeRemaining(endDate) : '',
    milestoneUnlocked,
  }
}

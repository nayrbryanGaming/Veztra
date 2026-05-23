const ANCHOR_ERRORS: Record<number, string> = {
  6000: 'Amount must be greater than zero',
  6001: 'End time must be after start time',
  6002: 'Cliff time must be between start and end times',
  6003: 'Unauthorized — only the stream creator can do that',
  6004: 'Stream has already been cancelled',
  6005: 'Stream is fully vested — nothing to cancel or withdraw',
  6006: 'Nothing to withdraw right now — tokens are still vesting',
  6007: 'Cliff period not reached yet — check back later',
  6008: 'Stream has expired beyond the grace period',
  6009: 'This stream is not a milestone-type stream',
  6010: 'Milestone has already been unlocked',
  6011: 'Milestone not yet unlocked — creator must trigger the milestone first',
}

export function parseAnchorError(error: any): string {
  // Check direct error code
  const code = error?.error?.errorCode?.number
  if (code !== undefined && ANCHOR_ERRORS[code]) return ANCHOR_ERRORS[code]

  // Check in transaction logs
  const logs = error?.logs as string[] | undefined
  if (logs) {
    for (const log of logs) {
      const match = log.match(/Error Code: (\w+)\. Error Number: (\d+)/)
      if (match) {
        const num = parseInt(match[2])
        if (ANCHOR_ERRORS[num]) return ANCHOR_ERRORS[num]
      }
    }
  }

  // Common system-level errors
  if (error?.message?.includes('User rejected') || error?.message?.includes('rejected'))
    return 'Transaction cancelled by user.'
  if (error?.message?.includes('insufficient lamports') || error?.message?.includes('not enough SOL'))
    return 'Insufficient SOL for transaction fees. Add devnet SOL to your wallet.'
  if (error?.message?.includes('blockhash') || error?.message?.includes('expired'))
    return 'Network timeout. Please try again.'
  if (error?.message?.includes('0x1'))
    return 'Insufficient token balance in your wallet.'
  if (error?.message?.includes('already in use'))
    return 'A stream already exists for this recipient and token combination.'

  return error?.message || 'Transaction failed. Please try again.'
}

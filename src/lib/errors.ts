const ANCHOR_ERRORS: Record<number, string> = {
  6000: 'Stream already exists for this recipient',
  6001: 'Nothing to claim yet — tokens are still vesting',
  6002: 'Only the stream recipient can withdraw',
  6003: 'Only the stream creator can cancel',
  6004: 'This stream has already been cancelled',
  6005: 'This stream has already completed',
  6006: 'Invalid vesting schedule — end date before start date',
  6007: 'Cliff date must be between start and end dates',
  6008: 'Amount must be greater than zero',
  6009: 'Insufficient token balance',
}

export function parseAnchorError(error: any): string {
  const code = error?.error?.errorCode?.number
  if (code !== undefined && ANCHOR_ERRORS[code]) return ANCHOR_ERRORS[code]

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

  if (error?.message?.includes('User rejected')) return 'Transaction cancelled.'
  if (error?.message?.includes('insufficient lamports'))
    return 'Insufficient SOL for transaction fees. Add SOL to your wallet.'
  if (error?.message?.includes('blockhash'))
    return 'Network timeout. Please try again.'
  if (error?.message?.includes('0x1')) return 'Insufficient token balance.'

  return error?.message || 'Transaction failed. Please try again.'
}

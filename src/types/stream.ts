import { PublicKey } from '@solana/web3.js'
import { BN } from '@coral-xyz/anchor'

export type VestingType = 'linear' | 'cliff' | 'milestone'

export type StreamStatus = 'active' | 'completed' | 'cancelled'

export interface StreamAccount {
  publicKey: PublicKey
  account: {
    creator: PublicKey
    recipient: PublicKey
    mint: PublicKey
    vault: PublicKey
    amount: BN
    claimedAmount: BN
    startTime: BN
    endTime: BN
    cliffTime: BN | null
    vestingType: { linear?: {} } | { cliff?: {} } | { milestone?: {} }
    status: { active?: {} } | { completed?: {} } | { cancelled?: {} }
    bump: number
    milestoneUnlocked: boolean
  }
}

export interface ParsedStream {
  publicKey: PublicKey
  creator: string
  recipient: string
  mint: string
  vault: string
  amount: number
  claimedAmount: number
  vestedAmount: number
  claimableAmount: number
  startTime: Date
  endTime: Date
  cliffTime: Date | null
  vestingType: VestingType
  status: StreamStatus
  progressPercent: number
  timeRemaining: string
  milestoneUnlocked: boolean
}

export interface CreateStreamFormData {
  vestingType: VestingType
  tokenMint: string
  recipient: string
  amount: number
  startDate: string
  endDate: string
  cliffDate?: string
  hasCliff: boolean
}

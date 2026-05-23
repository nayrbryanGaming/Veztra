import { clusterApiUrl } from '@solana/web3.js'

export const NETWORK = (process.env.NEXT_PUBLIC_NETWORK as 'devnet' | 'mainnet-beta') || 'devnet'
export const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || clusterApiUrl('devnet')
export const PROGRAM_ID = process.env.NEXT_PUBLIC_PROGRAM_ID || '25VqBegEhXzpf7pXHpBYxHaRx1fMwM2fwvH446RaBkK2'

export const DEVNET_TEST_TOKEN = 'So11111111111111111111111111111111111111112'

export const EXPLORER_BASE = NETWORK === 'devnet'
  ? 'https://explorer.solana.com'
  : 'https://explorer.solana.com'

export const CLUSTER_PARAM = NETWORK === 'devnet' ? '?cluster=devnet' : ''

export function explorerUrl(type: 'tx' | 'address', value: string) {
  return `${EXPLORER_BASE}/${type}/${value}${CLUSTER_PARAM}`
}

'use client'

import { useMemo } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { AnchorProvider } from '@coral-xyz/anchor'
import { getProgram, getProvider } from '@/lib/anchor'

export function useProgram() {
  const { connection } = useConnection()
  const wallet = useWallet()

  return useMemo(() => {
    if (!wallet.publicKey || !wallet.signTransaction) return null
    const provider = getProvider(wallet as any, connection)
    return getProgram(provider)
  }, [connection, wallet.publicKey, wallet.signTransaction])
}

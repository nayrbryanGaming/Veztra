'use client'

import { PublicKey } from '@solana/web3.js'
import { useQuery } from '@tanstack/react-query'
import { useProgram } from './useProgram'
import { parseStreamAccount } from '@/lib/stream'

export function useStream(streamPDA: string | undefined) {
  const program = useProgram()

  return useQuery({
    queryKey: ['stream', streamPDA],
    queryFn: async () => {
      if (!program || !streamPDA) return null
      const pk = new PublicKey(streamPDA)
      const raw = await (program.account as any).stream.fetch(pk)
      return parseStreamAccount({ publicKey: pk, account: raw } as any)
    },
    enabled: !!program && !!streamPDA,
    refetchInterval: 10_000,
  })
}

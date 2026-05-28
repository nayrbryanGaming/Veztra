'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { useQuery } from '@tanstack/react-query'
import { useProgram } from './useProgram'
import { parseStreamAccount } from '@/lib/stream'
import { ParsedStream } from '@/types/stream'

export function useStreams() {
  const program = useProgram()
  const { publicKey } = useWallet()

  return useQuery({
    queryKey: ['streams', publicKey?.toBase58()],
    queryFn: async (): Promise<{ creatorStreams: ParsedStream[]; recipientStreams: ParsedStream[] }> => {
      if (!program || !publicKey) return { creatorStreams: [], recipientStreams: [] }

      const [creatorRaw, recipientRaw] = await Promise.all([
        (program.account as any).stream.all([
          {
            memcmp: {
              offset: 8,
              bytes: publicKey.toBase58(),
            },
          },
        ]),
        (program.account as any).stream.all([
          {
            memcmp: {
              offset: 8 + 32,
              bytes: publicKey.toBase58(),
            },
          },
        ]),
      ])

      const creatorStreams = (creatorRaw as any[]).map((s: any) => parseStreamAccount(s as any))
      const recipientStreams = (recipientRaw as any[])
        .filter((s: any) => s.account.creator.toBase58() !== publicKey.toBase58())
        .map((s: any) => parseStreamAccount(s as any))

      return { creatorStreams, recipientStreams }
    },
    enabled: !!program && !!publicKey,
    refetchInterval: 10_000,
  })
}

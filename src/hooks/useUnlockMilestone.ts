'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { useProgram } from './useProgram'
import { parseAnchorError } from '@/lib/errors'
import { ParsedStream } from '@/types/stream'

export function useUnlockMilestone() {
  const program = useProgram()
  const { publicKey } = useWallet()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (stream: ParsedStream) => {
      if (!program || !publicKey) throw new Error('Wallet not connected')

      const streamPDA = stream.publicKey
      const mint = new PublicKey(stream.mint)
      const recipient = new PublicKey(stream.recipient)

      const toastId = toast.loading('Unlocking milestone...')

      try {
        const tx = await program.methods
          .unlockMilestone()
          .accounts({
            creator: publicKey,
            recipient,
            mint,
            stream: streamPDA,
          })
          .rpc()

        toast.success('Milestone unlocked! Recipient can now withdraw.', { id: toastId })
        queryClient.invalidateQueries({ queryKey: ['streams'] })
        queryClient.invalidateQueries({ queryKey: ['stream', streamPDA.toBase58()] })
        return tx
      } catch (err) {
        toast.error(parseAnchorError(err), { id: toastId })
        throw err
      }
    },
  })
}

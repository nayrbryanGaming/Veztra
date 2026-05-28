'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey, SystemProgram } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { useProgram } from './useProgram'
import { getVaultPDA } from '@/lib/pda'
import { parseAnchorError } from '@/lib/errors'
import { ParsedStream } from '@/types/stream'

export function useCancel() {
  const program = useProgram()
  const { publicKey } = useWallet()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (stream: ParsedStream) => {
      if (!program || !publicKey) throw new Error('Wallet not connected')

      const streamPDA = stream.publicKey
      const [vaultPDA] = getVaultPDA(streamPDA)
      const mint = new PublicKey(stream.mint)
      const recipient = new PublicKey(stream.recipient)

      const creatorTokenAccount = await getAssociatedTokenAddress(mint, publicKey)
      const recipientTokenAccount = await getAssociatedTokenAddress(mint, recipient)

      const toastId = toast.loading('Awaiting wallet approval...')

      try {
        const tx = await program.methods
          .cancelStream()
          .accounts({
            creator: publicKey,
            recipient,
            mint,
            stream: streamPDA,
            vault: vaultPDA,
            creatorTokenAccount,
            recipientTokenAccount,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
          })
          .rpc()

        toast.success('Stream cancelled. Unvested tokens returned.', { id: toastId })
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

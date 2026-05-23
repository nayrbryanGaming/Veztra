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

export function useWithdraw() {
  const program = useProgram()
  const { publicKey } = useWallet()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (stream: ParsedStream) => {
      if (!program || !publicKey) throw new Error('Wallet not connected')

      const streamPDA = stream.publicKey
      const [vaultPDA] = getVaultPDA(streamPDA)
      const mint = new PublicKey(stream.mint)
      const creator = new PublicKey(stream.creator)

      const recipientTokenAccount = await getAssociatedTokenAddress(mint, publicKey)

      const toastId = toast.loading('Awaiting wallet approval...')

      try {
        const tx = await program.methods
          .withdraw()
          .accounts({
            creator,
            recipient: publicKey,
            mint,
            stream: streamPDA,
            vault: vaultPDA,
            recipientTokenAccount,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
          })
          .rpc()

        toast.success('Tokens claimed successfully!', { id: toastId })
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

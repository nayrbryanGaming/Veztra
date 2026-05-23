'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { useConnection } from '@solana/wallet-adapter-react'
import { PublicKey, SystemProgram } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token'
import { BN } from '@coral-xyz/anchor'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { useProgram } from './useProgram'
import { getStreamPDA, getVaultPDA } from '@/lib/pda'
import { parseAnchorError } from '@/lib/errors'

interface CreateStreamParams {
  recipient: string
  tokenMint: string
  amount: number
  startTimestamp: number
  endTimestamp: number
  cliffTimestamp?: number
  vestingType: 'linear' | 'cliff'
}

export function useCreateStream() {
  const program = useProgram()
  const { publicKey } = useWallet()
  const { connection } = useConnection()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: CreateStreamParams) => {
      if (!program || !publicKey) throw new Error('Wallet not connected')

      const mint = new PublicKey(params.tokenMint)
      const recipient = new PublicKey(params.recipient)

      const [streamPDA] = getStreamPDA(publicKey, recipient, mint)
      const [vaultPDA] = getVaultPDA(streamPDA)

      const creatorTokenAccount = await getAssociatedTokenAddress(mint, publicKey)
      const vaultTokenAccount = await getAssociatedTokenAddress(mint, vaultPDA, true)

      const amountBN = new BN(Math.floor(params.amount * 1_000_000))
      const vestingTypeArg = params.vestingType === 'cliff'
        ? { cliff: {} }
        : { linear: {} }

      const toastId = toast.loading('Awaiting wallet approval...')

      try {
        const tx = await program.methods
          .createStream(
            amountBN,
            new BN(params.startTimestamp),
            new BN(params.endTimestamp),
            params.cliffTimestamp ? new BN(params.cliffTimestamp) : null,
            vestingTypeArg
          )
          .accounts({
            creator: publicKey,
            recipient,
            stream: streamPDA,
            vault: vaultPDA,
            mint,
            creatorTokenAccount,
            vaultTokenAccount,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
          })
          .rpc()

        toast.success(`Stream created! TX: ${tx.slice(0, 8)}...`, { id: toastId })
        queryClient.invalidateQueries({ queryKey: ['streams'] })
        return tx
      } catch (err) {
        toast.error(parseAnchorError(err), { id: toastId })
        throw err
      }
    },
  })
}

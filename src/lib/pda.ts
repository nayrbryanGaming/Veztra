import { PublicKey } from '@solana/web3.js'
import { PROGRAM_PUBLIC_KEY } from './anchor'

export function getStreamPDA(
  creator: PublicKey,
  recipient: PublicKey,
  mint: PublicKey
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('stream'),
      creator.toBuffer(),
      recipient.toBuffer(),
      mint.toBuffer(),
    ],
    PROGRAM_PUBLIC_KEY
  )
}

export function getVaultPDA(streamPDA: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('vault'), streamPDA.toBuffer()],
    PROGRAM_PUBLIC_KEY
  )
}

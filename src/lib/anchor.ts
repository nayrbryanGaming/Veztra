import { Connection, PublicKey } from '@solana/web3.js'
import { AnchorProvider, Program, Idl } from '@coral-xyz/anchor'
import { RPC_URL, PROGRAM_ID } from './constants'
import IDL from '@/idl/token_distribution.json'

export const CONNECTION = new Connection(RPC_URL, { commitment: 'confirmed' })

export const PROGRAM_PUBLIC_KEY = new PublicKey(PROGRAM_ID)

export function getProgram(provider: AnchorProvider) {
  return new Program(IDL as unknown as Idl, provider)
}

export function getProvider(wallet: any, connection: Connection) {
  return new AnchorProvider(connection, wallet, {
    commitment: 'confirmed',
    preflightCommitment: 'confirmed',
  })
}

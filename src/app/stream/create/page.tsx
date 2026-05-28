'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { CreateStreamForm } from '@/components/stream/CreateStreamForm'
import { Button } from '@/components/ui/Button'

export default function CreateStreamPage() {
  const { connected } = useWallet()
  const { setVisible } = useWalletModal()

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <h1 className="font-display font-bold text-3xl text-text-primary">Create Vesting Stream</h1>
          <p className="text-text-secondary mt-2">
            Set up a new token distribution schedule. Tokens are locked on-chain and released
            according to your chosen schedule.
          </p>
        </div>

        {!connected ? (
          <div className="text-center py-20 space-y-4">
            <p className="text-text-secondary">Connect your wallet to create a stream.</p>
            <Button variant="primary" onClick={() => setVisible(true)}>Connect Wallet</Button>
          </div>
        ) : (
          <CreateStreamForm />
        )}
      </div>
    </div>
  )
}

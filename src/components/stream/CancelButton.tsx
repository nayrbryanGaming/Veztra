'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useCancel } from '@/hooks/useCancel'
import { ParsedStream } from '@/types/stream'
import { AlertTriangle } from 'lucide-react'

interface CancelButtonProps {
  stream: ParsedStream
  onCancel?: () => void
}

export function CancelButton({ stream, onCancel }: CancelButtonProps) {
  const [open, setOpen] = useState(false)
  const cancel = useCancel()

  if (stream.status !== 'active') return null

  const handleConfirm = async () => {
    try {
      await cancel.mutateAsync(stream)
      setOpen(false)
      onCancel?.()
    } catch {}
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-text-danger hover:text-text-danger/80 transition-colors underline underline-offset-2"
      >
        Cancel stream
      </button>

      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Cancel Stream"
        description="This action cannot be undone."
      >
        <div className="space-y-4">
          <div className="flex gap-3 p-4 rounded-xl bg-text-danger/10 border border-text-danger/20">
            <AlertTriangle className="w-5 h-5 text-text-danger shrink-0 mt-0.5" />
            <p className="text-sm text-text-secondary">
              Cancelling will stop all future vesting immediately. The recipient keeps all tokens
              vested up to this moment and can still claim them. Unvested tokens will be returned
              to your wallet.
            </p>
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
              Keep Stream
            </Button>
            <Button
              variant="danger"
              size="sm"
              loading={cancel.isPending}
              onClick={handleConfirm}
            >
              {cancel.isPending ? 'Cancelling...' : 'Cancel Stream'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useUnlockMilestone } from '@/hooks/useUnlockMilestone'
import { ParsedStream } from '@/types/stream'
import { Unlock, CheckCircle2 } from 'lucide-react'

interface UnlockMilestoneButtonProps {
  stream: ParsedStream
}

export function UnlockMilestoneButton({ stream }: UnlockMilestoneButtonProps) {
  const [open, setOpen] = useState(false)
  const unlock = useUnlockMilestone()

  // Only show for milestone streams that are active and not yet unlocked
  if (stream.vestingType !== 'milestone' || stream.status !== 'active') return null
  if (stream.milestoneUnlocked) {
    return (
      <div className="flex items-center gap-1.5 text-xs font-body" style={{ color: '#14F195' }}>
        <CheckCircle2 className="w-3.5 h-3.5" />
        Milestone unlocked
      </div>
    )
  }

  const handleConfirm = async () => {
    try {
      await unlock.mutateAsync(stream)
      setOpen(false)
    } catch {}
  }

  return (
    <>
      <Button
        variant="primary"
        size="sm"
        onClick={() => setOpen(true)}
      >
        <Unlock className="w-3.5 h-3.5" />
        Unlock Milestone
      </Button>

      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Unlock Milestone"
        description="Release tokens to the recipient."
      >
        <div className="space-y-4">
          <div
            className="p-4 rounded-xl text-sm text-text-secondary"
            style={{ background: 'rgba(153,69,255,0.08)', border: '1px solid rgba(153,69,255,0.2)' }}
          >
            <p>
              Unlocking this milestone will allow the recipient to withdraw the full token
              amount immediately. <strong className="text-text-primary">This action cannot be undone.</strong>
            </p>
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              loading={unlock.isPending}
              onClick={handleConfirm}
            >
              {unlock.isPending ? 'Unlocking...' : 'Confirm Unlock'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

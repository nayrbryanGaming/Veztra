'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { clsx } from 'clsx'

interface ModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: React.ReactNode
}

export function Modal({ open, onOpenChange, title, description, children }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 animate-fade-in" />
        <Dialog.Content className={clsx(
          'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50',
          'w-full max-w-md rounded-2xl p-px',
          'before:absolute before:inset-0 before:rounded-[inherit] before:bg-gradient-to-br before:from-sol-purple/30 before:to-sol-green/20 before:-z-10',
          'animate-slide-up'
        )}>
          <div className="bg-bg-surface rounded-[calc(1rem-1px)] p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <Dialog.Title className="font-display font-bold text-lg text-text-primary">
                  {title}
                </Dialog.Title>
                {description && (
                  <Dialog.Description className="text-sm text-text-secondary mt-1">
                    {description}
                  </Dialog.Description>
                )}
              </div>
              <Dialog.Close className="text-text-muted hover:text-text-primary transition-colors ml-4">
                <X className="w-5 h-5" />
              </Dialog.Close>
            </div>
            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

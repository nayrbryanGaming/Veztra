'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { TrendingUp, Layers, Flag, ArrowRight } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useCreateStream } from '@/hooks/useCreateStream'
import { useWallet } from '@solana/wallet-adapter-react'
import { formatDuration } from '@/lib/format'
import { clsx } from 'clsx'

const schema = z.object({
  vestingType: z.enum(['linear', 'cliff', 'milestone']),
  tokenMint: z.string().min(32, 'Invalid mint address').max(44, 'Invalid mint address'),
  recipient: z.string().min(32, 'Invalid wallet address').max(44, 'Invalid wallet address'),
  amount: z.coerce.number().positive('Amount must be positive').max(1_000_000_000, 'Amount too large'),
  startDate: z.string().min(1, 'Required'),
  endDate: z.string().min(1, 'Required'),
  hasCliff: z.boolean(),
  cliffDate: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.startDate && data.endDate) {
    if (new Date(data.endDate) <= new Date(data.startDate)) {
      ctx.addIssue({ code: 'custom', message: 'End date must be after start date', path: ['endDate'] })
    }
  }
  if (data.hasCliff && data.cliffDate && data.startDate && data.endDate) {
    const cliff = new Date(data.cliffDate)
    if (cliff <= new Date(data.startDate) || cliff >= new Date(data.endDate)) {
      ctx.addIssue({ code: 'custom', message: 'Cliff must be between start and end dates', path: ['cliffDate'] })
    }
  }
})

type FormData = z.infer<typeof schema>

const VESTING_TYPES = [
  {
    id: 'linear' as const,
    icon: TrendingUp,
    label: 'Linear',
    description: 'Gradual release over time',
  },
  {
    id: 'cliff' as const,
    icon: Layers,
    label: 'Cliff',
    description: 'All tokens unlock at cliff date',
  },
  {
    id: 'milestone' as const,
    icon: Flag,
    label: 'Milestone',
    description: 'Unlock triggered by creator',
  },
]

function StreamPreview({ watch }: { watch: FormData }) {
  const startDate = watch.startDate ? new Date(watch.startDate) : null
  const endDate = watch.endDate ? new Date(watch.endDate) : null
  const cliffDate = watch.hasCliff && watch.cliffDate ? new Date(watch.cliffDate) : null

  const duration = startDate && endDate ? formatDuration(startDate, endDate) : '—'
  const monthlyRate = startDate && endDate && watch.amount && watch.vestingType === 'linear'
    ? (watch.amount / Math.max(1, (endDate.getTime() - startDate.getTime()) / (30 * 24 * 3600 * 1000))).toFixed(0)
    : '0'

  return (
    <div className="rounded-2xl p-px h-fit sticky top-24" style={{ background: 'linear-gradient(135deg, rgba(153,69,255,0.3), rgba(20,241,149,0.2))' }}>
      <div className="rounded-[calc(1rem-1px)] bg-bg-surface p-6 space-y-4">
        <p className="text-xs font-body font-semibold text-text-muted uppercase tracking-wider">Stream Preview</p>
        <div className="space-y-3 text-sm">
          {[
            { label: 'Type', value: watch.vestingType ? watch.vestingType.charAt(0).toUpperCase() + watch.vestingType.slice(1) + ' Vesting' : '—' },
            { label: 'Recipient', value: watch.recipient ? `${watch.recipient.slice(0, 6)}...${watch.recipient.slice(-4)}` : '—', mono: true },
            { label: 'Amount', value: watch.amount ? `${Number(watch.amount).toLocaleString()} tokens` : '—' },
            { label: 'Duration', value: duration },
            ...(watch.vestingType !== 'milestone' ? [{ label: 'Cliff', value: cliffDate ? cliffDate.toLocaleDateString() : 'None' }] : []),
          ].map((item) => (
            <div key={item.label} className="flex justify-between">
              <span className="text-text-muted">{item.label}</span>
              <span className={clsx('text-text-primary', item.mono && 'font-mono text-xs')}>{item.value}</span>
            </div>
          ))}
        </div>

        {watch.vestingType === 'milestone' && watch.amount && (
          <div className="pt-3 border-t border-bg-border space-y-2">
            <p className="text-xs text-text-muted uppercase tracking-wider">Unlock Pattern</p>
            <p className="text-xs text-text-secondary">
              <span className="font-semibold text-text-primary">{Number(watch.amount).toLocaleString()} tokens</span>{' '}
              unlock instantly when you confirm the milestone is met. No time-based vesting.
            </p>
          </div>
        )}

        {watch.vestingType === 'linear' && watch.hasCliff && cliffDate && startDate && endDate && watch.amount && (
          <div className="pt-3 border-t border-bg-border space-y-2">
            <p className="text-xs text-text-muted uppercase tracking-wider">Unlock Schedule</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-1.5 rounded bg-bg-border flex-1" />
                <span className="text-xs text-text-muted w-20">Cliff period</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 rounded bg-gradient-to-r from-sol-purple to-sol-green flex-1" />
                <span className="text-xs text-text-muted w-20">Linear release</span>
              </div>
            </div>
            <p className="text-xs text-text-secondary">~{Number(monthlyRate).toLocaleString()} tokens/month after cliff</p>
          </div>
        )}
      </div>
    </div>
  )
}

export function CreateStreamForm() {
  const router = useRouter()
  const { publicKey } = useWallet()
  const createStream = useCreateStream()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      vestingType: 'linear',
      hasCliff: false,
    },
  })

  const watchAll = watch()
  const hasCliff = watch('hasCliff')
  const vestingType = watch('vestingType')

  const onSubmit = async (data: FormData) => {
    if (!publicKey) return
    if (data.recipient === publicKey.toBase58()) return

    const startTs = Math.floor(new Date(data.startDate).getTime() / 1000)
    const endTs = Math.floor(new Date(data.endDate).getTime() / 1000)
    const cliffTs = data.hasCliff && data.cliffDate && data.vestingType !== 'milestone'
      ? Math.floor(new Date(data.cliffDate).getTime() / 1000)
      : undefined

    try {
      await createStream.mutateAsync({
        recipient: data.recipient,
        tokenMint: data.tokenMint,
        amount: data.amount,
        startTimestamp: startTs,
        endTimestamp: endTs,
        cliffTimestamp: cliffTs,
        vestingType: data.vestingType,
      })
      router.push('/dashboard')
    } catch {}
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-3 space-y-8">

        {/* Vesting Type */}
        <div className="space-y-3">
          <p className="text-xs font-body font-semibold text-text-muted uppercase tracking-widest">Vesting Type</p>
          <div className="grid grid-cols-3 gap-3">
            {VESTING_TYPES.map(({ id, icon: Icon, label, description }) => (
              <button
                key={id}
                type="button"
                onClick={() => setValue('vestingType', id)}
                className={clsx(
                  'relative rounded-xl p-4 text-left transition-all duration-200 border',
                  vestingType === id
                    ? 'border-sol-purple bg-sol-purple/10'
                    : 'border-bg-border bg-bg-elevated hover:border-bg-border/60'
                )}
              >
                <Icon className={clsx('w-5 h-5 mb-2', vestingType === id ? 'text-sol-purple' : 'text-text-muted')} />
                <p className="font-body font-semibold text-sm text-text-primary">{label}</p>
                <p className="text-xs text-text-muted mt-0.5">{description}</p>
              </button>
            ))}
          </div>

          {vestingType === 'milestone' && (
            <div className="p-3 rounded-xl text-xs text-text-secondary" style={{ background: 'rgba(153,69,255,0.08)', border: '1px solid rgba(153,69,255,0.2)' }}>
              💡 <strong className="text-text-primary">Milestone streams:</strong> Tokens are locked until you manually confirm the milestone is complete. Useful for deliverable-based payments or conditional grants.
            </div>
          )}
        </div>

        {/* Token */}
        <Input
          label="Token Mint Address"
          placeholder="Token mint address (e.g. So11111...)"
          mono
          error={errors.tokenMint?.message}
          helper="The SPL token you want to distribute. For devnet testing, use any SPL token mint on devnet."
          {...register('tokenMint')}
        />

        {/* Recipient */}
        <Input
          label="Recipient Wallet Address"
          placeholder="Recipient's Solana wallet address"
          mono
          error={errors.recipient?.message}
          {...register('recipient')}
        />

        {/* Amount */}
        <Input
          label="Total Token Amount"
          type="number"
          placeholder="0"
          error={errors.amount?.message}
          helper="Total amount to be distributed. For milestone streams, all tokens unlock at once when you trigger the milestone."
          {...register('amount')}
        />

        {/* Schedule */}
        <div className="space-y-4">
          <p className="text-xs font-body font-semibold text-text-muted uppercase tracking-widest">
            {vestingType === 'milestone' ? 'Stream Window' : 'Vesting Schedule'}
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              min={today}
              error={errors.startDate?.message}
              {...register('startDate')}
            />
            <Input
              label="End Date"
              type="date"
              min={today}
              error={errors.endDate?.message}
              helper={vestingType === 'milestone' ? 'Deadline for milestone (stream expires after this)' : undefined}
              {...register('endDate')}
            />
          </div>

          {vestingType !== 'milestone' && (
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('hasCliff')}
                  className="w-4 h-4 accent-sol-purple"
                />
                <span className="text-sm text-text-secondary">Add cliff period</span>
              </label>
              {hasCliff && (
                <Input
                  label="Cliff Date"
                  type="date"
                  min={today}
                  error={errors.cliffDate?.message}
                  helper={
                    vestingType === 'linear'
                      ? 'No tokens unlock before this date. After cliff, linear vesting begins from stream start.'
                      : 'All tokens unlock on this date.'
                  }
                  {...register('cliffDate')}
                />
              )}
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div className="p-4 rounded-xl bg-sol-purple/5 border border-sol-purple/20">
          <p className="text-xs text-text-secondary">
            By creating this stream, tokens will be locked in a program vault. You can cancel at
            any time to return unvested tokens to your wallet. The recipient can only withdraw after
            {vestingType === 'milestone' ? ' you unlock the milestone.' : ' tokens have vested.'}
          </p>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={createStream.isPending}
          className="w-full"
        >
          {createStream.isPending ? 'Creating Stream...' : (
            <>Create Stream <ArrowRight className="w-4 h-4" /></>
          )}
        </Button>
      </form>

      <div className="hidden lg:block lg:col-span-2">
        <StreamPreview watch={watchAll} />
      </div>
    </div>
  )
}

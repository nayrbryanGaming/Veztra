import Link from 'next/link'
import { ArrowRight, ExternalLink, Code2, Shield, Zap, BookOpen, Terminal, Layers } from 'lucide-react'

const PROGRAM_ID = 'GarNqFaBLcyhb3knGu7s9qkESPJvVD7wHKDakWbCWiVC'

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="space-y-4 scroll-mt-24">
      <h2 className="font-display font-bold text-xl text-text-primary border-b border-bg-border pb-3">{title}</h2>
      {children}
    </section>
  )
}

function CodeBlock({ code, lang = 'typescript' }: { code: string; lang?: string }) {
  return (
    <div className="rounded-xl overflow-hidden border border-bg-border">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-bg-elevated border-b border-bg-border">
        <Terminal className="w-3.5 h-3.5 text-text-muted" />
        <span className="text-xs font-mono text-text-muted">{lang}</span>
      </div>
      <pre className="p-4 text-xs font-mono text-text-secondary overflow-x-auto leading-relaxed bg-bg-void">
        <code>{code}</code>
      </pre>
    </div>
  )
}

function ErrorRow({ code, name, desc }: { code: number; name: string; desc: string }) {
  return (
    <div className="flex items-start gap-4 py-3 border-b border-bg-border last:border-0">
      <span className="font-mono text-xs text-text-muted shrink-0 mt-0.5">{code}</span>
      <span className="font-mono text-xs text-sol-purple shrink-0 mt-0.5 w-48">{name}</span>
      <span className="text-xs text-text-secondary">{desc}</span>
    </div>
  )
}

function InstructionCard({ name, signer, desc, params }: {
  name: string; signer: string; desc: string;
  params: { name: string; type: string; desc: string }[]
}) {
  return (
    <div className="rounded-2xl p-px" style={{ background: 'linear-gradient(135deg, rgba(153,69,255,0.2), rgba(0,194,255,0.1))' }}>
      <div className="rounded-[calc(1rem-1px)] bg-bg-surface p-5 space-y-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <code className="font-mono text-sm font-semibold text-sol-purple">{name}</code>
            <p className="text-xs text-text-muted mt-0.5">Signer: <span className="text-text-secondary">{signer}</span></p>
          </div>
        </div>
        <p className="text-sm text-text-secondary">{desc}</p>
        {params.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-body font-semibold text-text-muted uppercase tracking-wider">Parameters</p>
            {params.map(p => (
              <div key={p.name} className="flex gap-3 text-xs">
                <code className="text-sol-green shrink-0 w-32">{p.name}</code>
                <code className="text-text-muted shrink-0 w-16">{p.type}</code>
                <span className="text-text-secondary">{p.desc}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function DocsPage() {
  const toc = [
    { id: 'overview', label: 'Overview' },
    { id: 'program', label: 'Program Details' },
    { id: 'vesting-types', label: 'Vesting Types' },
    { id: 'instructions', label: 'Instructions' },
    { id: 'errors', label: 'Error Codes' },
    { id: 'quickstart', label: 'Quick Start' },
    { id: 'security', label: 'Security' },
  ]

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">

          {/* Sidebar TOC */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 space-y-2">
              <p className="text-xs font-body font-semibold text-text-muted uppercase tracking-wider mb-4">On this page</p>
              {toc.map(item => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="block text-sm text-text-secondary hover:text-sol-purple transition-colors py-1"
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-4 mt-4 border-t border-bg-border space-y-2">
                <a
                  href={`https://explorer.solana.com/address/${PROGRAM_ID}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-text-muted hover:text-sol-purple transition-colors"
                >
                  <ExternalLink className="w-3 h-3" /> Explorer
                </a>
                <a
                  href="https://github.com/nayrbryanGaming/Veztra"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-text-muted hover:text-sol-purple transition-colors"
                >
                  <ExternalLink className="w-3 h-3" /> GitHub
                </a>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="lg:col-span-3 space-y-12">

            {/* Hero */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-sol-purple" />
                <span className="text-xs font-body font-semibold text-sol-purple uppercase tracking-wider">Documentation</span>
              </div>
              <h1 className="font-display font-bold text-4xl text-text-primary">VEZTRA Protocol</h1>
              <p className="text-text-secondary text-lg leading-relaxed">
                VEZTRA is a Solana-native token vesting and distribution protocol. Lock tokens
                on-chain, release them on a schedule, and let recipients withdraw without trust
                or intermediaries.
              </p>
            </div>

            {/* Overview */}
            <Section id="overview" title="Overview">
              <p className="text-sm text-text-secondary leading-relaxed">
                VEZTRA implements secure, on-chain token vesting for teams, DAOs, and investors on Solana.
                All logic lives in a single Anchor program — no backend, no admin keys, no rug risk.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: Shield, title: 'Non-custodial', desc: 'Tokens lock directly to a PDA vault. Only the recipient can withdraw vested amounts.' },
                  { icon: Zap, title: 'Low-cost', desc: '~0.002 SOL to create a stream. Claim transactions cost ~0.000005 SOL.' },
                  { icon: Code2, title: 'Open source', desc: 'Full contract source available on GitHub. Audit-ready Anchor code.' },
                ].map(item => (
                  <div key={item.title} className="rounded-xl p-4 space-y-2" style={{ background: 'rgba(153,69,255,0.06)', border: '1px solid rgba(153,69,255,0.15)' }}>
                    <item.icon className="w-5 h-5 text-sol-purple" />
                    <p className="font-body font-semibold text-sm text-text-primary">{item.title}</p>
                    <p className="text-xs text-text-secondary">{item.desc}</p>
                  </div>
                ))}
              </div>
            </Section>

            {/* Program */}
            <Section id="program" title="Program Details">
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-bg-border">
                  <span className="text-xs text-text-muted font-semibold uppercase tracking-wider">Program ID</span>
                  <code className="font-mono text-xs text-text-primary">{PROGRAM_ID}</code>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-bg-border">
                  <span className="text-xs text-text-muted font-semibold uppercase tracking-wider">Network</span>
                  <span className="text-xs text-sol-green font-body font-semibold">Devnet</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-bg-border">
                  <span className="text-xs text-text-muted font-semibold uppercase tracking-wider">Framework</span>
                  <span className="text-xs text-text-secondary">Anchor 0.32.0</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-xs text-text-muted font-semibold uppercase tracking-wider">Account size</span>
                  <span className="text-xs text-text-secondary">244 bytes per stream</span>
                </div>
              </div>
              <a
                href={`https://explorer.solana.com/address/${PROGRAM_ID}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs text-sol-purple hover:text-sol-purple/80 transition-colors"
              >
                View on Solana Explorer <ExternalLink className="w-3 h-3" />
              </a>
            </Section>

            {/* Vesting Types */}
            <Section id="vesting-types" title="Vesting Types">
              <div className="space-y-4">
                {[
                  {
                    type: 'Linear',
                    color: '#14F195',
                    desc: 'Tokens vest gradually and continuously from start to end date. Optionally add a cliff: nothing unlocks before the cliff date, then linear vesting begins from the original start time.',
                    example: 'Team token allocation: 12-month linear vest, 3-month cliff.',
                  },
                  {
                    type: 'Cliff',
                    color: '#00C2FF',
                    desc: 'Zero tokens unlock before the cliff date. At the cliff, 100% of tokens become available at once. No gradual release — all-or-nothing.',
                    example: 'Advisor grant: 6-month cliff, then full amount unlocks.',
                  },
                  {
                    type: 'Milestone',
                    color: '#9945FF',
                    desc: 'Tokens unlock only when the stream creator manually triggers the milestone. No time-based vesting — entirely condition-based. Creator signs an unlock_milestone transaction when the condition is met.',
                    example: 'Contractor payment: tokens release after delivery is confirmed.',
                  },
                ].map(item => (
                  <div key={item.type} className="rounded-xl p-4 space-y-2" style={{ background: 'rgba(17,14,31,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                      <p className="font-body font-semibold text-sm text-text-primary">{item.type} Vesting</p>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">{item.desc}</p>
                    <p className="text-xs text-text-muted italic">Example: {item.example}</p>
                  </div>
                ))}
              </div>
            </Section>

            {/* Instructions */}
            <Section id="instructions" title="Instructions">
              <div className="space-y-4">
                <InstructionCard
                  name="create_stream"
                  signer="creator"
                  desc="Locks tokens into a PDA vault and initializes a new stream account. The creator's token account is debited immediately."
                  params={[
                    { name: 'amount', type: 'u64', desc: 'Total tokens to lock (in smallest denomination).' },
                    { name: 'start_time', type: 'i64', desc: 'Unix timestamp when vesting begins.' },
                    { name: 'end_time', type: 'i64', desc: 'Unix timestamp when vesting ends.' },
                    { name: 'cliff_time', type: 'Option<i64>', desc: 'Optional cliff date. Must be between start and end.' },
                    { name: 'vesting_type', type: 'VestingType', desc: 'Linear | Cliff | Milestone.' },
                  ]}
                />
                <InstructionCard
                  name="withdraw"
                  signer="recipient"
                  desc="Transfers all currently vested and unclaimed tokens to the recipient. Can be called multiple times as more tokens vest."
                  params={[]}
                />
                <InstructionCard
                  name="cancel_stream"
                  signer="creator"
                  desc="Cancels an active stream. Vested-but-unclaimed tokens are sent to the recipient immediately. Unvested tokens return to the creator."
                  params={[]}
                />
                <InstructionCard
                  name="unlock_milestone"
                  signer="creator"
                  desc="Unlocks a milestone stream, making all tokens immediately available to the recipient. Only valid on Milestone-type streams. Can only be called once."
                  params={[]}
                />
              </div>
            </Section>

            {/* Errors */}
            <Section id="errors" title="Error Codes">
              <div className="rounded-xl overflow-hidden border border-bg-border">
                <div className="px-4 py-3 bg-bg-elevated border-b border-bg-border">
                  <p className="text-xs font-mono text-text-muted">VeztraError variants</p>
                </div>
                <div className="p-4 space-y-0">
                  {[
                    [6000, 'InvalidAmount', 'Amount must be greater than zero'],
                    [6001, 'InvalidTimeRange', 'End time must be after start time'],
                    [6002, 'InvalidCliffTime', 'Cliff time must be between start and end'],
                    [6003, 'Unauthorized', 'Only the stream creator can perform this action'],
                    [6004, 'AlreadyCancelled', 'Stream has already been cancelled'],
                    [6005, 'FullyVested', 'Stream is fully vested — nothing to cancel'],
                    [6006, 'NothingToWithdraw', 'No tokens available to withdraw right now'],
                    [6007, 'CliffNotReached', 'Cliff period has not been reached yet'],
                    [6008, 'StreamExpired', 'Stream has expired beyond the grace period'],
                    [6009, 'NotMilestoneStream', 'This stream is not a milestone-type stream'],
                    [6010, 'MilestoneAlreadyUnlocked', 'Milestone has already been unlocked'],
                    [6011, 'MilestoneNotUnlocked', 'Milestone not yet unlocked by creator'],
                  ].map(([code, name, desc]) => (
                    <ErrorRow key={code} code={code as number} name={name as string} desc={desc as string} />
                  ))}
                </div>
              </div>
            </Section>

            {/* Quick Start */}
            <Section id="quickstart" title="Quick Start">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-body font-semibold text-text-primary mb-2">1. Connect your wallet</p>
                  <p className="text-sm text-text-secondary">Click "Connect Wallet" in the top-right. VEZTRA supports Phantom and Solflare on devnet.</p>
                </div>
                <div>
                  <p className="text-sm font-body font-semibold text-text-primary mb-2">2. Get devnet SOL</p>
                  <CodeBlock code={`solana airdrop 2 --url devnet`} lang="bash" />
                </div>
                <div>
                  <p className="text-sm font-body font-semibold text-text-primary mb-2">3. Create a token (for testing)</p>
                  <CodeBlock
                    code={`spl-token create-token --url devnet
spl-token create-account <MINT> --url devnet
spl-token mint <MINT> 1000000 --url devnet`}
                    lang="bash"
                  />
                </div>
                <div>
                  <p className="text-sm font-body font-semibold text-text-primary mb-2">4. Create a stream via the UI</p>
                  <p className="text-sm text-text-secondary">Navigate to Dashboard → Create Stream. Fill in the recipient wallet, token mint, amount, and schedule.</p>
                  <Link
                    href="/stream/create"
                    className="inline-flex items-center gap-2 mt-3 px-5 py-2.5 rounded-full text-sm font-body font-semibold text-white"
                    style={{ background: 'linear-gradient(90deg, #9945FF, #00C2FF)' }}
                  >
                    Launch App <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </Section>

            {/* Security */}
            <Section id="security" title="Security">
              <div className="space-y-3 text-sm text-text-secondary">
                <div className="flex gap-3">
                  <span className="text-sol-green font-bold shrink-0">✓</span>
                  <p><strong className="text-text-primary">PDA ownership:</strong> The vault token account is owned by the stream PDA. No admin key can drain it.</p>
                </div>
                <div className="flex gap-3">
                  <span className="text-sol-green font-bold shrink-0">✓</span>
                  <p><strong className="text-text-primary">Signer checks:</strong> Only the recipient can call <code className="font-mono text-xs text-sol-purple">withdraw</code>. Only the creator can call <code className="font-mono text-xs text-sol-purple">cancel_stream</code> and <code className="font-mono text-xs text-sol-purple">unlock_milestone</code>.</p>
                </div>
                <div className="flex gap-3">
                  <span className="text-sol-green font-bold shrink-0">✓</span>
                  <p><strong className="text-text-primary">has_one constraints:</strong> Anchor validates that the creator, recipient, and mint accounts match the stream's stored fields — prevents substitution attacks.</p>
                </div>
                <div className="flex gap-3">
                  <span className="text-sol-green font-bold shrink-0">✓</span>
                  <p><strong className="text-text-primary">Safe arithmetic:</strong> All token calculations use <code className="font-mono text-xs text-sol-purple">checked_add</code>, <code className="font-mono text-xs text-sol-purple">saturating_sub</code>, and u128 intermediate math to prevent overflow.</p>
                </div>
                <div className="flex gap-3">
                  <span className="text-sol-green font-bold shrink-0">✓</span>
                  <p><strong className="text-text-primary">Double-withdraw protection:</strong> <code className="font-mono text-xs text-sol-purple">claimed_amount</code> is updated atomically. Each withdraw only transfers <code className="font-mono text-xs text-sol-purple">vested - claimed</code>.</p>
                </div>
                <div className="flex gap-3">
                  <span className="text-sol-green font-bold shrink-0">✓</span>
                  <p><strong className="text-text-primary">State validation:</strong> Cancelled/completed streams return explicit error codes, not silent failures. AlreadyCancelled and FullyVested prevent double-cancel.</p>
                </div>
              </div>
            </Section>

          </main>
        </div>
      </div>
    </div>
  )
}

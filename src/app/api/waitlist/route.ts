import { NextRequest, NextResponse } from 'next/server'
import { sbInsertEmail, sbGetCount, supabaseReady } from '@/lib/supabase-rest'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

/** POST /api/waitlist — join the waitlist */
export async function POST(req: NextRequest) {
  try {
    if (!supabaseReady()) {
      return NextResponse.json(
        { error: 'Waitlist service not configured' },
        { status: 503 },
      )
    }

    const body = await req.json().catch(() => null)
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    const result = await sbInsertEmail(email)

    if (result === 'inserted') {
      const count = await sbGetCount()
      return NextResponse.json({ success: true, count }, { status: 200 })
    }

    if (result === 'duplicate') {
      return NextResponse.json(
        { error: "You're already on the list!" },
        { status: 409 },
      )
    }

    console.error('[waitlist] insert error:', result)
    return NextResponse.json({ error: 'Could not save. Try again.' }, { status: 502 })
  } catch (e) {
    console.error('[waitlist] unexpected error:', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

/** GET /api/waitlist — return current count */
export async function GET() {
  if (!supabaseReady()) {
    return NextResponse.json({ count: null }, { status: 200 })
  }
  const count = await sbGetCount()
  return NextResponse.json({ count }, { status: 200 })
}

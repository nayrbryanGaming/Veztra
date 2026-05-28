/**
 * Supabase REST API helpers (no extra npm package needed).
 * Uses service-role key so it bypasses RLS — server-side only.
 */

const SB_URL = process.env.SUPABASE_URL ?? ''
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

function h(extra: Record<string, string> = {}): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    apikey: SB_KEY,
    Authorization: `Bearer ${SB_KEY}`,
    ...extra,
  }
}

export function supabaseReady(): boolean {
  return Boolean(SB_URL && SB_KEY)
}

/** Insert email. Returns 'inserted' | 'duplicate' | error string. */
export async function sbInsertEmail(
  email: string,
): Promise<'inserted' | 'duplicate' | string> {
  try {
    const res = await fetch(`${SB_URL}/rest/v1/waitlist`, {
      method: 'POST',
      headers: h({ Prefer: 'return=representation' }),
      body: JSON.stringify({ email }),
      cache: 'no-store',
    })
    if (res.status === 409) return 'duplicate'
    const bodyText = await res.text().catch(() => '')
    if (res.status === 200 || res.status === 201) {
      try {
        const parsed = JSON.parse(bodyText)
        if (Array.isArray(parsed) && parsed.length === 0) {
          return `error:silent-rls:body=[]:status=${res.status}`
        }
      } catch { /* not JSON — accept as inserted */ }
      return 'inserted'
    }
    if (res.status === 204) return 'inserted'
    return `error:${res.status}:${bodyText.slice(0, 200)}`
  } catch (e) {
    return `error:exception:${String(e).slice(0, 120)}`
  }
}

export type SbEntry = { email: string; created_at: string }

/** Return total row count. */
export async function sbGetCount(): Promise<number | null> {
  try {
    const res = await fetch(
      `${SB_URL}/rest/v1/waitlist?select=email&limit=1000000`,
      { headers: h(), cache: 'no-store' },
    )
    if (!res.ok) return null
    const data: SbEntry[] = await res.json()
    return data.length
  } catch {
    return null
  }
}

/** Return all entries ordered newest first. */
export async function sbGetList(): Promise<SbEntry[] | null> {
  try {
    const res = await fetch(
      `${SB_URL}/rest/v1/waitlist?select=email,created_at&order=created_at.desc&limit=50000`,
      { headers: h(), cache: 'no-store' },
    )
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

// Email OTP for the website contact form — server-side only (uses secrets, never import from client code).
// The 6-digit code is never stored: the browser gets a token signed with a server secret that only
// verifies together with the right code, so nobody can register a lead without owning the email address.

import { createHash, createHmac, randomBytes, randomInt, timingSafeEqual } from 'crypto'

export const CODE_TTL_MS = 10 * 60 * 1000
const MAX_ATTEMPTS = 5

export interface ContactFields {
  name: string
  email: string
  phone: string | null
  company: string | null
  service: string | null
  budget: string | null
  timeline: string | null
  message: string
}

const MAX_LENGTHS: Array<[keyof ContactFields, string, number]> = [
  ['name', 'Name', 100],
  ['email', 'Email', 254],
  ['phone', 'Phone', 30],
  ['company', 'Company', 120],
  ['service', 'Service', 100],
  ['budget', 'Budget', 50],
  ['timeline', 'Timeline', 50],
  ['message', 'Message', 5000],
]

/** Validates and normalises the form body. Both API steps use it, so the signed token matches the same values. */
export const parseContactFields = (
  body: Record<string, unknown>
): { fields: ContactFields } | { error: string } => {
  const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')
  // Optional fields — drop empty values and the old form's "Not provided/specified" placeholders
  const optional = (v: unknown) => {
    const s = str(v)
    return s && !/^not (provided|specified)$/i.test(s) ? s : null
  }

  const fields: ContactFields = {
    name: str(body.name).replace(/\s+/g, ' '),
    email: str(body.email).toLowerCase(),
    phone: optional(body.phone),
    company: optional(body.company),
    service: optional(body.service) || optional(body.projectType),
    budget: optional(body.budget),
    timeline: optional(body.timeline),
    message: str(body.message),
  }

  if (!fields.name || !fields.email || !fields.message) {
    return { error: 'Name, email, and message are required' }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    return { error: 'Please enter a valid email address' }
  }
  for (const [key, label, max] of MAX_LENGTHS) {
    const value = fields[key]
    if (value && value.length > max) return { error: `${label} is too long (max ${max} characters)` }
  }
  return { fields }
}

const fieldsDigest = (f: ContactFields) =>
  createHash('sha256')
    .update(JSON.stringify([f.name, f.email, f.phone, f.company, f.service, f.budget, f.timeline, f.message]))
    .digest('base64url')

// A dedicated secret is preferred; the SMTP app password is the fallback because
// verification can't run without SMTP anyway — so no extra setup is needed
const signingKey = (): Buffer | null => {
  const secret = process.env.CONTACT_VERIFY_SECRET || process.env.SMTP_PASSWORD
  return secret ? createHash('sha256').update(`contact-verify-v1:${secret}`).digest() : null
}

const sign = (key: Buffer, payload: string, code: string) =>
  createHmac('sha256', key).update(`${payload}.${code}`).digest()

/** Issues a 6-digit code plus a token bound to these exact form values (valid for 10 minutes). */
export const createContactCode = (fields: ContactFields): { code: string; token: string } => {
  const key = signingKey()
  if (!key) throw new Error('Contact verification secret is not configured')

  const code = randomInt(0, 1000000).toString().padStart(6, '0')
  const payload = Buffer.from(
    JSON.stringify({ d: fieldsDigest(fields), x: Date.now() + CODE_TTL_MS, n: randomBytes(12).toString('base64url') })
  ).toString('base64url')

  return { code, token: `${payload}.${sign(key, payload, code).toString('base64url')}` }
}

export type CodeCheck = 'ok' | 'invalid' | 'expired' | 'mismatch' | 'used' | 'too-many-attempts'

// Wrong-attempt counts and used tokens, per server instance. On serverless this is best-effort,
// but tokens are short-lived and a 6-digit code is out of reach with 5 guesses per token anyway.
const tokenState = new Map<string, { attempts: number; used: boolean; expiresAt: number }>()

const pruneTokenState = () => {
  if (tokenState.size < 1000) return
  const now = Date.now()
  tokenState.forEach((state, nonce) => {
    if (state.expiresAt < now) tokenState.delete(nonce)
  })
  if (tokenState.size > 10000) tokenState.clear()
}

export const checkContactCode = (token: unknown, code: unknown, fields: ContactFields): CodeCheck => {
  const key = signingKey()
  if (!key || typeof token !== 'string' || typeof code !== 'string' || !/^\d{6}$/.test(code)) return 'invalid'

  const [payload, signature] = token.split('.')
  if (!payload || !signature) return 'invalid'

  let claims: { d?: unknown; x?: unknown; n?: unknown }
  try {
    claims = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
  } catch {
    return 'invalid'
  }

  const now = Date.now()
  if (typeof claims.x !== 'number' || typeof claims.n !== 'string') return 'invalid'
  if (claims.x > now + CODE_TTL_MS) return 'invalid' // never issued by us
  if (now > claims.x) return 'expired'
  if (claims.d !== fieldsDigest(fields)) return 'mismatch'

  pruneTokenState()
  const state = tokenState.get(claims.n) || { attempts: 0, used: false, expiresAt: claims.x }
  if (state.used) return 'used'
  if (state.attempts >= MAX_ATTEMPTS) return 'too-many-attempts'

  const expected = sign(key, payload, code)
  const given = Buffer.from(signature, 'base64url')
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) {
    state.attempts += 1
    tokenState.set(claims.n, state)
    return state.attempts >= MAX_ATTEMPTS ? 'too-many-attempts' : 'invalid'
  }

  state.used = true
  tokenState.set(claims.n, state)
  return 'ok'
}

const requestLog = new Map<string, number[]>()

/** Sliding-window rate limit (per server instance): false once `limit` requests happened within `windowMs`. */
export const allowRequest = (key: string, limit: number, windowMs: number): boolean => {
  const now = Date.now()
  const recent = (requestLog.get(key) || []).filter((t) => now - t < windowMs)
  const allowed = recent.length < limit
  if (allowed) recent.push(now)
  requestLog.set(key, recent)

  if (requestLog.size > 10000) {
    requestLog.forEach((times, k) => {
      if (times.every((t) => now - t > 60 * 60 * 1000)) requestLog.delete(k)
    })
  }
  return allowed
}

export const clientIp = (headers: Headers): string =>
  headers.get('x-forwarded-for')?.split(',')[0]?.trim() || headers.get('x-real-ip') || 'unknown'

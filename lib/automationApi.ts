// Shared helpers for the marketing automation API (/api/automation/*). Server-side only: this file reads
// secrets, never import it from client code.
//
// The founder's PC calls these routes with AUTOMATION_API_TOKEN to publish blog posts and to host Instagram
// reels for a short time. The Supabase service-role key stays on the server, so the PC never holds a key
// to the whole database.

import { createHash, timingSafeEqual } from 'crypto'
import { NextResponse } from 'next/server'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

/** Private bucket that keeps reels until Instagram has fetched them. */
export const MEDIA_BUCKET = 'automation-media'
const MEDIA_MAX_BYTES = 50 * 1024 * 1024
const MIN_TOKEN_LENGTH = 32

export type JsonObject = Record<string, unknown>

export interface ApiError {
  ok: false
  error: string
}

export type ServiceClientResult =
  | { client: SupabaseClient; error?: undefined }
  | { client?: undefined; error: string }

// Answers can hold signed URLs, so no proxy or browser may keep them
const NO_STORE: Record<string, string> = { 'Cache-Control': 'no-store' }

/** Success answer: `{ ok: true, ...data }`. */
export const jsonOk = (data: JsonObject = {}): NextResponse =>
  NextResponse.json({ ok: true, ...data }, { status: 200, headers: NO_STORE })

/** Error answer: `{ ok: false, error }`. The message must never contain a token or a key. */
export const jsonError = (status: number, error: string, headers: Record<string, string> = {}): NextResponse => {
  const body: ApiError = { ok: false, error }
  return NextResponse.json(body, { status, headers: { ...NO_STORE, ...headers } })
}

/** A short error text with anything that looks like a key, a token or a signed URL's secret removed. */
export function safeMessage(err: unknown): string {
  let text = 'unknown error'
  if (typeof err === 'string') text = err
  else if (err && typeof err === 'object' && 'message' in err) text = String((err as { message: unknown }).message)

  const secrets = [process.env.SUPABASE_SERVICE_ROLE_KEY, process.env.AUTOMATION_API_TOKEN]
  secrets.forEach((secret) => {
    const value = (secret || '').trim()
    if (value.length >= 8) text = text.split(value).join('[redacted]')
  })
  const cleaned = text
    .replace(/eyJ[\w-]+\.[\w-]+\.[\w-]*/g, '[redacted]')
    .replace(/\bsb_[a-z]+_[\w-]+/gi, '[redacted]')
    .replace(/\b((?:token|apikey|api_key|key|signature|secret|password)=)[^&\s"']+/gi, '$1[redacted]')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 200)
  return cleaned || 'unknown error'
}

/** 502 for a Supabase failure: logged and answered without secrets. */
export function upstreamError(what: string, err: unknown): NextResponse {
  const message = `${what}: ${safeMessage(err)}`
  console.error(`[automation] ${message}`)
  return jsonError(502, message)
}

const sha256 = (value: string): Buffer => createHash('sha256').update(value, 'utf8').digest()

/**
 * Checks `Authorization: Bearer <AUTOMATION_API_TOKEN>`. Returns null when the token is right, otherwise the
 * 401 answer. SHA-256 digests are compared in constant time, so the check reveals nothing about the token.
 */
export function requireToken(request: Request): NextResponse | null {
  const expected = (process.env.AUTOMATION_API_TOKEN || '').trim()
  const challenge = { 'WWW-Authenticate': 'Bearer' }
  if (expected.length < MIN_TOKEN_LENGTH) {
    return jsonError(
      401,
      `AUTOMATION_API_TOKEN is not set on the server (it needs at least ${MIN_TOKEN_LENGTH} characters)`,
      challenge,
    )
  }
  const match = /^Bearer\s+(\S+)\s*$/i.exec(request.headers.get('authorization') || '')
  const given = match ? match[1] : ''
  return timingSafeEqual(sha256(given), sha256(expected)) ? null : jsonError(401, 'invalid or missing token', challenge)
}

/**
 * Reads a JSON object body of at most `maxBytes`: 413 when it is larger (also without a Content-Length header,
 * the bytes are counted while reading), 400 when it isn't a JSON object.
 */
export async function readJsonBody(
  request: Request,
  maxBytes: number,
): Promise<{ body: JsonObject } | { response: NextResponse }> {
  const tooLarge = () => ({ response: jsonError(413, `body is larger than ${Math.floor(maxBytes / 1024)} KB`) })
  if (Number(request.headers.get('content-length')) > maxBytes) return tooLarge()

  const chunks: Uint8Array[] = []
  let size = 0
  try {
    if (request.body) {
      const reader = request.body.getReader()
      for (;;) {
        const chunk = await reader.read()
        if (chunk.done) break
        size += chunk.value.byteLength
        if (size > maxBytes) {
          reader.cancel().catch(() => undefined)
          return tooLarge()
        }
        chunks.push(chunk.value)
      }
    }
  } catch {
    return { response: jsonError(400, 'could not read the request body') }
  }

  let body: unknown
  try {
    const text = Buffer.concat(chunks).toString('utf8')
    body = JSON.parse(text.charCodeAt(0) === 0xfeff ? text.slice(1) : text) // tolerate a UTF-8 BOM
  } catch {
    return { response: jsonError(400, 'body must be JSON') }
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { response: jsonError(400, 'body must be a JSON object') }
  }
  return { body: body as JsonObject }
}

/** True when SUPABASE_SERVICE_ROLE_KEY is set on the server. */
export const hasServiceKey = (): boolean => (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim() !== ''

/** A Supabase client with the service-role key (it bypasses RLS), created per request on the server only. */
export function getServiceClient(): ServiceClientResult {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim()
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()
  if (!key) return { error: 'SUPABASE_SERVICE_ROLE_KEY is not set on the server' }
  if (!url) return { error: 'NEXT_PUBLIC_SUPABASE_URL is not set on the server' }
  return { client: createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }) }
}

/** The reel bucket's settings: private (files open only through a signed link), MP4 only, 50 MB per file. */
const MEDIA_BUCKET_SETTINGS = { public: false, allowedMimeTypes: ['video/mp4'], fileSizeLimit: MEDIA_MAX_BYTES }

interface BucketSettings {
  public: boolean
  allowed_mime_types?: string[] | null
  file_size_limit?: number | string | null
}

const hasMediaSettings = (bucket: BucketSettings): boolean =>
  bucket.public === false &&
  (bucket.allowed_mime_types || []).join(',') === MEDIA_BUCKET_SETTINGS.allowedMimeTypes.join(',') &&
  Number(bucket.file_size_limit) === MEDIA_MAX_BYTES

/**
 * Makes sure the reel bucket exists with MEDIA_BUCKET_SETTINGS. A bucket that already exists with other
 * settings (made public by hand, say) is changed back, so no reel can be downloaded without a signed link.
 * Returns null when the bucket is ready, else the reason.
 */
export async function ensureMediaBucket(client: SupabaseClient): Promise<string | null> {
  try {
    let bucket: BucketSettings | null = (await client.storage.getBucket(MEDIA_BUCKET)).data
    if (!bucket) {
      const created = await client.storage.createBucket(MEDIA_BUCKET, MEDIA_BUCKET_SETTINGS)
      if (!created.error) return null
      if (!/already exists|duplicate/i.test(created.error.message)) return safeMessage(created.error)
      // It exists after all (made by another request a moment ago): check it like any existing bucket
      const again = await client.storage.getBucket(MEDIA_BUCKET)
      if (!again.data) return safeMessage(again.error)
      bucket = again.data
    }
    if (hasMediaSettings(bucket)) return null

    const updated = await client.storage.updateBucket(MEDIA_BUCKET, MEDIA_BUCKET_SETTINGS)
    if (updated.error) {
      return `the ${MEDIA_BUCKET} bucket must be private, MP4 only, 50 MB, and could not be changed: ${safeMessage(updated.error)}`
    }
    console.warn(`[automation] the ${MEDIA_BUCKET} bucket had other settings; it is private, MP4 only and 50 MB again`)
    return null
  } catch (err) {
    return safeMessage(err)
  }
}

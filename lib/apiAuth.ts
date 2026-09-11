// Server-side authorization guard for API routes.
// The admin panel's permissions.ts gates the UI; this enforces the same rules
// at the API boundary so a writer/editor can't bypass the UI by calling routes directly.
//
// Trust model: we trust ONLY the caller's user id as a lookup key, then read that
// user's role straight from the database. A role sent by the client is never trusted,
// so editing localStorage to claim role:'admin' does nothing here.
import { supabase } from './supabase'

export type GuardResult =
  | { ok: true; role: 'admin' | 'editor' | 'writer' }
  | { ok: false; status: number; error: string }

// Resolve the caller's real role from the DB by their id.
async function resolveRole(callerId: string | undefined | null): Promise<GuardResult> {
  if (!callerId || typeof callerId !== 'string') {
    return { ok: false, status: 401, error: 'Authentication required' }
  }
  const { data, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', callerId)
    .single()
  if (error || !data) {
    return { ok: false, status: 401, error: 'Invalid session' }
  }
  return { ok: true, role: data.role }
}

// Require the caller to be an admin (used for user management routes).
export async function requireAdmin(callerId: string | undefined | null): Promise<GuardResult> {
  const res = await resolveRole(callerId)
  if (!res.ok) return res
  if (res.role !== 'admin') {
    return { ok: false, status: 403, error: 'Admin access required' }
  }
  return res
}

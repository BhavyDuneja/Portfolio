// Per-user PRIVATE calendar events (personal overlay).
// Each row belongs to one user (user_id) — only that user sees them.
// Requires a `user_events` table in Supabase — see the setup SQL.
import { supabase } from './supabase'

export interface UserEvent {
  id: string
  user_id: string
  title: string
  event_date: string // YYYY-MM-DD
  note: string | null
  created_at: string
}

export const getMyEvents = async (userId: string): Promise<UserEvent[]> => {
  if (!userId) return []
  const { data, error } = await supabase
    .from('user_events')
    .select('*')
    .eq('user_id', userId)
    .order('event_date', { ascending: true })
  if (error) { console.error('getMyEvents:', error.message); return [] }
  return (data || []) as UserEvent[]
}

export const addUserEvent = async (
  e: { user_id: string; title: string; event_date: string; note?: string }
): Promise<UserEvent | null> => {
  const { data, error } = await supabase
    .from('user_events')
    .insert({ user_id: e.user_id, title: e.title, event_date: e.event_date, note: e.note || null })
    .select()
    .single()
  if (error) { console.error('addUserEvent:', error.message); return null }
  return data as UserEvent
}

export const deleteUserEvent = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from('user_events').delete().eq('id', id)
  if (error) { console.error('deleteUserEvent:', error.message); return false }
  return true
}

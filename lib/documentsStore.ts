// Supabase CRUD for in-app documents (shared across all admin users).
// Requires a `documents` table in Supabase — see the SQL provided during setup.
import { supabase } from './supabase'

export interface DocRecord {
  id: string
  title: string
  content: string
  category: string
  author_name: string | null
  created_at: string
  updated_at: string
}

export const getAllDocs = async (): Promise<DocRecord[]> => {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .order('updated_at', { ascending: false })
  if (error) { console.error('getAllDocs:', error.message); return [] }
  return (data || []) as DocRecord[]
}

export const createDoc = async (
  d: { title: string; content: string; category: string; author_name: string }
): Promise<DocRecord | null> => {
  const { data, error } = await supabase
    .from('documents')
    .insert({ title: d.title, content: d.content, category: d.category, author_name: d.author_name })
    .select()
    .single()
  if (error) { console.error('createDoc:', error.message); return null }
  return data as DocRecord
}

export const updateDocById = async (
  id: string,
  updates: Partial<Pick<DocRecord, 'title' | 'content' | 'category'>>
): Promise<boolean> => {
  const { error } = await supabase
    .from('documents')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) { console.error('updateDocById:', error.message); return false }
  return true
}

export const deleteDocById = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from('documents').delete().eq('id', id)
  if (error) { console.error('deleteDocById:', error.message); return false }
  return true
}

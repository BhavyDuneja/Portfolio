import { supabase, DbContactSubmission } from './supabase'

export const getContactSubmissions = async (): Promise<DbContactSubmission[]> => {
  const { data, error } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch contact submissions:', error)
    return []
  }

  return data as DbContactSubmission[]
}

export const updateSubmissionStatus = async (
  id: string,
  status: 'new' | 'read' | 'replied'
): Promise<boolean> => {
  const { error } = await supabase
    .from('contact_submissions')
    .update({ status })
    .eq('id', id)

  if (error) {
    console.error('Failed to update submission status:', error)
    return false
  }

  return true
}

export const deleteSubmission = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('contact_submissions')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Failed to delete submission:', error)
    return false
  }

  return true
}

export const getSubmissionStats = async (): Promise<{
  total: number
  unread: number
  replied: number
}> => {
  const { data, error } = await supabase
    .from('contact_submissions')
    .select('status')

  if (error) {
    console.error('Failed to fetch submission stats:', error)
    return { total: 0, unread: 0, replied: 0 }
  }

  const submissions = data || []
  return {
    total: submissions.length,
    unread: submissions.filter((s) => s.status === 'new').length,
    replied: submissions.filter((s) => s.status === 'replied').length,
  }
}

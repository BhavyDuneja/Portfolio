// Health check for the marketing automation on the founder's PC: is its token right, is the service key set,
// and can the server reach the blog table and the private reel bucket?

import { NextRequest } from 'next/server'
import type { SupabaseClient } from '@supabase/supabase-js'
import {
  ensureMediaBucket,
  getServiceClient,
  hasServiceKey,
  jsonOk,
  requireToken,
  safeMessage,
} from '@/lib/automationApi'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

async function databaseWorks(db: SupabaseClient): Promise<boolean> {
  try {
    const { error } = await db.from('blog_posts').select('id').limit(1)
    if (error) console.error('[automation/health] database:', safeMessage(error))
    return !error
  } catch (err) {
    console.error('[automation/health] database:', safeMessage(err))
    return false
  }
}

export async function GET(request: NextRequest) {
  const denied = requireToken(request)
  if (denied) return denied

  const service = getServiceClient()
  if (!service.client) return jsonOk({ service_key: hasServiceKey(), database: false, storage: false })

  const [database, bucketProblem] = await Promise.all([
    databaseWorks(service.client),
    ensureMediaBucket(service.client),
  ])
  if (bucketProblem) console.error('[automation/health] storage:', bucketProblem)
  return jsonOk({ service_key: true, database, storage: bucketProblem === null })
}

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { id, notes, status, meeting_date, meeting_time } = await req.json()

    if (!id) {
      return NextResponse.json({ error: 'Meeting ID required' }, { status: 400 })
    }

    const updateData: Record<string, any> = {}
    if (notes !== undefined) updateData.notes = notes
    if (status !== undefined) updateData.status = status
    if (meeting_date !== undefined) updateData.meeting_date = meeting_date
    if (meeting_time !== undefined) updateData.meeting_time = meeting_time

    const { error } = await supabase
      .from('meetings')
      .update(updateData)
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

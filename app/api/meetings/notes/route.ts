import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { id, notes, status } = await req.json()

    if (!id) {
      return NextResponse.json({ error: 'Meeting ID required' }, { status: 400 })
    }

    const updateData: Record<string, any> = {}
    if (notes !== undefined) updateData.notes = notes
    if (status !== undefined) updateData.status = status

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

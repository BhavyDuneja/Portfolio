import { NextRequest, NextResponse } from 'next/server'
import {
  getContactSubmissions,
  updateSubmissionStatus,
  deleteSubmission,
} from '@/lib/contact-db'

export async function GET() {
  try {
    const submissions = await getContactSubmissions()

    return NextResponse.json({
      success: true,
      data: submissions,
    })
  } catch (error) {
    console.error('Failed to fetch submissions:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch submissions',
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'id and status are required' },
        { status: 400 }
      )
    }

    if (!['new', 'read', 'replied'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'status must be one of: new, read, replied' },
        { status: 400 }
      )
    }

    const updated = await updateSubmissionStatus(id, status)

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Failed to update submission' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Submission status updated',
    })
  } catch (error) {
    console.error('Failed to update submission:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update submission',
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'id is required' },
        { status: 400 }
      )
    }

    const deleted = await deleteSubmission(id)

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete submission' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Submission deleted',
    })
  } catch (error) {
    console.error('Failed to delete submission:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete submission',
      },
      { status: 500 }
    )
  }
}

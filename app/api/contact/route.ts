import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Your Google Apps Script URL
    const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbxn5r96AdFEN2LtgR4m_1WIKMZbhCspsISWzS2ycVk576bDqLo-uUf_rk596w6vKbHu1A/exec"
    
    // Send data to Google Sheets from server (no CORS issues)
    const response = await fetch(GOOGLE_SHEETS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })
    
    const responseText = await response.text()
    
    if (response.ok) {
      return NextResponse.json({ 
        success: true, 
        message: 'Data sent to Google Sheets successfully'
      })
    } else {
      return NextResponse.json({ 
        success: false, 
        error: `Google Sheets API error: ${response.status}`
      }, { status: 500 })
    }
    
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
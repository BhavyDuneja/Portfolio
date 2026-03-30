import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  // Verify cron secret (Vercel sends this header)
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
    return NextResponse.json({ error: 'SMTP not configured' }, { status: 500 })
  }

  try {
    // Get today's date in YYYY-MM-DD
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]

    // Get tomorrow's date
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowStr = tomorrow.toISOString().split('T')[0]

    // Find meetings scheduled for today or tomorrow that haven't been reminded
    const { data: meetings, error } = await supabase
      .from('meetings')
      .select('*')
      .in('meeting_date', [todayStr, tomorrowStr])
      .eq('status', 'scheduled')
      .is('reminder_sent', null)

    if (error || !meetings || meetings.length === 0) {
      return NextResponse.json({ message: 'No reminders to send', count: 0 })
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    })

    let sent = 0

    for (const meeting of meetings) {
      const isToday = meeting.meeting_date === todayStr
      const timeLabel = isToday ? 'today' : 'tomorrow'

      try {
        // Reminder to visitor
        await transporter.sendMail({
          from: `"Bhavya from AnantaSutra" <${process.env.SMTP_EMAIL}>`,
          to: meeting.email,
          subject: `${isToday ? 'Today' : 'Tomorrow'} at ${meeting.meeting_time} — Quick Prep Inside`,
          html: `
            <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0A0F; color: #e8e6f0; padding: 32px; border-radius: 16px;">
              <div style="border-bottom: 1px solid rgba(232,163,23,0.3); padding-bottom: 20px; margin-bottom: 24px;">
                <h1 style="color: #E8A317; font-size: 22px; margin: 0;">${isToday ? 'See You Today' : 'See You Tomorrow'} 🗓️</h1>
              </div>
              <p style="color: #e8e6f0; line-height: 1.7; font-size: 15px;">
                Hi ${meeting.name},<br/><br/>Quick reminder about our session ${timeLabel}. I've put together a few initial observations about ${meeting.service_interest || 'your space'} that I'll share on the call — looking forward to discussing them with you.
              </p>
              <div style="margin: 24px 0; padding: 20px; background: rgba(232,163,23,0.06); border-radius: 12px; border: 1px solid rgba(232,163,23,0.15);">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr><td style="padding: 6px 0; color: #8b89a0; width: 80px;">Date</td><td style="color: #E8A317; font-weight: 700; font-size: 16px;">${meeting.meeting_date}</td></tr>
                  <tr><td style="padding: 6px 0; color: #8b89a0;">Time</td><td style="color: #E8A317; font-weight: 700; font-size: 16px;">${meeting.meeting_time} (${meeting.timezone || 'IST'})</td></tr>
                  <tr><td style="padding: 6px 0; color: #8b89a0;">Topic</td><td style="color: #e8e6f0;">${meeting.service_interest || 'Strategy Session'}</td></tr>
                </table>
              </div>
              <div style="margin: 20px 0; text-align: center;">
                <a href="https://meet.google.com/riu-uofk-tsi" style="display: inline-block; background: #E8A317; color: #0A0A0F; padding: 14px 36px; border-radius: 8px; font-weight: 700; font-size: 16px; text-decoration: none;">Join Meeting</a>
              </div>
              <p style="color: #8b89a0; line-height: 1.7; font-size: 13px;">
                <a href="mailto:contact@anantasutra.com" style="color: #E8A317;">Need to reschedule? No problem</a> — reply to this email or WhatsApp us.
              </p>
              <div style="margin-top: 24px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 16px;">
                <p style="color: #e8e6f0; font-size: 13px; margin: 0;">
                  Talk soon,<br/>
                  <strong style="color: #E8A317;">Bhavya Duneja</strong><br/>
                  <span style="color: #8b89a0; font-size: 12px;">Co-Founder, AnantaSutra</span>
                </p>
              </div>
            </div>
          `,
        })

        // Mark reminder as sent
        await supabase
          .from('meetings')
          .update({ reminder_sent: true })
          .eq('id', meeting.id)

        sent++
      } catch (emailErr) {
        console.error(`Failed to send reminder to ${meeting.email}:`, emailErr)
      }
    }

    // Auto-complete past meetings (yesterday or older, still marked 'scheduled')
    let autoCompleted = 0
    try {
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]

      const { data: pastMeetings } = await supabase
        .from('meetings')
        .select('id')
        .eq('status', 'scheduled')
        .lt('meeting_date', todayStr)

      if (pastMeetings && pastMeetings.length > 0) {
        const ids = pastMeetings.map(m => m.id)
        await supabase
          .from('meetings')
          .update({ status: 'completed' })
          .in('id', ids)
        autoCompleted = ids.length
      }
    } catch (acErr) {
      console.error('Auto-complete error:', acErr)
    }

    return NextResponse.json({
      message: `Sent ${sent} reminders, auto-completed ${autoCompleted} past meetings`,
      reminders: sent,
      autoCompleted,
    })
  } catch (err) {
    console.error('Cron job error:', err)
    return NextResponse.json({ error: 'Cron job failed' }, { status: 500 })
  }
}

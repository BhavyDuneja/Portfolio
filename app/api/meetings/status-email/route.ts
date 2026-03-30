import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
  if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
    return NextResponse.json({ error: 'SMTP not configured' }, { status: 500 })
  }

  try {
    const { name, email, meeting_date, meeting_time, service_interest, status, new_date, new_time } = await req.json()

    if (!email || !status) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    })

    const templates: Record<string, { subject: string; heading: string; body: string; cta: string }> = {
      cancelled: {
        subject: `Session Cancelled — Door's Always Open`,
        heading: `Your Session Has Been Cancelled`,
        body: `Hi ${name || 'there'},<br/><br/>Your session on <strong>${meeting_date}</strong> at <strong>${meeting_time}</strong> has been cancelled. Completely understand — schedules shift.<br/><br/>Quick question before we close this out: would a different time or format work better? We're flexible with scheduling and can also do async if that suits you.`,
        cta: `Our offer has no expiry. Whenever the timing feels right, just reply to this email or visit <a href="https://anantasutra.com" style="color: #E8A317; font-weight: 600;">anantasutra.com</a> to book a new slot. Or WhatsApp us for quick coordination.`,
      },
      'no-show': {
        subject: `Hope everything's okay — happy to reschedule`,
        heading: `Checking In`,
        body: `Hi ${name || 'there'},<br/><br/>Hope everything's alright on your end. We had a session on the calendar for <strong>${meeting_date}</strong> at <strong>${meeting_time}</strong> — no worries at all if something came up.<br/><br/>I'd still love to share how we can help your business grow. I can also send you a quick video summary of what I had prepared, if that's easier than a live call.`,
        cta: `<a href="https://anantasutra.com" style="color: #E8A317; font-weight: 600;">Reschedule in one click</a> — or simply reply with a time that works. Zero pressure, the complimentary session is always available.`,
      },
      'rescheduled': {
        subject: `Reschedule Confirmed — ${new_date || meeting_date}, ${new_time || meeting_time}`,
        heading: `Your Session Has Been Rescheduled ✅`,
        body: `Hi ${name || 'there'},<br/><br/>As requested, your session has been moved to the new date and time below. Everything else stays the same — same agenda, same Google Meet link, same team.`,
        cta: `
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
            <tr><td style="padding: 6px 0; color: #8b89a0; width: 100px;">New Date</td><td style="color: #E8A317; font-weight: 700; font-size: 16px;">${new_date || meeting_date}</td></tr>
            <tr><td style="padding: 6px 0; color: #8b89a0;">New Time</td><td style="color: #E8A317; font-weight: 700; font-size: 16px;">${new_time || meeting_time}</td></tr>
            <tr><td style="padding: 6px 0; color: #8b89a0;">Topic</td><td style="color: #e8e6f0;">${service_interest || 'Strategy Session'}</td></tr>
          </table>
          <div style="text-align: center;">
            <a href="https://meet.google.com/riu-uofk-tsi" style="display: inline-block; background: #E8A317; color: #0A0A0F; padding: 14px 36px; border-radius: 8px; font-weight: 700; font-size: 16px; text-decoration: none;">Join Meeting</a>
          </div>
          <p style="color: #8b89a0; font-size: 13px; margin-top: 16px;">Need to adjust again? Just reply to this email or WhatsApp us — happy to work around your schedule.</p>
        `,
      },
    }

    const template = templates[status]
    if (!template) {
      return NextResponse.json({ error: 'No template for this status' }, { status: 400 })
    }

    await transporter.sendMail({
      from: `"Bhavya from AnantaSutra" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: template.subject,
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0A0F; color: #e8e6f0; padding: 32px; border-radius: 16px;">
          <div style="border-bottom: 1px solid rgba(232,163,23,0.3); padding-bottom: 20px; margin-bottom: 24px;">
            <h1 style="color: #E8A317; font-size: 22px; margin: 0;">${template.heading}</h1>
          </div>
          <p style="color: #e8e6f0; line-height: 1.7; font-size: 15px;">
            ${template.body}
          </p>
          <div style="margin: 24px 0; padding: 20px; background: rgba(232,163,23,0.06); border-radius: 12px; border: 1px solid rgba(232,163,23,0.15);">
            <p style="color: #e8e6f0; line-height: 1.7; font-size: 14px; margin: 0;">
              ${template.cta}
            </p>
          </div>
          <div style="margin-top: 32px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 20px;">
            <p style="color: #e8e6f0; font-size: 14px; margin: 0;">
              Take care,<br/>
              <strong style="color: #E8A317;">Bhavya Duneja</strong><br/>
              <span style="color: #8b89a0; font-size: 12px;">Co-Founder, AnantaSutra | anantasutra.com</span>
            </p>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Status email error:', err)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}

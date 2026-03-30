import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
  if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
    return NextResponse.json({ error: 'SMTP not configured' }, { status: 500 })
  }

  try {
    const { name, email, meeting_date, meeting_time, service_interest, status } = await req.json()

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
        subject: `Meeting Cancelled — We'd Love to Reconnect | AnantaSutra`,
        heading: `Meeting Cancelled 📅`,
        body: `We understand that plans change — your consultation scheduled for <strong>${meeting_date}</strong> at <strong>${meeting_time}</strong> has been cancelled.

        <br/><br/>No worries at all! We'd love to connect whenever you're ready. Our free consultation offer never expires, and we're always here to help your business grow.`,
        cta: `Whenever you'd like to reschedule, just reply to this email or visit <a href="https://anantasutra.com" style="color: #E8A317; font-weight: 600;">anantasutra.com</a> and chat with Sutra — she'll set up a new time in seconds.`,
      },
      'no-show': {
        subject: `We Missed You! — Let's Reschedule | AnantaSutra`,
        heading: `We Missed You Today! 👋`,
        body: `Hi <strong>${name}</strong>, we noticed you couldn't make it to our consultation scheduled for <strong>${meeting_date}</strong> at <strong>${meeting_time}</strong>.

        <br/><br/>We totally understand — things come up! No pressure at all. We've kept your spot warm, and we'd genuinely love to hear about your business when you have a moment.`,
        cta: `Just reply to this email with a new time that works better, or visit <a href="https://anantasutra.com" style="color: #E8A317; font-weight: 600;">anantasutra.com</a> to reschedule instantly. The consultation is still 100% free — no expiry! 😊`,
      },
    }

    const template = templates[status]
    if (!template) {
      return NextResponse.json({ error: 'No template for this status' }, { status: 400 })
    }

    await transporter.sendMail({
      from: `"AnantaSutra" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: template.subject,
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0A0F; color: #e8e6f0; padding: 32px; border-radius: 16px;">
          <div style="border-bottom: 1px solid rgba(232,163,23,0.3); padding-bottom: 20px; margin-bottom: 24px;">
            <h1 style="color: #E8A317; font-size: 24px; margin: 0;">${template.heading}</h1>
          </div>
          <p style="color: #e8e6f0; line-height: 1.8; font-size: 15px;">
            ${template.body}
          </p>
          <div style="margin: 24px 0; padding: 20px; background: rgba(232,163,23,0.06); border-radius: 12px; border: 1px solid rgba(232,163,23,0.15);">
            <p style="color: #e8e6f0; line-height: 1.8; font-size: 14px; margin: 0;">
              ${template.cta}
            </p>
          </div>
          <div style="margin-top: 32px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 20px;">
            <p style="color: #e8e6f0; font-size: 14px; margin: 0;">
              Warm regards,<br/>
              <strong style="color: #E8A317;">Bhavya Duneja & Team AnantaSutra</strong><br/>
              <span style="color: #8b89a0; font-size: 12px;">Infinite Wisdom, Applied | anantasutra.com</span>
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

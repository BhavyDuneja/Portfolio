import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, date, time, timezone, service_interest } = await req.json()

    if (!name || !email || !date || !time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // 1. Save to Supabase
    let dbSaved = false
    try {
      const { error } = await supabase
        .from('meetings')
        .insert({
          name,
          email,
          phone: phone || null,
          meeting_date: date,
          meeting_time: time,
          timezone: timezone || 'Asia/Kolkata',
          service_interest: service_interest || 'General',
          status: 'scheduled',
        })
      if (!error) dbSaved = true
      else console.error('Meeting DB error:', error)
    } catch (e) {
      console.error('Meeting DB threw:', e)
    }

    // 2. Send emails if SMTP configured
    let emailSent = false
    if (process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
          },
        })

        // Email to AnantaSutra team
        await transporter.sendMail({
          from: `"AnantaSutra — Sutra Bot" <${process.env.SMTP_EMAIL}>`,
          to: 'co-founder@anantasutra.com',
          subject: `🗓️ New Meeting Booked: ${name} — ${service_interest || 'General'}`,
          html: `
            <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0A0F; color: #e8e6f0; padding: 32px; border-radius: 16px;">
              <div style="border-bottom: 1px solid rgba(232,163,23,0.3); padding-bottom: 20px; margin-bottom: 24px;">
                <h1 style="color: #E8A317; font-size: 22px; margin: 0;">New Meeting Booked via Sutra</h1>
              </div>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 10px 0; color: #8b89a0; width: 140px;">Name</td><td style="color: #e8e6f0; font-weight: 600;">${name}</td></tr>
                <tr><td style="padding: 10px 0; color: #8b89a0;">Email</td><td><a href="mailto:${email}" style="color: #E8A317;">${email}</a></td></tr>
                <tr><td style="padding: 10px 0; color: #8b89a0;">Phone</td><td style="color: #e8e6f0; font-weight: 600;">${phone || 'Not provided'}</td></tr>
                <tr><td style="padding: 10px 0; color: #8b89a0;">Date</td><td style="color: #e8e6f0; font-weight: 600;">${date}</td></tr>
                <tr><td style="padding: 10px 0; color: #8b89a0;">Time</td><td style="color: #e8e6f0; font-weight: 600;">${time} (${timezone || 'Asia/Kolkata'})</td></tr>
                <tr><td style="padding: 10px 0; color: #8b89a0;">Service Interest</td><td style="color: #e8e6f0;">${service_interest || 'General'}</td></tr>
              </table>
              <div style="margin-top: 24px; padding: 16px; background: rgba(232,163,23,0.08); border-radius: 12px; border: 1px solid rgba(232,163,23,0.2);">
                <p style="color: #E8A317; margin: 0; font-size: 14px; font-weight: 600;">Meeting Link</p>
                <p style="color: #e8e6f0; margin: 8px 0 0; font-size: 13px;"><a href="https://meet.google.com/riu-uofk-tsi" style="color: #E8A317; font-weight: 600;">https://meet.google.com/riu-uofk-tsi</a></p>
              </div>
              <p style="color: #8b89a0; font-size: 11px; margin-top: 24px;">Booked via Sutra chatbot on anantasutra.com</p>
            </div>
          `,
        })

        // Confirmation email to the visitor
        await transporter.sendMail({
          from: `"AnantaSutra" <${process.env.SMTP_EMAIL}>`,
          to: email,
          subject: `Your FREE Consultation is Confirmed — AnantaSutra`,
          html: `
            <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0A0F; color: #e8e6f0; padding: 32px; border-radius: 16px;">
              <div style="border-bottom: 1px solid rgba(232,163,23,0.3); padding-bottom: 20px; margin-bottom: 24px;">
                <h1 style="color: #E8A317; font-size: 24px; margin: 0;">You're All Set, ${name}! 🎉</h1>
              </div>
              <p style="color: #e8e6f0; line-height: 1.8; font-size: 15px;">
                Your <strong>FREE consultation</strong> with AnantaSutra has been confirmed.
              </p>
              <div style="margin: 24px 0; padding: 20px; background: rgba(232,163,23,0.06); border-radius: 12px; border: 1px solid rgba(232,163,23,0.15);">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr><td style="padding: 6px 0; color: #8b89a0; width: 80px;">Date</td><td style="color: #E8A317; font-weight: 700; font-size: 16px;">${date}</td></tr>
                  <tr><td style="padding: 6px 0; color: #8b89a0;">Time</td><td style="color: #E8A317; font-weight: 700; font-size: 16px;">${time}</td></tr>
                  <tr><td style="padding: 6px 0; color: #8b89a0;">Topic</td><td style="color: #e8e6f0;">${service_interest || 'General Consultation'}</td></tr>
                </table>
              </div>
              <div style="margin: 20px 0; padding: 16px; background: rgba(232,163,23,0.08); border-radius: 12px; border: 1px solid rgba(232,163,23,0.2); text-align: center;">
                <p style="color: #8b89a0; margin: 0 0 8px; font-size: 12px;">JOIN VIA GOOGLE MEET</p>
                <a href="https://meet.google.com/riu-uofk-tsi" style="color: #E8A317; font-size: 18px; font-weight: 700; text-decoration: none;">meet.google.com/riu-uofk-tsi</a>
              </div>
              <p style="color: #e8e6f0; line-height: 1.8; font-size: 14px;">
                Our founder <strong>Bhavya Duneja</strong> will personally join this call. Just click the link above at your scheduled time.
              </p>
              <p style="color: #8b89a0; line-height: 1.8; font-size: 13px; margin-top: 16px;">
                Need to reschedule? Just reply to this email or reach us at <a href="mailto:contact@anantasutra.com" style="color: #E8A317;">contact@anantasutra.com</a>
              </p>
              <div style="margin-top: 32px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 20px;">
                <p style="color: #e8e6f0; font-size: 14px; margin: 0;">
                  Warm regards,<br/>
                  <strong style="color: #E8A317;">Team AnantaSutra</strong><br/>
                  <span style="color: #8b89a0; font-size: 12px;">Infinite Wisdom, Applied | anantasutra.com</span>
                </p>
              </div>
            </div>
          `,
        })

        emailSent = true
      } catch (emailErr) {
        console.error('Meeting email failed:', emailErr)
      }
    }

    return NextResponse.json({
      success: true,
      dbSaved,
      emailSent,
    })
  } catch {
    return NextResponse.json({ error: 'Failed to process meeting' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ meetings: [] }, { status: 500 })
    }

    return NextResponse.json({ meetings: data || [] })
  } catch {
    return NextResponse.json({ meetings: [] }, { status: 500 })
  }
}

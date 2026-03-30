import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, service, message } = body

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    // Save to Supabase first — even if email fails, we have the data
    let dbSaved = false
    try {
      const { error: dbError } = await supabase
        .from('contact_submissions')
        .insert({
          name,
          email,
          service: service || null,
          message,
          status: 'new',
        })

      if (dbError) {
        console.error('Failed to save contact submission to DB:', dbError)
      } else {
        dbSaved = true
      }
    } catch (dbErr) {
      console.error('DB insert threw an error:', dbErr)
    }

    // Send emails only if SMTP credentials are configured
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
          from: `"AnantaSutra Website" <${process.env.SMTP_EMAIL}>`,
          to: 'co-founder@anantasutra.com',
          replyTo: email,
          subject: `New Lead: ${name} — ${service || 'General'}`,
          html: `
            <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0A0F; color: #e8e6f0; padding: 32px; border-radius: 16px;">
              <div style="border-bottom: 1px solid rgba(232,163,23,0.3); padding-bottom: 20px; margin-bottom: 24px;">
                <h1 style="color: #E8A317; font-size: 22px; margin: 0;">New Inquiry from ${name}</h1>
                <p style="color: #8b89a0; margin: 8px 0 0; font-size: 13px;">${service || 'General'} ${dbSaved ? '| Saved to DB' : '| DB save failed'}</p>
              </div>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; color: #8b89a0; width: 100px;">Name</td><td style="color: #e8e6f0; font-weight: 600;">${name}</td></tr>
                <tr><td style="padding: 8px 0; color: #8b89a0;">Email</td><td><a href="mailto:${email}" style="color: #E8A317;">${email}</a></td></tr>
                <tr><td style="padding: 8px 0; color: #8b89a0;">Service</td><td style="color: #e8e6f0;">${service || 'Not specified'}</td></tr>
              </table>
              <div style="margin-top: 20px; padding: 16px; background: rgba(255,255,255,0.03); border-radius: 12px; border: 1px solid rgba(255,255,255,0.06);">
                <p style="color: #8b89a0; margin: 0 0 8px 0; font-size: 12px;">MESSAGE</p>
                <p style="color: #e8e6f0; margin: 0; line-height: 1.6; white-space: pre-wrap;">${message}</p>
              </div>
              <div style="margin-top: 20px; text-align: center;">
                <a href="mailto:${email}" style="display: inline-block; background: #E8A317; color: #0A0A0F; padding: 12px 28px; border-radius: 8px; font-weight: 700; font-size: 14px; text-decoration: none;">Reply to ${name.split(' ')[0]}</a>
              </div>
            </div>
          `,
        })

        // Auto-reply to the sender
        await transporter.sendMail({
          from: `"Bhavya from AnantaSutra" <${process.env.SMTP_EMAIL}>`,
          to: email,
          subject: `Got your message, ${name.split(' ')[0]} — AnantaSutra`,
          html: `
            <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0A0F; color: #e8e6f0; padding: 32px; border-radius: 16px;">
              <div style="border-bottom: 1px solid rgba(232,163,23,0.3); padding-bottom: 20px; margin-bottom: 24px;">
                <h1 style="color: #E8A317; font-size: 22px; margin: 0;">Hi ${name.split(' ')[0]}, message received</h1>
              </div>
              <p style="color: #e8e6f0; line-height: 1.7; font-size: 15px;">
                Thanks for reaching out about <strong>${service || 'our services'}</strong>. I've personally seen your message and will get back to you within 24 hours with a thoughtful response.
              </p>
              <p style="color: #e8e6f0; line-height: 1.7; font-size: 15px; margin-top: 16px;">
                While you wait, here's something relevant:
              </p>
              <div style="margin: 16px 0;">
                <a href="https://anantasutra.com/services/ai-automation" style="color: #E8A317; font-size: 14px; display: block; padding: 4px 0;">AI Automation & Intelligence</a>
                <a href="https://anantasutra.com/services/marketing" style="color: #E8A317; font-size: 14px; display: block; padding: 4px 0;">Creative & Marketing Agency</a>
                <a href="https://ritualist.anantasutra.com" style="color: #E8A317; font-size: 14px; display: block; padding: 4px 0;">Ritualist App</a>
              </div>
              <p style="color: #8b89a0; line-height: 1.7; font-size: 13px; margin-top: 16px;">
                Need a faster response? WhatsApp us for quick coordination.
              </p>
              <div style="margin-top: 32px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 20px;">
                <p style="color: #e8e6f0; font-size: 14px; margin: 0;">
                  Talk soon,<br/>
                  <strong style="color: #E8A317;">Bhavya Duneja</strong><br/>
                  <span style="color: #8b89a0; font-size: 12px;">Co-Founder, AnantaSutra | anantasutra.com</span>
                </p>
              </div>
            </div>
          `,
        })

        emailSent = true
      } catch (emailErr) {
        console.error('Email sending failed (SMTP):', emailErr)
      }
    } else {
      console.warn('SMTP not configured — skipping email. Set SMTP_EMAIL and SMTP_PASSWORD in .env.local')
    }

    if (!dbSaved && !emailSent) {
      return NextResponse.json(
        { success: false, error: 'Failed to process your message. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: dbSaved
        ? (emailSent ? 'Message saved and email sent' : 'Message saved successfully')
        : 'Email sent successfully',
    })
  } catch (error) {
    console.error('Email sending failed:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send email',
      },
      { status: 500 }
    )
  }
}

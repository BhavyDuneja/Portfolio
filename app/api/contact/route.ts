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
          subject: `New Inquiry: ${service || 'General'} — from ${name}`,
          html: `
            <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0A0F; color: #e8e6f0; padding: 32px; border-radius: 16px;">
              <div style="border-bottom: 1px solid rgba(232,163,23,0.3); padding-bottom: 20px; margin-bottom: 24px;">
                <h1 style="color: #E8A317; font-size: 24px; margin: 0;">AnantaSutra — New Inquiry</h1>
              </div>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #8b89a0; width: 120px;">Name</td>
                  <td style="padding: 8px 0; color: #e8e6f0; font-weight: 600;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #8b89a0;">Email</td>
                  <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #E8A317;">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #8b89a0;">Service</td>
                  <td style="padding: 8px 0; color: #e8e6f0;">${service || 'Not specified'}</td>
                </tr>
              </table>
              <div style="margin-top: 24px; padding: 20px; background: rgba(255,255,255,0.03); border-radius: 12px; border: 1px solid rgba(255,255,255,0.06);">
                <p style="color: #8b89a0; margin: 0 0 8px 0; font-size: 13px;">Message</p>
                <p style="color: #e8e6f0; margin: 0; line-height: 1.6; white-space: pre-wrap;">${message}</p>
              </div>
              <p style="color: #8b89a0; font-size: 12px; margin-top: 24px;">
                Sent from anantasutra.com contact form${dbSaved ? ' (saved to database)' : ''}
              </p>
            </div>
          `,
        })

        // Auto-reply to the sender
        await transporter.sendMail({
          from: `"AnantaSutra" <${process.env.SMTP_EMAIL}>`,
          to: email,
          subject: `Thank you for reaching out, ${name}! — AnantaSutra`,
          html: `
            <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0A0F; color: #e8e6f0; padding: 32px; border-radius: 16px;">
              <div style="border-bottom: 1px solid rgba(232,163,23,0.3); padding-bottom: 20px; margin-bottom: 24px;">
                <h1 style="color: #E8A317; font-size: 24px; margin: 0;">Namaste, ${name}!</h1>
              </div>
              <p style="color: #e8e6f0; line-height: 1.8; font-size: 15px;">
                Thank you for reaching out to <strong>AnantaSutra</strong>. We have received your message regarding
                <strong>${service || 'our services'}</strong> and will get back to you within 24 hours.
              </p>
              <p style="color: #8b89a0; line-height: 1.8; font-size: 14px; margin-top: 16px;">
                In the meantime, feel free to explore our offerings:
              </p>
              <ul style="color: #8b89a0; font-size: 14px; line-height: 2;">
                <li><a href="https://anantasutra.com/services/ai-automation" style="color: #E8A317;">AI Automation & Intelligence</a></li>
                <li><a href="https://anantasutra.com/services/marketing" style="color: #E8A317;">Creative & Marketing Agency</a></li>
                <li><a href="https://ritualist.anantasutra.com" style="color: #E8A317;">Ritualist App</a></li>
                <li><a href="https://anantasutra.com/apps" style="color: #E8A317;">Granthas — Hindu Scriptures</a></li>
              </ul>
              <p style="color: #e8e6f0; font-size: 15px; margin-top: 20px;">
                Warm regards,<br/>
                <strong style="color: #E8A317;">Team AnantaSutra</strong><br/>
                <span style="color: #8b89a0; font-size: 13px;">Infinite Wisdom, Applied</span>
              </p>
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

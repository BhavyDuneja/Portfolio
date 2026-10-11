import { randomUUID } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { supabase } from '@/lib/supabase'
import { createZohoLead } from '@/lib/zoho'
import { checkContactCode, parseContactFields, type CodeCheck } from '@/lib/contactVerification'

// What the visitor sees when the code doesn't check out
const CODE_ERRORS: Record<Exclude<CodeCheck, 'ok'>, { error: string; status: number }> = {
  invalid: { error: 'That code is incorrect. Please check it and try again.', status: 400 },
  expired: { error: 'This code has expired. Please request a new one.', status: 400 },
  used: { error: 'This code was already used. Please request a new one.', status: 400 },
  mismatch: { error: 'Your details changed after the code was sent. Please request a new code.', status: 400 },
  'too-many-attempts': { error: 'Too many incorrect attempts. Please request a new code.', status: 429 },
}

// Visitor input goes into HTML emails — escape it so nobody can inject markup or links into our inbox
const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string)

// Step 2 of the contact form: register the lead once the emailed code is confirmed
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Honeypot: the hidden "website" field is invisible to people, so only bots fill it
    if (typeof body.website === 'string' && body.website.trim()) {
      return NextResponse.json({ success: false, error: 'Could not process your request.' }, { status: 400 })
    }

    const parsed = parseContactFields(body)
    if ('error' in parsed) {
      return NextResponse.json({ success: false, error: parsed.error }, { status: 400 })
    }
    const { name, email, phone, company, service, budget, timeline, message } = parsed.fields

    // Only senders who proved they own the email address get registered
    if (!body.token) {
      return NextResponse.json(
        { success: false, error: 'Please verify your email address first.', reason: 'unverified' },
        { status: 400 }
      )
    }
    const check = checkContactCode(body.token, body.code, parsed.fields)
    if (check !== 'ok') {
      const { error, status } = CODE_ERRORS[check]
      return NextResponse.json({ success: false, error, reason: check }, { status })
    }

    // Save to Supabase first — even if email fails, we have the data.
    // The id is generated here so the insert never needs to read the row back.
    const rowId = randomUUID()
    let dbSaved = false
    try {
      let result = await supabase
        .from('contact_submissions')
        .insert({ id: rowId, name, email, phone, company, service, budget, timeline, message, status: 'new' })

      // The extra columns only exist once the migration has run — fall back to the
      // original shape so a lead is never lost in the meantime
      if (result.error) {
        result = await supabase
          .from('contact_submissions')
          .insert({ id: rowId, name, email, service, message, status: 'new' })
      }

      if (result.error) {
        console.error('Failed to save contact submission to DB:', result.error)
      } else {
        dbSaved = true
      }
    } catch (dbErr) {
      console.error('DB insert threw an error:', dbErr)
    }

    // Push the lead into Zoho CRM — a no-op until ZOHO_* env vars are set, and never blocks the form
    const zohoLeadId = await createZohoLead({ name, email, phone, company, service, budget, timeline, message })
    if (zohoLeadId && dbSaved) {
      const { error: linkError } = await supabase
        .from('contact_submissions')
        .update({ zoho_lead_id: zohoLeadId })
        .eq('id', rowId)
      if (linkError) console.warn('Lead created in Zoho but zoho_lead_id not stored:', linkError.message)
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
        const firstName = esc(name.split(' ')[0])

        // Email to AnantaSutra team
        await transporter.sendMail({
          from: `"AnantaSutra Website" <${process.env.SMTP_EMAIL}>`,
          to: 'co-founder@anantasutra.com',
          replyTo: email,
          subject: `New Lead: ${name} — ${service || 'General'}`,
          html: `
            <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0A0F; color: #e8e6f0; padding: 32px; border-radius: 16px;">
              <div style="border-bottom: 1px solid rgba(232,163,23,0.3); padding-bottom: 20px; margin-bottom: 24px;">
                <h1 style="color: #E8A317; font-size: 22px; margin: 0;">New Inquiry from ${esc(name)}</h1>
                <p style="color: #8b89a0; margin: 8px 0 0; font-size: 13px;">${esc(service || 'General')} | Email verified ${dbSaved ? '| Saved to DB' : '| DB save failed'}${zohoLeadId ? ' | Synced to Zoho CRM' : ''}</p>
              </div>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; color: #8b89a0; width: 100px;">Name</td><td style="color: #e8e6f0; font-weight: 600;">${esc(name)}</td></tr>
                <tr><td style="padding: 8px 0; color: #8b89a0;">Email</td><td><a href="mailto:${esc(email)}" style="color: #E8A317;">${esc(email)}</a></td></tr>
                <tr><td style="padding: 8px 0; color: #8b89a0;">Service</td><td style="color: #e8e6f0;">${esc(service || 'Not specified')}</td></tr>
                <tr><td style="padding: 8px 0; color: #8b89a0;">Company</td><td style="color: #e8e6f0;">${esc(company || 'Not provided')}</td></tr>
                <tr><td style="padding: 8px 0; color: #8b89a0;">Phone</td><td style="color: #e8e6f0;">${esc(phone || 'Not provided')}</td></tr>
                <tr><td style="padding: 8px 0; color: #8b89a0;">Budget</td><td style="color: #e8e6f0;">${esc(budget || 'Not specified')}</td></tr>
                <tr><td style="padding: 8px 0; color: #8b89a0;">Timeline</td><td style="color: #e8e6f0;">${esc(timeline || 'Not specified')}</td></tr>
              </table>
              <div style="margin-top: 20px; padding: 16px; background: rgba(255,255,255,0.03); border-radius: 12px; border: 1px solid rgba(255,255,255,0.06);">
                <p style="color: #8b89a0; margin: 0 0 8px 0; font-size: 12px;">MESSAGE</p>
                <p style="color: #e8e6f0; margin: 0; line-height: 1.6; white-space: pre-wrap;">${esc(message)}</p>
              </div>
              <div style="margin-top: 20px; text-align: center;">
                <a href="mailto:${esc(email)}" style="display: inline-block; background: #E8A317; color: #0A0A0F; padding: 12px 28px; border-radius: 8px; font-weight: 700; font-size: 14px; text-decoration: none;">Reply to ${firstName}</a>
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
                <h1 style="color: #E8A317; font-size: 22px; margin: 0;">Hi ${firstName}, message received</h1>
              </div>
              <p style="color: #e8e6f0; line-height: 1.7; font-size: 15px;">
                Thanks for reaching out about <strong>${esc(service || 'our services')}</strong>. I've personally seen your message and will get back to you within 24 hours with a thoughtful response.
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

    if (!dbSaved && !emailSent && !zohoLeadId) {
      return NextResponse.json(
        { success: false, error: 'Failed to process your message. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: dbSaved
        ? (emailSent ? 'Message saved and email sent' : 'Message saved successfully')
        : emailSent ? 'Email sent successfully' : 'Lead sent to CRM',
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

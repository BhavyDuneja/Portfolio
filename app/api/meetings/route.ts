import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, date, time, timezone, service_interest, parent_meeting_id } = await req.json()

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
          parent_meeting_id: parent_meeting_id || null,
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

        // Detect agenda type from service_interest
        const si = (service_interest || '').toLowerCase()
        const isFollowUp = parent_meeting_id || si.includes('meeting #')
        const agendaRaw = si.replace(/meeting #\d+:\s*/i, '').trim()

        // Agenda-specific content
        const agendaTemplates: Record<string, { subject: string; heading: string; body: string; whatToBring: string }> = {
          'requirement understanding': {
            subject: `Discovery Call Confirmed — ${date}, ${time}`,
            heading: `Your Discovery Call is Confirmed 🗓️`,
            body: `I'll personally walk you through how businesses like yours are solving growth challenges — and where the biggest untapped opportunities are. Every week we delay strategy, competitors gain ground.`,
            whatToBring: `<li>A quick overview of your business and who you serve</li><li>Your current website or marketing setup (if any)</li><li>The 2-3 biggest challenges holding back growth</li>`,
          },
          'proposal discussion': {
            subject: `Your Custom Proposal is Ready — ${date}`,
            heading: `Your Tailored Proposal is Ready 📋`,
            body: `I've built a <strong>custom proposal</strong> based on our last conversation. We'll walk through recommended approach, timelines, and expected outcomes together. The longer strategy sits on paper, the longer revenue stays on the table.`,
            whatToBring: `<li>Questions or thoughts from our last conversation</li><li>Key decision-makers who should review the proposal</li><li>Your priority features and must-haves</li>`,
          },
          'budget & pricing': {
            subject: `Pricing Discussion Confirmed — ${date}`,
            heading: `Pricing & Packages Walkthrough Confirmed`,
            body: `We'll go through <strong>pricing, packages, and flexible payment terms</strong> to find the right fit. We work with businesses of all sizes — the goal is ROI, not just cost. Every month without the right system costs more than the system itself.`,
            whatToBring: `<li>Your budget range or investment expectations</li><li>Any other proposals you're comparing</li><li>Questions about payment milestones or ROI timelines</li>`,
          },
          'technical deep-dive': {
            subject: `Technical Deep-Dive Confirmed — ${date}`,
            heading: `Technical Deep-Dive Confirmed`,
            body: `This is a <strong>hands-on technical session</strong> — we'll cover architecture, integrations, and implementation specifics. I'll have our tech lead joining to answer everything. Unresolved technical questions are the #1 reason projects stall.`,
            whatToBring: `<li>Technical requirements or specifications document</li><li>Details of your current tech stack and integrations</li><li>Your CTO or technical lead (if available)</li>`,
          },
          'onboarding': {
            subject: `Welcome to AnantaSutra — Onboarding ${date}`,
            heading: `Welcome Aboard — Let's Get Started`,
            body: `Thrilled to officially kick things off. This <strong>onboarding session</strong> covers project setup, communication channels, timelines, and introductions to your dedicated team. The sooner we align, the sooner you see results.`,
            whatToBring: `<li>Brand assets (logo, colours, fonts, guidelines)</li><li>Access credentials for relevant accounts (social, hosting, analytics)</li><li>Reference materials or inspiration you'd like to share</li>`,
          },
          'review & feedback': {
            subject: `Progress Review Confirmed — ${date}`,
            heading: `Progress Review Confirmed`,
            body: `Time for a <strong>progress check-in</strong>. I'll walk you through what's been delivered, share results so far, and gather your feedback to fine-tune the next phase. Quick feedback loops keep us weeks ahead of schedule.`,
            whatToBring: `<li>Your feedback on deliverables shared so far</li><li>Any changes or additions you'd like to discuss</li><li>Questions about next milestones or timelines</li>`,
          },
          'contract signing': {
            subject: `Contract Discussion — ${date}, ${time}`,
            heading: `Contract Discussion Confirmed`,
            body: `We'll review <strong>contract terms, scope of work, and engagement details</strong> together. Once everything looks good, we sign and kick off immediately. Every day between agreement and signature is a day of lost momentum.`,
            whatToBring: `<li>Questions about terms, conditions, or scope</li><li>Preferred payment method and billing details</li><li>Authorised signatory (if different from you)</li>`,
          },
        }

        // Match template or use default
        const template = agendaTemplates[agendaRaw] || (isFollowUp ? {
          subject: `Follow-up Confirmed — ${agendaRaw || 'AnantaSutra'}, ${date}`,
          heading: `Follow-up Call Confirmed 🗓️`,
          body: `Our <strong>follow-up session</strong> on <strong>${agendaRaw || 'your project'}</strong> is locked in. I've prepared specific notes from our last conversation so we can pick up right where we left off.`,
          whatToBring: `<li>Notes or questions from our previous discussion</li><li>Any updates or new requirements since last time</li>`,
        } : {
          subject: `AnantaSutra + You — ${date}, ${time} Confirmed`,
          heading: `You're Confirmed, ${name} ✅`,
          body: `Your <strong>complimentary strategy session</strong> with AnantaSutra is confirmed. I'll personally understand your business and show you exactly where the biggest growth opportunities are. Most clients say this one conversation changed their entire approach.`,
          whatToBring: `<li>A brief overview of your business and audience</li><li>Your top 2-3 goals or pain points</li><li>Any existing website or marketing materials</li>`,
        })

        // Email to AnantaSutra team
        await transporter.sendMail({
          from: `"AnantaSutra" <${process.env.SMTP_EMAIL}>`,
          to: 'co-founder@anantasutra.com',
          subject: `🗓️ ${isFollowUp ? 'Follow-up' : 'New'}: ${name} — ${agendaRaw || service_interest || 'Discovery Call'} (${date})`,
          html: `
            <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0A0F; color: #e8e6f0; padding: 32px; border-radius: 16px;">
              <div style="border-bottom: 1px solid rgba(232,163,23,0.3); padding-bottom: 20px; margin-bottom: 24px;">
                <h1 style="color: #E8A317; font-size: 22px; margin: 0;">${isFollowUp ? 'Follow-up' : 'New'} — ${agendaRaw || 'Discovery Call'}</h1>
                <p style="color: #8b89a0; margin: 8px 0 0; font-size: 13px;">${date} at ${time} (${timezone || 'Asia/Kolkata'})</p>
              </div>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; color: #8b89a0; width: 100px;">Client</td><td style="color: #e8e6f0; font-weight: 600;">${name}</td></tr>
                <tr><td style="padding: 8px 0; color: #8b89a0;">Email</td><td><a href="mailto:${email}" style="color: #E8A317;">${email}</a></td></tr>
                <tr><td style="padding: 8px 0; color: #8b89a0;">Phone</td><td style="color: #e8e6f0;">${phone || 'Not provided'}</td></tr>
                <tr><td style="padding: 8px 0; color: #8b89a0;">Agenda</td><td style="color: #E8A317; font-weight: 600;">${agendaRaw || service_interest || 'Discovery Call'}</td></tr>
              </table>
              <div style="margin-top: 24px; text-align: center;">
                <a href="https://meet.google.com/riu-uofk-tsi" style="display: inline-block; background: #E8A317; color: #0A0A0F; padding: 14px 32px; border-radius: 8px; font-weight: 700; font-size: 15px; text-decoration: none;">Join Meeting</a>
              </div>
            </div>
          `,
        })

        // Personalized email to the visitor
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
                Hi ${name},<br/><br/>${template.body}
              </p>
              <div style="margin: 24px 0; padding: 20px; background: rgba(232,163,23,0.06); border-radius: 12px; border: 1px solid rgba(232,163,23,0.15);">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr><td style="padding: 6px 0; color: #8b89a0; width: 80px;">Date</td><td style="color: #E8A317; font-weight: 700; font-size: 16px;">${date}</td></tr>
                  <tr><td style="padding: 6px 0; color: #8b89a0;">Time</td><td style="color: #E8A317; font-weight: 700; font-size: 16px;">${time} (${timezone || 'IST'})</td></tr>
                  <tr><td style="padding: 6px 0; color: #8b89a0;">Agenda</td><td style="color: #e8e6f0; font-weight: 600;">${agendaRaw || service_interest || 'Strategy Session'}</td></tr>
                </table>
              </div>
              <div style="margin: 20px 0; text-align: center;">
                <a href="https://meet.google.com/riu-uofk-tsi" style="display: inline-block; background: #E8A317; color: #0A0A0F; padding: 14px 36px; border-radius: 8px; font-weight: 700; font-size: 16px; text-decoration: none;">Join Meeting</a>
              </div>
              <div style="margin: 20px 0; padding: 16px; background: rgba(106,61,232,0.06); border-radius: 12px; border: 1px solid rgba(106,61,232,0.15);">
                <p style="color: #6A3DE8; margin: 0 0 8px; font-size: 13px; font-weight: 600;">What to prepare:</p>
                <ul style="color: #e8e6f0; font-size: 13px; line-height: 2; margin: 0; padding-left: 20px;">
                  ${template.whatToBring}
                </ul>
              </div>
              <p style="color: #8b89a0; line-height: 1.7; font-size: 13px; margin-top: 16px;">
                <a href="mailto:contact@anantasutra.com" style="color: #E8A317;">Need to reschedule? No problem at all</a> — reply to this email or WhatsApp us for quick coordination.
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

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
            subject: `Discovery Call Confirmed — Let's Understand Your Vision`,
            heading: `Let's Get to Know Your Business! 🚀`,
            body: `This is our <strong>discovery call</strong> — we'll understand your business, goals, and challenges to figure out the best way AnantaSutra can help you grow.`,
            whatToBring: `<li>A brief overview of your business and target audience</li><li>Any existing website, social media, or marketing materials</li><li>Your top 2-3 goals or pain points you'd like to address</li>`,
          },
          'proposal discussion': {
            subject: `Proposal Walkthrough Scheduled — AnantaSutra`,
            heading: `Time to Review Your Custom Proposal! 📋`,
            body: `Based on our previous conversation, we've put together a <strong>tailored proposal</strong> for you. In this call, we'll walk you through our recommended approach, timeline, and deliverables.`,
            whatToBring: `<li>Any questions or feedback from our last conversation</li><li>Key decision-makers who should be on the call</li><li>Your priority areas and must-have features</li>`,
          },
          'budget & pricing': {
            subject: `Budget Discussion Scheduled — AnantaSutra`,
            heading: `Let's Talk Numbers! 💰`,
            body: `In this session, we'll go over <strong>pricing, packages, and payment terms</strong> in detail. We'll find the right fit for your budget — we work with businesses of all sizes and always have flexible options.`,
            whatToBring: `<li>Your budget range or expectations</li><li>Any competing quotes you'd like us to match or beat</li><li>Questions about payment terms, milestones, or ROI expectations</li>`,
          },
          'technical deep-dive': {
            subject: `Technical Deep-Dive Scheduled — AnantaSutra`,
            heading: `Going Under the Hood! ⚙️`,
            body: `This is a <strong>technical session</strong> where we'll dive into architecture, integrations, and implementation details. Our tech team will be joining to answer all your technical questions.`,
            whatToBring: `<li>Technical requirements or specifications document</li><li>Details of your current tech stack and integrations</li><li>Your CTO or technical lead (if applicable)</li>`,
          },
          'onboarding': {
            subject: `Onboarding Session Scheduled — Welcome to AnantaSutra! 🎉`,
            heading: `Welcome Aboard! 🎉`,
            body: `We're thrilled to officially start working together! This <strong>onboarding session</strong> will cover project setup, communication channels, timelines, and your dedicated team introductions.`,
            whatToBring: `<li>Brand assets (logo, colors, fonts, guidelines)</li><li>Access credentials to relevant accounts (social media, hosting, analytics)</li><li>Any reference materials or inspiration you'd like to share</li>`,
          },
          'review & feedback': {
            subject: `Review Session Scheduled — AnantaSutra`,
            heading: `Let's Review Progress Together! 🔍`,
            body: `Time for a <strong>progress review</strong>! We'll walk you through what's been completed, share results so far, and gather your feedback to fine-tune the next phase.`,
            whatToBring: `<li>Your feedback on deliverables shared so far</li><li>Any changes or additions you'd like to discuss</li><li>Questions about next steps or upcoming milestones</li>`,
          },
          'contract signing': {
            subject: `Contract Discussion Scheduled — Let's Make It Official! ✍️`,
            heading: `Let's Make It Official! ✍️`,
            body: `In this session, we'll go over the <strong>contract terms, scope of work, and engagement details</strong>. Once everything looks good, we'll get you signed up and kick things off!`,
            whatToBring: `<li>Any questions about terms and conditions</li><li>Preferred payment method and billing details</li><li>Authorized signatory (if different from you)</li>`,
          },
        }

        // Match template or use default
        const template = agendaTemplates[agendaRaw] || (isFollowUp ? {
          subject: `Follow-up Meeting Confirmed — ${agendaRaw || 'AnantaSutra'}`,
          heading: `Follow-up Call Scheduled! 📞`,
          body: `We have a <strong>follow-up session</strong> scheduled to continue our conversation about <strong>${agendaRaw || 'your project'}</strong>.`,
          whatToBring: `<li>Notes or questions from our previous discussion</li><li>Any updates or new requirements since our last call</li>`,
        } : {
          subject: `Your FREE Consultation is Confirmed — AnantaSutra`,
          heading: `You're All Set, ${name}! 🎉`,
          body: `Your <strong>FREE consultation</strong> with AnantaSutra has been confirmed. We'll understand your needs and explore how we can help your business grow.`,
          whatToBring: `<li>A brief overview of your business</li><li>Your top goals or challenges</li><li>Any existing website or marketing materials to share</li>`,
        })

        // Email to AnantaSutra team
        await transporter.sendMail({
          from: `"AnantaSutra" <${process.env.SMTP_EMAIL}>`,
          to: 'co-founder@anantasutra.com',
          subject: `🗓️ ${isFollowUp ? 'Follow-up' : 'New'} Meeting: ${name} — ${agendaRaw || service_interest || 'Discovery Call'}`,
          html: `
            <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0A0F; color: #e8e6f0; padding: 32px; border-radius: 16px;">
              <div style="border-bottom: 1px solid rgba(232,163,23,0.3); padding-bottom: 20px; margin-bottom: 24px;">
                <h1 style="color: #E8A317; font-size: 22px; margin: 0;">${isFollowUp ? 'Follow-up' : 'New'} Meeting: ${agendaRaw || 'Discovery Call'}</h1>
              </div>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 10px 0; color: #8b89a0; width: 140px;">Client</td><td style="color: #e8e6f0; font-weight: 600;">${name}</td></tr>
                <tr><td style="padding: 10px 0; color: #8b89a0;">Email</td><td><a href="mailto:${email}" style="color: #E8A317;">${email}</a></td></tr>
                <tr><td style="padding: 10px 0; color: #8b89a0;">Phone</td><td style="color: #e8e6f0;">${phone || 'Not provided'}</td></tr>
                <tr><td style="padding: 10px 0; color: #8b89a0;">Date</td><td style="color: #e8e6f0; font-weight: 600;">${date}</td></tr>
                <tr><td style="padding: 10px 0; color: #8b89a0;">Time</td><td style="color: #e8e6f0; font-weight: 600;">${time} (${timezone || 'Asia/Kolkata'})</td></tr>
                <tr><td style="padding: 10px 0; color: #8b89a0;">Agenda</td><td style="color: #E8A317; font-weight: 600;">${agendaRaw || service_interest || 'Discovery Call'}</td></tr>
              </table>
              <div style="margin-top: 24px; padding: 16px; background: rgba(232,163,23,0.08); border-radius: 12px; border: 1px solid rgba(232,163,23,0.2);">
                <p style="color: #E8A317; margin: 0; font-size: 14px; font-weight: 600;">Meeting Link</p>
                <p style="color: #e8e6f0; margin: 8px 0 0; font-size: 13px;"><a href="https://meet.google.com/riu-uofk-tsi" style="color: #E8A317; font-weight: 600;">https://meet.google.com/riu-uofk-tsi</a></p>
              </div>
            </div>
          `,
        })

        // Personalized email to the visitor
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
                Hi <strong>${name}</strong>, ${template.body}
              </p>
              <div style="margin: 24px 0; padding: 20px; background: rgba(232,163,23,0.06); border-radius: 12px; border: 1px solid rgba(232,163,23,0.15);">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr><td style="padding: 6px 0; color: #8b89a0; width: 80px;">Date</td><td style="color: #E8A317; font-weight: 700; font-size: 16px;">${date}</td></tr>
                  <tr><td style="padding: 6px 0; color: #8b89a0;">Time</td><td style="color: #E8A317; font-weight: 700; font-size: 16px;">${time}</td></tr>
                  <tr><td style="padding: 6px 0; color: #8b89a0;">Agenda</td><td style="color: #e8e6f0; font-weight: 600;">${agendaRaw || service_interest || 'General Consultation'}</td></tr>
                </table>
              </div>
              <div style="margin: 20px 0; padding: 16px; background: rgba(232,163,23,0.08); border-radius: 12px; border: 1px solid rgba(232,163,23,0.2); text-align: center;">
                <p style="color: #8b89a0; margin: 0 0 8px; font-size: 12px;">JOIN VIA GOOGLE MEET</p>
                <a href="https://meet.google.com/riu-uofk-tsi" style="color: #E8A317; font-size: 18px; font-weight: 700; text-decoration: none;">meet.google.com/riu-uofk-tsi</a>
              </div>
              <div style="margin: 20px 0; padding: 16px; background: rgba(106,61,232,0.06); border-radius: 12px; border: 1px solid rgba(106,61,232,0.15);">
                <p style="color: #6A3DE8; margin: 0 0 8px; font-size: 13px; font-weight: 600;">📝 What to prepare for this call:</p>
                <ul style="color: #e8e6f0; font-size: 13px; line-height: 2; margin: 0; padding-left: 20px;">
                  ${template.whatToBring}
                </ul>
              </div>
              <p style="color: #8b89a0; line-height: 1.8; font-size: 13px; margin-top: 16px;">
                Need to reschedule? Just reply to this email or reach us at <a href="mailto:contact@anantasutra.com" style="color: #E8A317;">contact@anantasutra.com</a>
              </p>
              <div style="margin-top: 32px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 20px;">
                <p style="color: #e8e6f0; font-size: 14px; margin: 0;">
                  Looking forward to speaking with you!<br/>
                  <strong style="color: #E8A317;">Bhavya Duneja & Team AnantaSutra</strong><br/>
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

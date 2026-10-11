import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import {
  allowRequest,
  clientIp,
  CODE_TTL_MS,
  createContactCode,
  parseContactFields,
} from '@/lib/contactVerification'

// Step 1 of the contact form: email a 6-digit code so the sender proves they own the address
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
    const { fields } = parsed

    if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
      console.error('Contact verification unavailable — set SMTP_EMAIL and SMTP_PASSWORD')
      return NextResponse.json(
        {
          success: false,
          error: 'Email verification is temporarily unavailable. Please email us at contact@anantasutra.com.',
        },
        { status: 503 }
      )
    }

    // Stops the form being used to flood someone's inbox with codes
    const ip = clientIp(request.headers)
    if (!allowRequest(`email:${fields.email}`, 3, 15 * 60 * 1000) || !allowRequest(`ip:${ip}`, 10, 60 * 60 * 1000)) {
      return NextResponse.json(
        { success: false, error: 'Too many code requests. Please wait a few minutes and try again.' },
        { status: 429 }
      )
    }

    const { code, token } = createContactCode(fields)

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    })

    // Deliberately contains nothing the visitor typed — the address isn't verified yet
    await transporter.sendMail({
      from: `"AnantaSutra" <${process.env.SMTP_EMAIL}>`,
      to: fields.email,
      subject: `${code} is your AnantaSutra verification code`,
      text: `Your AnantaSutra verification code is ${code}. It expires in 10 minutes. If you didn't request it, you can ignore this email.`,
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0A0F; color: #e8e6f0; padding: 32px; border-radius: 16px;">
          <h1 style="color: #E8A317; font-size: 22px; margin: 0 0 16px;">Verify your email</h1>
          <p style="color: #e8e6f0; line-height: 1.7; font-size: 15px; margin: 0;">Use this code to send your message to AnantaSutra:</p>
          <p style="color: #E8A317; font-size: 36px; font-weight: 700; letter-spacing: 10px; text-align: center; margin: 24px 0;">${code}</p>
          <p style="color: #8b89a0; line-height: 1.7; font-size: 13px; margin: 0;">The code expires in 10 minutes. If you didn't request it, you can safely ignore this email.</p>
        </div>
      `,
    })

    return NextResponse.json({ success: true, token, expiresIn: CODE_TTL_MS / 1000 })
  } catch (error) {
    console.error('Sending contact verification code failed:', error)
    return NextResponse.json(
      { success: false, error: 'Could not send the verification code. Please check your email address and try again.' },
      { status: 500 }
    )
  }
}

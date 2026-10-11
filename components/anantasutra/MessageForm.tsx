'use client'

import { useEffect, useState } from 'react'
import { AlertCircle, CheckCircle, Mail, Send } from 'lucide-react'
import { event as gtagEvent } from '@/lib/gtag'

const inputClass =
  'w-full px-4 py-3 rounded-xl bg-dark-400/50 border border-white/10 text-white placeholder-gray-600 focus:border-saffron-500/50 focus:ring-1 focus:ring-saffron-500/20 focus:outline-none transition-all'

const emptyForm = { name: '', email: '', phone: '', company: '', service: '', message: '' }
type FormField = keyof typeof emptyForm

// Server reasons where the current code can't be retried, so "Resend code" unlocks immediately
const NEEDS_NEW_CODE = ['expired', 'used', 'too-many-attempts']

/**
 * "Send us a message" form. The visitor confirms their email with a 6-digit code
 * before the message is registered, so random or fake submissions never reach us.
 */
export default function MessageForm({ services }: { services: string[] }) {
  const [formData, setFormData] = useState(emptyForm)
  const [honeypot, setHoneypot] = useState('')
  const [token, setToken] = useState<string | null>(null)
  const [code, setCode] = useState('')
  const [resendIn, setResendIn] = useState(0)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    if (resendIn <= 0) return
    const timer = setTimeout(() => setResendIn((s) => s - 1), 1000)
    return () => clearTimeout(timer)
  }, [resendIn])

  const update =
    (field: FormField) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setFormData((prev) => ({ ...prev, [field]: e.target.value }))

  const post = async (url: string, payload: object) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await response.json().catch(() => ({}))
    return { ok: response.ok && data.success === true, data, status: response.status }
  }

  const requestCode = async () => {
    setBusy(true)
    setError(null)
    try {
      const { ok, data } = await post('/api/contact/send-code', { ...formData, website: honeypot })
      if (ok) {
        setToken(data.token)
        setCode('')
        setResendIn(30)
      } else {
        setError(data.error || 'Could not send the verification code. Please try again.')
      }
    } catch {
      setError('Network error. Please check your connection and try again.')
    }
    setBusy(false)
  }

  const verifyAndSend = async () => {
    setBusy(true)
    setError(null)
    try {
      const { ok, data, status } = await post('/api/contact', { ...formData, website: honeypot, token, code })
      if (ok) {
        gtagEvent('contact_form_submit', {
          service: formData.service,
        })
        // GA4 recommended lead event; mark it as a key event in GA4 to count leads.
        gtagEvent('generate_lead', {
          lead_source: 'contact_form',
          service: formData.service || 'Not specified',
        })
        setSent(true)
        setFormData(emptyForm)
        setToken(null)
        setCode('')
        setTimeout(() => setSent(false), 5000)
      } else {
        setError(data.error || 'Something went wrong. Please try again or email us directly.')
        if (NEEDS_NEW_CODE.includes(data.reason)) setResendIn(0)
        if (data.reason === 'mismatch' || data.reason === 'unverified') setToken(null)
        gtagEvent('contact_form_error', {
          error_type: data.reason || 'server_error',
          status,
        })
      }
    } catch {
      setError('Network error. Please check your connection and try again.')
      gtagEvent('contact_form_error', {
        error_type: 'network_error',
      })
    }
    setBusy(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (token) verifyAndSend()
    else requestCode()
  }

  const editDetails = () => {
    setToken(null)
    setCode('')
    setError(null)
  }

  const buttonLabel = token
    ? busy ? 'Verifying...' : 'Verify & Send Message'
    : busy ? 'Sending code...' : 'Send Verification Code'

  return (
    <div className="glass-card rounded-2xl p-8">
      <h2 className="font-display text-2xl font-bold text-white mb-6">Send us a message</h2>

      {sent ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Message Sent</h3>
          <p className="text-gray-300">We&apos;ll get back to you within 24 hours.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {token ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3 rounded-xl border border-saffron-500/20 bg-saffron-500/10 p-4">
                <Mail className="w-5 h-5 text-saffron-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-200">
                  We sent a 6-digit code to <span className="font-semibold text-white">{formData.email}</span>.
                  Enter it below to send your message.
                </p>
              </div>

              <div>
                <label htmlFor="contact-code" className="block text-sm text-gray-400 mb-1.5">
                  Verification code
                </label>
                <input
                  id="contact-code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  required
                  autoFocus
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className={`${inputClass} text-center text-2xl font-semibold tracking-[0.5em]`}
                  placeholder="000000"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <button
                  type="button"
                  onClick={requestCode}
                  disabled={busy || resendIn > 0}
                  className="text-saffron-400 hover:text-saffron-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                >
                  {resendIn > 0 ? `Resend code in ${resendIn}s` : 'Resend code'}
                </button>
                <button
                  type="button"
                  onClick={editDetails}
                  disabled={busy}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Edit details
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Name</label>
                  <input
                    type="text"
                    name="name"
                    autoComplete="name"
                    value={formData.name}
                    onChange={update('name')}
                    required
                    className={inputClass}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Email</label>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={update('email')}
                    required
                    className={inputClass}
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Phone / WhatsApp (optional)</label>
                  <input
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={update('phone')}
                    className={inputClass}
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Company (optional)</label>
                  <input
                    type="text"
                    name="company"
                    autoComplete="organization"
                    value={formData.company}
                    onChange={update('company')}
                    className={inputClass}
                    placeholder="Your company"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Service Interested In</label>
                <select
                  name="service"
                  value={formData.service}
                  onChange={update('service')}
                  className={`${inputClass} appearance-none`}
                >
                  <option value="" className="bg-dark-400">Select a service</option>
                  {services.map((service) => (
                    <option key={service} value={service} className="bg-dark-400">
                      {service}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={update('message')}
                  required
                  rows={5}
                  maxLength={5000}
                  className={`${inputClass} resize-none`}
                  placeholder="Tell us about your project or requirements..."
                />
              </div>

              {/* Honeypot: hidden from people; bots that fill it get rejected */}
              <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}>
                <label>
                  Website
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </label>
              </div>
            </>
          )}

          {error && (
            <div role="alert" className="flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={busy || (!!token && code.length !== 6)}
            className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{buttonLabel}</span>
            {token ? <Send className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
          </button>
          {!token && (
            <p className="text-xs text-gray-500 text-center">
              We&apos;ll email you a 6-digit code to confirm it&apos;s really you.
            </p>
          )}
        </form>
      )}
    </div>
  )
}

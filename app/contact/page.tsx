'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  Sparkles,
} from 'lucide-react'
import { event as gtagEvent } from '@/lib/gtag'

const services = [
  'AI Voice Agents',
  'AI Video Generators',
  'Social Media Automation',
  'Gmail Automation',
  'AI Marketing Tools',
  'Recruiter AI',
  'Marketing Agency',
  'Content & Shooting',
  'Other',
]

const faqs = [
  {
    q: 'How much do voice calling agents cost?',
    a: 'Our AI voice calling agents start at just Rs6 per minute. The exact pricing depends on your volume, complexity, and integration requirements.',
  },
  {
    q: 'What is Recruiter AI?',
    a: 'Our Recruiter AI helps you find job opportunities or candidates at Rs2 per lead. It uses AI to generate boolean searches, find contacts, and draft personalized outreach.',
  },
  {
    q: 'Do you handle everything for marketing?',
    a: 'Yes. Our marketing agency provides end-to-end support from professional shooting and content creation to social media management and performance marketing.',
  },
  {
    q: 'Are Ritualist and Granthas free?',
    a: 'Ritualist is completely free. Granthas will have a free tier with core scriptures, and a premium tier for advanced features and commentaries.',
  },
  {
    q: 'Can I get a custom AI solution?',
    a: 'Absolutely. We build custom AI automation solutions tailored to your business needs. Contact us to discuss your requirements.',
  },
]

const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const monthLabels = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

type SubmitStatus = 'idle' | 'success' | 'error'

interface MeetingRecord {
  id: string
  meeting_date: string
  meeting_time: string
  status?: string
  timezone?: string
}

interface SlotOption {
  isoKey: string
  label: string
}

const pad = (value: number) => String(value).padStart(2, '0')
const JST_TIMEZONE = 'Asia/Tokyo'
const DEFAULT_BOOKING_TIMEZONE = 'Asia/Kolkata'

const getDateKey = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

const parseDateKey = (dateKey: string) => {
  const [year, month, day] = dateKey.split('-').map(Number)
  return new Date(year, month - 1, day)
}

const formatDateLabel = (dateKey: string) =>
  parseDateKey(dateKey).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })

const formatSlotLabel = (hour: number, minute: number) => {
  const period = hour >= 12 ? 'PM' : 'AM'
  const normalizedHour = hour % 12 || 12
  return `${normalizedHour}:${pad(minute)} ${period}`
}

const parseTimeLabel = (timeLabel: string) => {
  const match = timeLabel.match(/^(\d{1,2}):(\d{2})\s(AM|PM)$/i)

  if (!match) {
    return { hour: 0, minute: 0 }
  }

  let hour = Number(match[1]) % 12
  const minute = Number(match[2])
  const meridiem = match[3].toUpperCase()

  if (meridiem === 'PM') {
    hour += 12
  }

  return { hour, minute }
}

const getTimeZoneParts = (date: Date, timeZone: string) => {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  })

  const values = formatter.formatToParts(date).reduce<Record<string, string>>((acc, part) => {
    if (part.type !== 'literal') {
      acc[part.type] = part.value
    }
    return acc
  }, {})

  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
    hour: Number(values.hour),
    minute: Number(values.minute),
  }
}

const adjustZonedDate = (
  current: Date,
  dateKey: string,
  timeLabel: string,
  timeZone: string,
) => {
  const [targetYear, targetMonth, targetDay] = dateKey.split('-').map(Number)
  const { hour, minute } = parseTimeLabel(timeLabel)
  const zoned = getTimeZoneParts(current, timeZone)
  const targetAsUtc = Date.UTC(targetYear, targetMonth - 1, targetDay, hour, minute)
  const zonedAsUtc = Date.UTC(zoned.year, zoned.month - 1, zoned.day, zoned.hour, zoned.minute)

  return new Date(current.getTime() + (targetAsUtc - zonedAsUtc))
}

const zonedDateTimeToUtc = (dateKey: string, timeLabel: string, timeZone: string) => {
  const [year, month, day] = dateKey.split('-').map(Number)
  const { hour, minute } = parseTimeLabel(timeLabel)
  let result = new Date(Date.UTC(year, month - 1, day, hour, minute))

  result = adjustZonedDate(result, dateKey, timeLabel, timeZone)
  result = adjustZonedDate(result, dateKey, timeLabel, timeZone)

  return result
}

const formatDateKeyInTimeZone = (date: Date, timeZone: string) => {
  const parts = getTimeZoneParts(date, timeZone)
  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}`
}

const formatTimeLabelInTimeZone = (date: Date, timeZone: string) =>
  new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date)

const addDaysToDateKey = (dateKey: string, amount: number) => {
  const date = parseDateKey(dateKey)
  date.setDate(date.getDate() + amount)
  return getDateKey(date)
}

const buildSlots = (
  startHour: number,
  startMinute: number,
  endHour: number,
  endMinute: number,
  intervalMinutes: number,
) => {
  const slots: string[] = []
  let totalMinutes = startHour * 60 + startMinute
  const endMinutes = endHour * 60 + endMinute

  while (totalMinutes <= endMinutes) {
    const hour = Math.floor(totalMinutes / 60)
    const minute = totalMinutes % 60
    slots.push(formatSlotLabel(hour, minute))
    totalMinutes += intervalMinutes
  }

  return slots
}

const weekdaySlots = buildSlots(18, 0, 23, 30, 30)
const weekendSlots = buildSlots(10, 0, 17, 30, 30)

const getJstSlotsForDate = (dateKey: string) => {
  const day = parseDateKey(dateKey).getDay()
  return day === 0 || day === 6 ? weekendSlots : weekdaySlots
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: '',
    message: '',
  })
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    date: '',
    time: '',
  })
  const [meetings, setMeetings] = useState<MeetingRecord[]>([])
  const [meetingsLoading, setMeetingsLoading] = useState(true)
  const [timezone, setTimezone] = useState('Asia/Kolkata')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isBookingSubmitting, setIsBookingSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle')
  const [bookingStatus, setBookingStatus] = useState<SubmitStatus>('idle')
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const today = new Date()
    return new Date(today.getFullYear(), today.getMonth(), 1)
  })
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata')

      import('lenis').then((Lenis) => {
        const lenis = new Lenis.default({
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        })

        function raf(time: number) {
          lenis.raf(time)
          requestAnimationFrame(raf)
        }

        requestAnimationFrame(raf)
      })
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    const loadMeetings = async () => {
      setMeetingsLoading(true)

      try {
        const response = await fetch('/api/meetings')
        const data = await response.json()

        if (!cancelled) {
          setMeetings(Array.isArray(data.meetings) ? data.meetings : [])
        }
      } catch {
        if (!cancelled) {
          setMeetings([])
        }
      } finally {
        if (!cancelled) {
          setMeetingsLoading(false)
        }
      }
    }

    loadMeetings()

    return () => {
      cancelled = true
    }
  }, [])

  const bookedSlots = useMemo(() => {
    const activeStatuses = new Set(['scheduled', 'rescheduled'])

    return new Set(
      meetings
        .filter((meeting) => !meeting.status || activeStatuses.has(meeting.status))
        .map((meeting) =>
          zonedDateTimeToUtc(
            meeting.meeting_date,
            meeting.meeting_time,
            meeting.timezone || DEFAULT_BOOKING_TIMEZONE,
          ).toISOString(),
        ),
    )
  }, [meetings])

  const today = useMemo(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), now.getDate())
  }, [])

  const getAvailableSlots = (dateKey: string): SlotOption[] => {
    const now = new Date()
    const localNoon = zonedDateTimeToUtc(dateKey, '12:00 PM', timezone)
    const approximateJstDate = formatDateKeyInTimeZone(localNoon, JST_TIMEZONE)
    const candidateJstDates = [-2, -1, 0, 1, 2].map((offset) =>
      addDaysToDateKey(approximateJstDate, offset),
    )

    const seen = new Set<string>()
    const slots: SlotOption[] = []

    candidateJstDates.forEach((jstDateKey) => {
      getJstSlotsForDate(jstDateKey).forEach((jstSlot) => {
        const instant = zonedDateTimeToUtc(jstDateKey, jstSlot, JST_TIMEZONE)
        const localDateKey = formatDateKeyInTimeZone(instant, timezone)
        const isoKey = instant.toISOString()

        if (
          localDateKey !== dateKey ||
          instant <= now ||
          seen.has(isoKey) ||
          bookedSlots.has(isoKey)
        ) {
          return
        }

        seen.add(isoKey)
        slots.push({
          isoKey,
          label: formatTimeLabelInTimeZone(instant, timezone),
        })
      })
    })

    return slots.sort((a, b) => a.isoKey.localeCompare(b.isoKey))
  }

  const selectedDateSlots = useMemo(() => {
    if (!bookingData.date) return []
    return getAvailableSlots(bookingData.date)
  }, [bookingData.date, bookedSlots, timezone])

  useEffect(() => {
    if (bookingData.time && !selectedDateSlots.some((slot) => slot.label === bookingData.time)) {
      setBookingData((prev) => ({ ...prev, time: '' }))
    }
  }, [bookingData.time, selectedDateSlots])

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', service: '', message: '' })
        gtagEvent('contact_form_submit', {
          service: formData.service,
        })
      } else {
        setSubmitStatus('error')
        gtagEvent('contact_form_error', {
          error_type: 'server_error',
          status: response.status,
        })
      }
    } catch {
      setSubmitStatus('error')
      gtagEvent('contact_form_error', {
        error_type: 'network_error',
      })
    }

    setIsSubmitting(false)
    setTimeout(() => setSubmitStatus('idle'), 5000)
  }

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsBookingSubmitting(true)
    setBookingStatus('idle')

    try {
      const response = await fetch('/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: bookingData.name,
          email: bookingData.email,
          phone: bookingData.phone,
          date: bookingData.date,
          time: bookingData.time,
          timezone,
          service_interest: bookingData.service || 'General',
        }),
      })

      if (!response.ok) {
        throw new Error('Booking failed')
      }

      setBookingStatus('success')
      setMeetings((prev) => [
        {
          id: `${bookingData.date}-${bookingData.time}`,
          meeting_date: bookingData.date,
          meeting_time: bookingData.time,
          status: 'scheduled',
          timezone,
        },
        ...prev,
      ])
      gtagEvent('meeting_booking_submit', {
        service: bookingData.service || 'General',
        date: bookingData.date,
        time: bookingData.time,
      })
      setBookingData({
        name: '',
        email: '',
        phone: '',
        service: '',
        date: '',
        time: '',
      })
    } catch {
      setBookingStatus('error')
      gtagEvent('meeting_booking_error', {
        error_type: 'booking_error',
      })
    } finally {
      setIsBookingSubmitting(false)
      setTimeout(() => setBookingStatus('idle'), 6000)
    }
  }

  const firstDayOfMonth = new Date(
    calendarMonth.getFullYear(),
    calendarMonth.getMonth(),
    1,
  ).getDay()
  const daysInMonth = new Date(
    calendarMonth.getFullYear(),
    calendarMonth.getMonth() + 1,
    0,
  ).getDate()

  return (
    <div className="min-h-screen pt-24">
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-saffron-500 uppercase tracking-[0.2em] text-sm font-medium mb-4"
          >
            Get in Touch
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl md:text-7xl font-bold mb-6"
          >
            Let&apos;s <span className="gradient-text-saffron">Connect</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto"
          >
            Whether you need AI automation, marketing support, or want to explore a custom solution, we&apos;re here to help.
          </motion.p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div
          ref={containerRef}
          className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-12"
        >
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3 space-y-8"
          >
            <div className="glass-card rounded-2xl p-8">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <h2 className="font-display text-2xl font-bold text-white mb-2">
                    Book a Free Consultation
                  </h2>
                  <p className="text-gray-300 text-sm">
                    Choose a date, pick a time slot, and we&apos;ll send the confirmation straight to your inbox.
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-2 rounded-full border border-saffron-500/20 bg-saffron-500/10 px-3 py-1.5 text-xs text-saffron-400">
                  <CalendarDays className="w-4 h-4" />
                  {timezone}
                </div>
              </div>

              {bookingStatus === 'success' ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Appointment Booked</h3>
                  <p className="text-gray-300 max-w-md">
                    Your slot is reserved. A confirmation email should arrive shortly with the meeting details.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1.5">Name</label>
                      <input
                        type="text"
                        required
                        value={bookingData.name}
                        onChange={(e) =>
                          setBookingData((prev) => ({ ...prev, name: e.target.value }))
                        }
                        className="w-full px-4 py-3 rounded-xl bg-dark-400/50 border border-white/10 text-white placeholder-gray-600 focus:border-saffron-500/50 focus:ring-1 focus:ring-saffron-500/20 focus:outline-none transition-all"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1.5">Email</label>
                      <input
                        type="email"
                        required
                        value={bookingData.email}
                        onChange={(e) =>
                          setBookingData((prev) => ({ ...prev, email: e.target.value }))
                        }
                        className="w-full px-4 py-3 rounded-xl bg-dark-400/50 border border-white/10 text-white placeholder-gray-600 focus:border-saffron-500/50 focus:ring-1 focus:ring-saffron-500/20 focus:outline-none transition-all"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1.5">Phone</label>
                      <input
                        type="tel"
                        value={bookingData.phone}
                        onChange={(e) =>
                          setBookingData((prev) => ({ ...prev, phone: e.target.value }))
                        }
                        className="w-full px-4 py-3 rounded-xl bg-dark-400/50 border border-white/10 text-white placeholder-gray-600 focus:border-saffron-500/50 focus:ring-1 focus:ring-saffron-500/20 focus:outline-none transition-all"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1.5">Service</label>
                      <select
                        value={bookingData.service}
                        onChange={(e) =>
                          setBookingData((prev) => ({ ...prev, service: e.target.value }))
                        }
                        className="w-full px-4 py-3 rounded-xl bg-dark-400/50 border border-white/10 text-white focus:border-saffron-500/50 focus:ring-1 focus:ring-saffron-500/20 focus:outline-none transition-all appearance-none"
                      >
                        <option value="" className="bg-dark-400">Select a service</option>
                        {services.map((service) => (
                          <option key={service} value={service} className="bg-dark-400">
                            {service}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-dark-400/20 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                      <div>
                        <p className="text-white font-semibold">Choose a date</p>
                        <p className="text-gray-400 text-sm">
                          Weekdays before 6:00 PM JST are blocked. We convert the remaining availability into your local timezone automatically.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setCalendarMonth(
                              new Date(
                                calendarMonth.getFullYear(),
                                calendarMonth.getMonth() - 1,
                                1,
                              ),
                            )
                          }
                          className="w-9 h-9 rounded-lg border border-white/10 text-gray-300 hover:text-white hover:border-saffron-500/30 transition-all flex items-center justify-center"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <div className="min-w-[140px] text-center text-white font-medium">
                          {monthLabels[calendarMonth.getMonth()]} {calendarMonth.getFullYear()}
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setCalendarMonth(
                              new Date(
                                calendarMonth.getFullYear(),
                                calendarMonth.getMonth() + 1,
                                1,
                              ),
                            )
                          }
                          className="w-9 h-9 rounded-lg border border-white/10 text-gray-300 hover:text-white hover:border-saffron-500/30 transition-all flex items-center justify-center"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-7 gap-2 mb-2">
                      {weekdayLabels.map((label) => (
                        <div
                          key={label}
                          className="text-center text-xs uppercase tracking-[0.15em] text-gray-500 py-1"
                        >
                          {label}
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                      {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                        <div
                          key={`empty-${index}`}
                          className="aspect-square rounded-xl border border-transparent"
                        />
                      ))}

                      {Array.from({ length: daysInMonth }).map((_, index) => {
                        const day = index + 1
                        const date = new Date(
                          calendarMonth.getFullYear(),
                          calendarMonth.getMonth(),
                          day,
                        )
                        const dateKey = getDateKey(date)
                        const availableSlots = getAvailableSlots(dateKey)
                        const isPast = date < today
                        const isDisabled = isPast || availableSlots.length === 0
                        const isSelected = bookingData.date === dateKey

                        return (
                          <button
                            key={dateKey}
                            type="button"
                            disabled={isDisabled}
                            onClick={() =>
                              setBookingData((prev) => ({
                                ...prev,
                                date: dateKey,
                                time: availableSlots.some((slot) => slot.label === prev.time)
                                  ? prev.time
                                  : '',
                              }))
                            }
                            className={`aspect-square rounded-xl border text-sm transition-all ${
                              isSelected
                                ? 'bg-saffron-500 text-dark-950 border-saffron-500'
                                : isDisabled
                                ? 'bg-dark-400/20 text-gray-600 border-white/5 cursor-not-allowed'
                                : 'bg-dark-400/40 text-white border-white/10 hover:border-saffron-500/40 hover:text-saffron-300'
                            }`}
                            title={
                              isDisabled
                                ? isPast
                                  ? 'Past date'
                                  : 'No slots available'
                                : `${availableSlots.length} slots available`
                            }
                          >
                            {day}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-dark-400/20 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                      <div>
                        <p className="text-white font-semibold">Pick a time slot</p>
                        <p className="text-gray-400 text-sm">
                          {bookingData.date
                            ? `Showing available slots for ${formatDateLabel(bookingData.date)}`
                            : 'Select a date to reveal time slots'}
                        </p>
                      </div>
                      {meetingsLoading && (
                        <p className="text-xs text-gray-500">Loading booked slots...</p>
                      )}
                    </div>

                    {bookingData.date ? (
                      selectedDateSlots.length > 0 ? (
                        <div className="grid sm:grid-cols-3 gap-3">
                          {selectedDateSlots.map((slot) => (
                            <button
                              key={slot.isoKey}
                              type="button"
                              onClick={() =>
                                setBookingData((prev) => ({ ...prev, time: slot.label }))
                              }
                              className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                                bookingData.time === slot.label
                                  ? 'bg-saffron-500 text-dark-950 border-saffron-500'
                                  : 'bg-dark-400/40 text-gray-200 border-white/10 hover:border-saffron-500/40'
                              }`}
                            >
                              {slot.label}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-xl border border-dashed border-white/10 px-4 py-6 text-center text-sm text-gray-400">
                          No open slots remain on this date. Please choose another day.
                        </div>
                      )
                    ) : (
                      <div className="rounded-xl border border-dashed border-white/10 px-4 py-6 text-center text-sm text-gray-400">
                        Pick a date from the calendar first.
                      </div>
                    )}
                  </div>

                  {bookingStatus === 'error' && (
                    <div className="flex items-center gap-2 text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      We could not reserve that slot. Please refresh and try again.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={
                      isBookingSubmitting ||
                      !bookingData.name ||
                      !bookingData.email ||
                      !bookingData.date ||
                      !bookingData.time
                    }
                    className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>{isBookingSubmitting ? 'Booking...' : 'Book Appointment'}</span>
                    <CalendarDays className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>

            <div className="glass-card rounded-2xl p-8">
              <h2 className="font-display text-2xl font-bold text-white mb-6">Send us a message</h2>

              {submitStatus === 'success' ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Message Sent</h3>
                  <p className="text-gray-300">We&apos;ll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1.5">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, name: e.target.value }))
                        }
                        required
                        className="w-full px-4 py-3 rounded-xl bg-dark-400/50 border border-white/10 text-white placeholder-gray-600 focus:border-saffron-500/50 focus:ring-1 focus:ring-saffron-500/20 focus:outline-none transition-all"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1.5">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, email: e.target.value }))
                        }
                        required
                        className="w-full px-4 py-3 rounded-xl bg-dark-400/50 border border-white/10 text-white placeholder-gray-600 focus:border-saffron-500/50 focus:ring-1 focus:ring-saffron-500/20 focus:outline-none transition-all"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">Service Interested In</label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, service: e.target.value }))
                      }
                      className="w-full px-4 py-3 rounded-xl bg-dark-400/50 border border-white/10 text-white focus:border-saffron-500/50 focus:ring-1 focus:ring-saffron-500/20 focus:outline-none transition-all appearance-none"
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
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, message: e.target.value }))
                      }
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl bg-dark-400/50 border border-white/10 text-white placeholder-gray-600 focus:border-saffron-500/50 focus:ring-1 focus:ring-saffron-500/20 focus:outline-none transition-all resize-none"
                      placeholder="Tell us about your project or requirements..."
                    />
                  </div>

                  {submitStatus === 'error' && (
                    <div className="flex items-center gap-2 text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      Something went wrong. Please try again or email us directly.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full justify-center"
                  >
                    <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-semibold text-white mb-4">Contact Info</h3>
              <div className="space-y-4">
                <a
                  href="mailto:contact@anantasutra.com"
                  className="flex items-center gap-3 text-gray-400 hover:text-saffron-500 transition-colors"
                >
                  <Mail className="w-5 h-5 text-saffron-500" />
                  <span className="text-sm">contact@anantasutra.com</span>
                </a>
                <div className="flex items-center gap-3 text-gray-400">
                  <MapPin className="w-5 h-5 text-saffron-500" />
                  <span className="text-sm">Delhi, India</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <Phone className="w-5 h-5 text-saffron-500" />
                  <span className="text-sm">Bring your preferred WhatsApp number if you want quicker coordination.</span>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-semibold text-white mb-3">How Booking Works</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-400">
                  <Clock className="w-4 h-4 text-violet-400" />
                  <span className="text-sm">Pick an open slot shown in your local timezone</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <MessageSquare className="w-4 h-4 text-violet-400" />
                  <span className="text-sm">Get an email confirmation right after booking</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <Sparkles className="w-4 h-4 text-violet-400" />
                  <span className="text-sm">Weekdays from 9:00 AM to 6:00 PM JST always stay blocked</span>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 glow-saffron">
              <h3 className="font-semibold text-white mb-2">For Co-founder Inquiries</h3>
              <p className="text-gray-300 text-sm mb-3">
                Direct contact for partnerships and strategic discussions.
              </p>
              <a
                href="mailto:co-founder@anantasutra.com"
                className="text-saffron-400 text-sm font-medium hover:text-saffron-300 transition-colors"
              >
                co-founder@anantasutra.com
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4 mb-12">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-saffron-500 uppercase tracking-[0.2em] text-sm font-medium mb-3">FAQ</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
              Common <span className="gradient-text-saffron">Questions</span>
            </h2>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="glass-card rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="text-white font-medium pr-4">{faq.q}</span>
                  <ArrowRight
                    className={`w-4 h-4 text-saffron-500 flex-shrink-0 transition-transform duration-300 ${
                      openFaq === index ? 'rotate-90' : ''
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="px-5 pb-5"
                  >
                    <p className="text-gray-300 text-sm leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

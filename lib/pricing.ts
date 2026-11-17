/**
 * The only price AnantaSutra publishes for dedicated experts (founder, 13 Oct 2026): one fixed monthly
 * price per expert, from ₹20,000 to ₹60,000 a month, depending on the expert's skills, experience and
 * the work. No extra fees, no recruitment fee, no lock-in. /pricing renders this data and its layout
 * repeats it as JSON-LD, so the visible text and the schema never drift apart.
 */
export const PRICE_RANGE = {
  currency: 'INR',
  min: 20000,
  max: 60000,
  minLabel: '₹20,000',
  maxLabel: '₹60,000',
} as const

export interface PricingFaq {
  q: string
  a: string
}

/** Shown on /pricing and mirrored as FAQPage JSON-LD in app/pricing/layout.tsx. */
export const pricingFaqs: PricingFaq[] = [
  {
    q: 'How much does a dedicated expert cost in India?',
    a: 'One fixed monthly price per expert, from ₹20,000 to ₹60,000 a month, depending on the expert\'s skills, experience and the work. The figure for your role is agreed before the expert starts.',
  },
  {
    q: 'What does the price depend on?',
    a: 'Three things: the expert\'s skills, their experience, and the scope of the work. A rarer skill set, more years in the role or a wider brief moves the figure up the range.',
  },
  {
    q: 'Are there any extra fees?',
    a: 'No. There is no recruitment fee and no extra fees on top of the monthly price. You receive one monthly invoice per expert.',
  },
  {
    q: 'Is there a minimum term?',
    a: 'No. Billing is month to month with no lock-in, so you can pause, scale up or stop as your needs change.',
  },
  {
    q: 'How fast can the expert start?',
    a: 'Live in about 7 days. After a 30-minute call we hand-pick and vet 2-3 profiles, you interview and choose, and your expert joins your tools and standups.',
  },
  {
    q: 'What if the fit fails?',
    a: 'The 48-hour replacement guarantee applies: if the fit fails, a vetted replacement is in the seat within 48 hours.',
  },
]

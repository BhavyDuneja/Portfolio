import JsonLd from '@/components/JsonLd'
import { pageMetadata, PAGE_SEO, SITE_URL } from '@/lib/seo'
import { PRICE_RANGE, pricingFaqs } from '@/lib/pricing'

const seo = PAGE_SEO.pricing

export const metadata = pageMetadata(seo)

// Built from the same array the page renders, so the schema and the visible FAQ match word for word.
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: pricingFaqs.map((faq) => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: { '@type': 'Answer', text: faq.a },
  })),
}

// A price range per month (UN/CEFACT unit code MON), not a single price: minPrice/maxPrice on a
// UnitPriceSpecification, with a reference quantity of 1 month.
const offerJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Dedicated Experts',
  description: 'A vetted dedicated expert embedded in your team for one fixed monthly price. No extra fees, no recruitment fee, no lock-in.',
  url: `${SITE_URL}/services/dedicated-experts`,
  provider: { '@type': 'Organization', name: 'AnantaSutra', url: SITE_URL },
  offers: {
    '@type': 'Offer',
    url: `${SITE_URL}${seo.path}`,
    priceCurrency: PRICE_RANGE.currency,
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      priceCurrency: PRICE_RANGE.currency,
      minPrice: PRICE_RANGE.min,
      maxPrice: PRICE_RANGE.max,
      unitCode: 'MON',
      unitText: 'MONTH',
      referenceQuantity: { '@type': 'QuantitativeValue', value: 1, unitCode: 'MON' },
    },
  },
}

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <JsonLd data={faqJsonLd} />
      <JsonLd data={offerJsonLd} />
      {children}
    </>
  )
}

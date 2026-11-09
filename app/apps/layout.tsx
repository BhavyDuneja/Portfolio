import { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import { tools } from '@/lib/tools'

export const metadata: Metadata = {
  title: 'Apps & AI Tools — Ritualist, Granthas, Drishti & More',
  description: 'AnantaSutra apps and pay-per-use AI tools: Ritualist and Granthas for mindful living, plus Drishti (AI search audit), Suchi (llms.txt), Pramana (GSTIN/PAN check) and more.',
  alternates: {
    canonical: 'https://www.anantasutra.com/apps',
  },
  openGraph: {
    title: 'AnantaSutra Apps & AI Tools',
    description: 'Ritualist and Granthas for mindful living, plus pay-per-use tools for AI search visibility and Indian business data: Drishti, Suchi, Pramana, Sthana, Setu and Netra.',
    url: 'https://www.anantasutra.com/apps',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AnantaSutra Apps & AI Tools',
    description: 'Ritualist and Granthas for mindful living, plus pay-per-use tools for AI search visibility and Indian business data: Drishti, Suchi, Pramana, Sthana, Setu and Netra.',
  },
}

// Only tools that are on sale get structured data.
const toolItems = tools
  .filter((tool) => tool.status === 'live' && tool.url && tool.priceUsd)
  .map((tool) => ({
    '@type': 'SoftwareApplication',
    name: `${tool.name}.Anantasutra`,
    description: tool.description,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web',
    url: tool.url,
    image: `https://www.anantasutra.com${tool.logo}`,
    offers: {
      '@type': 'Offer',
      price: tool.priceUsd,
      priceCurrency: 'USD',
      url: tool.url,
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: tool.priceUsd,
        priceCurrency: 'USD',
        unitText: tool.priceUnit,
      },
    },
  }))

const appsJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'AnantaSutra Apps & Tools',
  description: 'Apps for mindful living and pay-per-use AI tools by AnantaSutra.',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      item: {
        '@type': 'SoftwareApplication',
        name: 'Granthas',
        description: 'A comprehensive digital library of Hindu scriptures — Vedas, Upanishads, Puranas, Bhagavad Gita, and more.',
        applicationCategory: 'ReferenceApplication',
        operatingSystem: 'Web',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'INR',
        },
      },
    },
    {
      '@type': 'ListItem',
      position: 2,
      item: {
        '@type': 'SoftwareApplication',
        name: 'Ritualist',
        description: 'A free app for building and maintaining daily rituals, habits, and mindful practices.',
        applicationCategory: 'LifestyleApplication',
        operatingSystem: 'Web',
        url: 'https://ritualist.anantasutra.com',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'INR',
        },
      },
    },
    ...toolItems.map((item, i) => ({
      '@type': 'ListItem',
      position: 3 + i,
      item,
    })),
  ],
}

export default function AppsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <JsonLd data={appsJsonLd} />
      {children}
    </>
  )
}

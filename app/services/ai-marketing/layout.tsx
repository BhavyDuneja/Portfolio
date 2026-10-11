import JsonLd from '@/components/JsonLd'
import { pageMetadata, PAGE_SEO, serviceJsonLd } from '@/lib/seo'

const seo = PAGE_SEO['ai-marketing']

export const metadata = pageMetadata(seo)

export default function AiMarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <JsonLd data={serviceJsonLd(seo)} />
      {children}
    </>
  )
}

import JsonLd from '@/components/JsonLd'
import { pageMetadata, PAGE_SEO, serviceJsonLd } from '@/lib/seo'

const seo = PAGE_SEO['dedicated-experts']

export const metadata = pageMetadata(seo)

export default function DedicatedExpertsLayout({
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

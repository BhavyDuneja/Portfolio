import JsonLd from '@/components/JsonLd'
import { pageMetadata, PAGE_SEO, serviceJsonLd } from '@/lib/seo'

const seo = PAGE_SEO['recruiter-ai']

export const metadata = pageMetadata(seo)

export default function RecruiterAiLayout({
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

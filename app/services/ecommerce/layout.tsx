import { pageMetadata, PAGE_SEO } from '@/lib/seo'

export const metadata = pageMetadata(PAGE_SEO.ecommerce)

export default function EcommerceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

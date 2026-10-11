import { pageMetadata, PAGE_SEO } from '@/lib/seo'

export const metadata = pageMetadata(PAGE_SEO.business)

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

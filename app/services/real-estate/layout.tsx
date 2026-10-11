import { pageMetadata, PAGE_SEO } from '@/lib/seo'

export const metadata = pageMetadata(PAGE_SEO['real-estate'])

export default function RealEstateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

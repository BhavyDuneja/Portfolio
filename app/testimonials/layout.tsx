import { pageMetadata, PAGE_SEO } from '@/lib/seo'

export const metadata = pageMetadata(PAGE_SEO.testimonials)

export default function TestimonialsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

import { pageMetadata, PAGE_SEO } from '@/lib/seo'

export const metadata = pageMetadata(PAGE_SEO.academic)

export default function AcademicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

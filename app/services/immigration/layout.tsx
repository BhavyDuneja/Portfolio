import { pageMetadata, PAGE_SEO } from '@/lib/seo'

export const metadata = pageMetadata(PAGE_SEO.immigration)

export default function ImmigrationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

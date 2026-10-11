import { pageMetadata, PAGE_SEO } from '@/lib/seo'

export const metadata = pageMetadata(PAGE_SEO.portfolio)

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

import { Metadata } from 'next'

// The admin console is a login-walled client page. Without its own metadata it inherited the homepage's
// title and description, and Google indexed /admin at position 3 (Search Console, Nov 2026). Googlebot only
// reads a noindex on a page it may crawl, so /admin is deliberately not blocked in app/robots.ts.
export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="admin-layout">
      {children}
    </div>
  )
}

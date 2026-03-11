export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || ''

declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js',
      targetId: string | Date,
      params?: Record<string, unknown>
    ) => void
  }
}

export function pageview(url: string) {
  if (!GA_ID || typeof window === 'undefined' || !window.gtag) return
  window.gtag('config', GA_ID, {
    page_path: url,
  })
}

export function event(
  action: string,
  params: Record<string, unknown> = {}
) {
  if (!GA_ID || typeof window === 'undefined' || !window.gtag) return
  window.gtag('event', action, params)
}

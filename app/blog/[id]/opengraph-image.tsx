import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const contentType = 'image/png'
export const size = { width: 1200, height: 630 }

async function getPost(id: string) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!supabaseUrl || !supabaseKey) return null

    // Direct REST fetch — works on edge runtime (supabase-js does not)
    const res = await fetch(
      `${supabaseUrl}/rest/v1/blog_posts?select=title,category,author_name,read_time&or=(slug.eq.${encodeURIComponent(id)},id.eq.${encodeURIComponent(id)})&limit=1`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
        next: { revalidate: 3600 },
      }
    )

    if (!res.ok) return null
    const rows = await res.json()
    return rows?.[0] ?? null
  } catch {
    return null
  }
}

const categoryColors: Record<string, { bg: string; accent: string }> = {
  'AI Automation':            { bg: '#0d0520', accent: '#7C3AED' },
  'Digital Transformation':   { bg: '#040f1f', accent: '#2563EB' },
  'Social Media Marketing':   { bg: '#1a1200', accent: '#D97706' },
  'Content Marketing':        { bg: '#011a0e', accent: '#059669' },
  'SaaS & Business Software': { bg: '#160416', accent: '#DB2777' },
  'Performance Marketing':    { bg: '#1a1200', accent: '#F59E0B' },
  'Technology & Wellness':    { bg: '#011a1a', accent: '#0891B2' },
  'AI Video':                 { bg: '#0d0520', accent: '#8B5CF6' },
  'Email Marketing':          { bg: '#1a0404', accent: '#EF4444' },
  'Brand Strategy':           { bg: '#011a09', accent: '#10B981' },
  'HR Tech & Recruitment':    { bg: '#04041a', accent: '#6366F1' },
  'Content Creation':         { bg: '#1a0a00', accent: '#F97316' },
}

export default async function OgImage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id)

  const title    = post?.title       || 'AnantaSutra Insights'
  const category = post?.category    || 'Business & AI'
  const author   = post?.author_name || 'AnantaSutra Team'
  const readTime = post?.read_time   || '5 min read'

  const colors   = categoryColors[category] || { bg: '#0A0A1E', accent: '#E8A317' }
  const fontSize = title.length > 70 ? '40px' : title.length > 50 ? '48px' : '56px'

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px', height: '630px',
          display: 'flex', flexDirection: 'column',
          background: colors.bg,
          padding: '60px 70px',
          position: 'relative', overflow: 'hidden',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Glow blobs */}
        <div style={{ position: 'absolute', top: '-120px', right: '-120px', width: '550px', height: '550px', borderRadius: '50%', background: `${colors.accent}25`, filter: 'blur(100px)' }} />
        <div style={{ position: 'absolute', bottom: '-100px', left: '-80px', width: '400px', height: '400px', borderRadius: '50%', background: '#E8A31718', filter: 'blur(80px)' }} />
        {/* Grid */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)`, backgroundSize: '60px 60px' }} />

        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 1 }}>
          <div style={{ background: 'linear-gradient(135deg,#E8A317,#F0C040)', borderRadius: '10px', padding: '8px 20px', fontSize: '22px', fontWeight: '800', color: '#000', letterSpacing: '-0.02em' }}>
            AnantaSutra
          </div>
          <div style={{ background: `${colors.accent}18`, border: `1.5px solid ${colors.accent}60`, borderRadius: '24px', padding: '8px 20px', fontSize: '17px', color: colors.accent, fontWeight: '600' }}>
            {category}
          </div>
        </div>

        {/* Title */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', zIndex: 1 }}>
          <h1 style={{ fontSize, fontWeight: '800', color: '#ffffff', lineHeight: '1.18', margin: '0', letterSpacing: '-0.03em', maxWidth: '1000px' }}>
            {title}
          </h1>
        </div>

        {/* Accent bar */}
        <div style={{ width: '80px', height: '4px', background: `linear-gradient(90deg,${colors.accent},#E8A317)`, borderRadius: '2px', marginBottom: '28px', zIndex: 1 }} />

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '24px', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: `linear-gradient(135deg,${colors.accent},#E8A317)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '700', color: '#fff' }}>
              {author.charAt(0).toUpperCase()}
            </div>
            <span style={{ color: '#9ca3af', fontSize: '17px', fontWeight: '500' }}>{author}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', fontSize: '16px' }}>
            <span style={{ color: '#6b7280' }}>{readTime}</span>
            <span style={{ color: colors.accent, fontWeight: '600', fontSize: '17px' }}>anantasutra.com</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}

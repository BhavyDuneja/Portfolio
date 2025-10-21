import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ParticleBackground from '@/components/ParticleBackground'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://anantasutra.com'),
  title: 'Anantasutra - Technology Solutions | Full-Stack Development & Cloud Architecture',
  description: 'Professional technology solutions company specializing in full-stack development, cloud architecture, and digital transformation. Empowering businesses with cutting-edge technology.',
  keywords: 'Anantasutra, Technology Solutions, Full-Stack Development, Cloud Architecture, Software Development, Digital Transformation, Web Development, Mobile Apps',
  authors: [{ name: 'Anantasutra' }],
  creator: 'Anantasutra',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://anantasutra.com',
    title: 'Anantasutra - Technology Solutions',
    description: 'Professional technology solutions company specializing in full-stack development, cloud architecture, and digital transformation.',
    siteName: 'Anantasutra',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anantasutra - Technology Solutions',
    description: 'Professional technology solutions company specializing in full-stack development, cloud architecture, and digital transformation.',
    creator: '@anantasutra',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans antialiased">
        <ParticleBackground />
        <Navbar />
        <br></br>
        <br></br>
        <main className="relative">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}


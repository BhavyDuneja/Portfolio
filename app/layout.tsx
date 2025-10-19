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
  metadataBase: new URL('https://bhavyaduneja.com'),
  title: 'Bhavya Duneja - Software Engineer | Full Stack Developer',
  description: 'Software Engineer with expertise in .NET, ReactJS, AWS, Azure, and System Design. Currently based in Osaka, Japan with experience in full-stack development and cloud architecture.',
  keywords: 'Bhavya Duneja, Software Engineer, Full Stack Developer, .NET, ReactJS, AWS, Azure, Japan, Osaka',
  authors: [{ name: 'Bhavya Duneja' }],
  creator: 'Bhavya Duneja',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://bhavyaduneja.com',
    title: 'Bhavya Duneja - Software Engineer',
    description: 'Software Engineer with expertise in .NET, ReactJS, AWS, Azure, and System Design.',
    siteName: 'Bhavya Duneja Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bhavya Duneja - Software Engineer',
    description: 'Software Engineer with expertise in .NET, ReactJS, AWS, Azure, and System Design.',
    creator: '@bhavyaduneja',
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


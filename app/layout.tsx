import type { Metadata, Viewport } from 'next'
import { Pixelify_Sans, Rubik } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { LanguageProvider } from '@/context/LanguageContext'
import './globals.css'

const pixelifySans = Pixelify_Sans({ 
  subsets: ['latin'],
  variable: '--font-pixelify',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const rubik = Rubik({ 
  subsets: ['latin'],
  variable: '--font-rubik',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Bleidys Larios | Desarrolladora Web Full Stack Junior',
  description: 'Portafolio profesional de Bleidys Larios - Desarrolladora Web Full Stack Junior especializada en React, Node.js y creación de aplicaciones web modernas y amigables.',
  keywords: ['Desarrolladora Full Stack', 'Desarrolladora Web', 'React', 'Node.js', 'Portafolio', 'Bleidys Larios'],
  authors: [{ name: 'Bleidys Larios' }],
  openGraph: {
    title: 'Bleidys Larios | Desarrolladora Web Full Stack Junior',
    description: 'Creando aplicaciones web modernas, hermosas y amigables.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
}

import { CustomCursor } from '@/components/ui/CustomCursor'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${pixelifySans.variable} ${rubik.variable}`}>
      <body>
        <LanguageProvider>
          <CustomCursor />
          {children}
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </LanguageProvider>
      </body>
    </html>
  )
}

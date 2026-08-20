import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Poppins, Inter } from 'next/font/google'
import { PromoPopup } from '@/components/promo-popup/promo-popup'
import './globals.css'

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
})

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

// Sin esto, Next arma las URLs absolutas de las imágenes Open Graph (ver
// app/**/opengraph-image.tsx) contra "localhost:3000" incluso en
// producción — hay que darle un dominio real para que resuelvan bien.
// `NEXT_PUBLIC_SITE_URL` queda como override opcional para el día que haya
// dominio propio, sin tener que tocar código.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://takes-sushi-mauve.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "TAKE'S — Sushi & Coffee",
  description:
    "TAKE'S Sushi & Coffee — sushi fresco de autor y café de especialidad. Rolls, hosomakis, california y más, preparados al momento con ingredientes de primera.",
  generator: 'v0.app',
}

export const viewport: Viewport = {
  themeColor: '#16c5d4',
  colorScheme: 'light',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      className={`${poppins.variable} ${inter.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        {children}
        <PromoPopup />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { SiteHeader } from '@/components/site-header'
import { HeroSection } from '@/components/hero-section'
import { AboutSection } from '@/components/about-section'
import { MenuSection } from '@/components/menu-section'
import { PromotionsSection } from '@/components/promotions-section'
import { GallerySection } from '@/components/gallery-section'
import { TestimonialsSection } from '@/components/testimonials-section'
import { FaqSection } from '@/components/faq-section'
import { ClubBeneficiosSection } from '@/components/club-beneficios-section'
import { ContactSection } from '@/components/contact-section'
import { SiteFooter } from '@/components/site-footer'
import { FloatingSocial } from '@/components/floating-social'
import { ClubQrPopup } from '@/components/club-qr-popup'
import { getContent } from '@/lib/content'

// El contenido viene de Supabase (tablas galeria/resenas/site_config) y se
// edita fuera de este código (Supabase Studio) — sin esto, Next dejaría la
// home 100% estática con los datos congelados desde el último build.
// (Promociones no depende de esto: PromotionsSection las trae en vivo del
// lado del cliente, ver components/promo-popup/use-promos-vigentes.ts.)
export const revalidate = 60

// Igual que las capturas de club-pasos: archivo estático en public/, fuera
// de Supabase — `existsSync` corre acá (Server Component) porque
// ClubQrPopup es 'use client' y no puede tocar node:fs. Mientras no se
// suba el archivo, el pop-up simplemente no aparece.
const CLUB_QR_POPUP_IMAGE = existsSync(
  join(process.cwd(), 'public', 'images', 'club-popup', 'club-qr1.png'),
)
  ? '/images/club-popup/club-qr1.png'
  : null

export default async function Home() {
  const content = await getContent()

  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection content={content} />
        <ClubBeneficiosSection content={content} />
        <AboutSection />
        <MenuSection whatsappNumber={content.contacto.redes.whatsapp} />
        <PromotionsSection content={content} />
        <GallerySection content={content} />
        <TestimonialsSection content={content} />
        <FaqSection />
        <ContactSection content={content} />
      </main>
      <SiteFooter content={content} />
      <FloatingSocial
        whatsappNumber={content.contacto.redes.whatsapp}
        instagramUrl={content.contacto.redes.instagram}
      />
      <ClubQrPopup imageSrc={CLUB_QR_POPUP_IMAGE} />
    </>
  )
}

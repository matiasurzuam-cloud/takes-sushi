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
import { getContent } from '@/lib/content'

// El contenido viene de Supabase (tablas galeria/resenas/site_config) y se
// edita fuera de este código (Supabase Studio) — sin esto, Next dejaría la
// home 100% estática con los datos congelados desde el último build.
// (Promociones no depende de esto: PromotionsSection las trae en vivo del
// lado del cliente, ver components/promo-popup/use-promos-vigentes.ts.)
export const revalidate = 60

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
    </>
  )
}

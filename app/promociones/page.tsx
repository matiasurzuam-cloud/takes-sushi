import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { PromotionsGrid } from '@/components/promotions-grid'
import { getContent } from '@/lib/content'

export const metadata: Metadata = {
  title: "Promociones | TAKE'S Sushi & Coffee",
  description:
    "Todos los combos, descuentos y ofertas por temporada de TAKE'S Sushi & Coffee.",
}

// Sin esto quedaba 100% estática (sin `revalidate` ni `dynamic`, Next la
// trata como SSG puro) — nunca se habría refrescado tras el primer build.
export const revalidate = 60

export default async function PromocionesPage() {
  const content = await getContent()

  return (
    <>
      <SiteHeader />
      <main className="pt-24 sm:pt-28">
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-eyebrow">Promociones</span>
              <h1 className="text-h2 mt-3">Todas nuestras ofertas</h1>
              <p className="text-lead mt-4">
                Combos, descuentos y ofertas por temporada, directo desde la cocina.
              </p>
            </div>

            <PromotionsGrid content={content} />
          </div>
        </section>
      </main>
      <SiteFooter content={content} />
    </>
  )
}

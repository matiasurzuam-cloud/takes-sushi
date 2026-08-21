'use client'

import { Gift, MessageCircle } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { SmartImage } from '@/components/ui/smart-image'
import { PromoCountdown } from '@/components/promo-popup/promo-countdown'
import { usePromosVigentes } from '@/components/promo-popup/use-promos-vigentes'
import { proximoCierreMs } from '@/lib/promociones/vigencia'
import type { SiteContent } from '@/lib/content'

// Banners full-width (imagen + panel de texto) en vez de la grilla chica de
// antes — se ven más "profesionales" a lo ancho de la página. El botón
// "Solicitar" va directo a WhatsApp con el nombre de la promo precargado
// (en vez de mandar a /promociones), para no agregar un paso extra entre
// ver la oferta y preguntar por ella.
export function PromotionsSection({ content }: { content: SiteContent }) {
  const { promos } = usePromosVigentes()
  const { contacto } = content
  const instagramHref = contacto.redes.instagram || `https://wa.me/${contacto.redes.whatsapp}`

  return (
    <section id="promociones" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-eyebrow">Promociones</span>
          <h2 className="text-h2 mt-3">Ofertas que vas a amar</h2>
          <p className="text-lead mt-4">
            Combos, descuentos y ofertas por temporada, directo desde la cocina.
          </p>
        </Reveal>

        {promos === null ? (
          <div className="mt-12 space-y-6">
            {[0, 1].map((i) => (
              <div key={i} className="h-64 animate-pulse rounded-3xl bg-muted sm:h-80" />
            ))}
          </div>
        ) : promos.length === 0 ? (
          <Reveal className="mt-12">
            <EmptyState
              icon={Gift}
              title="Todavía no hay promos vigentes"
              description="Estamos preparando descuentos y combos especiales. Síguenos en Instagram para enterarte apenas salgan."
              ctaLabel="Síguenos en Instagram"
              ctaHref={instagramHref}
            />
          </Reveal>
        ) : (
          <div className="mt-12 space-y-6">
            {promos.map((promo, i) => {
              const cierreMs = proximoCierreMs(promo, new Date())
              const mensaje = encodeURIComponent(
                `Hola! Me interesa la promoción "${promo.titulo}". ¿Me pueden dar más detalles?`,
              )
              const whatsappHref = `https://wa.me/${contacto.redes.whatsapp}?text=${mensaje}`
              return (
                <Reveal key={promo.id} delay={i * 80}>
                  <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    <div className="grid md:grid-cols-2">
                      <div className="relative h-56 sm:h-72 md:h-auto md:min-h-[320px]">
                        <SmartImage
                          src={promo.imagenes[0] || '/placeholder.svg'}
                          alt={promo.titulo}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                      <div className="flex flex-col justify-center gap-4 p-8 sm:p-10 md:p-12">
                        <span className="text-eyebrow w-fit">Promoción</span>
                        <h3 className="text-2xl font-extrabold leading-tight text-foreground sm:text-3xl">
                          {promo.titulo}
                        </h3>
                        <p className="text-pretty leading-relaxed text-muted-foreground">
                          {promo.descripcion}
                        </p>
                        {cierreMs !== null && <PromoCountdown targetMs={cierreMs} />}
                        <Button
                          variant="brand"
                          size="pill"
                          className="mt-1 w-fit"
                          nativeButton={false}
                          render={<a href={whatsappHref} target="_blank" rel="noopener noreferrer" />}
                        >
                          Solicitar <MessageCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

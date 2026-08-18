'use client'

import { Gift } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { SmartImage } from '@/components/ui/smart-image'
import { PromoCountdown } from '@/components/promo-popup/promo-countdown'
import { usePromosVigentes } from '@/components/promo-popup/use-promos-vigentes'
import type { SiteContent } from '@/lib/content'

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
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-80 animate-pulse rounded-3xl bg-muted" />
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
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {promos.map((promo, i) => (
              <Reveal key={promo.id} delay={i * 80}>
                <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className="relative h-48 w-full">
                    <SmartImage
                      src={promo.imagenes[0] || '/placeholder.svg'}
                      alt={promo.titulo}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-6">
                    <h3 className="text-h3">{promo.titulo}</h3>
                    <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                      {promo.descripcion}
                    </p>
                    {promo.fechaExpiracion && <PromoCountdown fechaExpiracion={promo.fechaExpiracion} />}
                    {promo.link && (
                      <Button
                        variant="brand"
                        size="pill"
                        className="mt-1 w-fit"
                        nativeButton={false}
                        render={<a href={promo.link} />}
                      >
                        Ver más
                      </Button>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

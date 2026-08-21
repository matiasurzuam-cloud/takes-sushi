'use client'

import { Gift } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { SmartImage } from '@/components/ui/smart-image'
import { PromoCountdown } from '@/components/promo-popup/promo-countdown'
import { usePromosVigentes } from '@/components/promo-popup/use-promos-vigentes'
import { proximoCierreMs } from '@/lib/promociones/vigencia'
import type { SiteContent } from '@/lib/content'

// Grid de tarjetas de promociones — vivía en components/promotions-section.tsx
// (la sección de la home), pero la home ahora muestra banners full-width que
// enlazan a /promociones (ver app/promociones/page.tsx), que es quien renderiza
// este grid completo. Mismo hook `usePromosVigentes` que la home y el pop-up,
// así el filtro por día/hora/vencimiento vive en un solo lugar.
export function PromotionsGrid({ content }: { content: SiteContent }) {
  const { promos } = usePromosVigentes()
  const { contacto } = content
  const instagramHref = contacto.redes.instagram || `https://wa.me/${contacto.redes.whatsapp}`

  if (promos === null) {
    return (
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-80 animate-pulse rounded-3xl bg-muted" />
        ))}
      </div>
    )
  }

  if (promos.length === 0) {
    return (
      <Reveal className="mt-12">
        <EmptyState
          icon={Gift}
          title="Todavía no hay promos vigentes"
          description="Estamos preparando descuentos y combos especiales. Síguenos en Instagram para enterarte apenas salgan."
          ctaLabel="Síguenos en Instagram"
          ctaHref={instagramHref}
        />
      </Reveal>
    )
  }

  return (
    <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {promos.map((promo, i) => {
        const cierreMs = proximoCierreMs(promo, new Date())
        return (
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
                {cierreMs !== null && <PromoCountdown targetMs={cierreMs} />}
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
        )
      })}
    </div>
  )
}

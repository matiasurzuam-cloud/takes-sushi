'use client'

import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { SmartImage } from '@/components/ui/smart-image'
import { PromoCountdown } from './promo-countdown'
import { proximoCierreMs } from '@/lib/promociones/vigencia'
import type { Promocion } from '@/lib/promociones/types'

interface PromoCarouselProps {
  promociones: Promocion[]
  /** Milisegundos entre cada rotación automática. */
  rotationMs?: number
}

// Muestra las fotos de una promo de a una, con fade automático — en vez del
// collage anterior (todas juntas en una grilla), que achicaba demasiado
// las fotos secundarias y no dejaba apreciar cada una.
function ImageCarousel({
  imagenes,
  alt,
  rotationMs = 3000,
  contain = false,
}: {
  imagenes: string[]
  alt: string
  rotationMs?: number
  /** Para flyers de eventos: se ve completa, sin recortar (con fondo
   * desenfocado detrás en vez de barras vacías). Las fotos de promociones
   * siguen recortando a marco completo (object-cover), como siempre. */
  contain?: boolean
}) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (imagenes.length <= 1) return
    const id = setInterval(() => setIndex((i) => (i + 1) % imagenes.length), rotationMs)
    return () => clearInterval(id)
  }, [imagenes.length, rotationMs])

  const src = imagenes[index] || '/placeholder.svg'

  return (
    <div className={cn('relative h-full w-full', contain && 'bg-foreground')}>
      <AnimatePresence mode="sync">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          {contain && (
            <SmartImage
              src={src}
              alt=""
              aria-hidden="true"
              fill
              className="scale-110 object-cover opacity-60 blur-2xl"
              sizes="(max-width: 768px) 100vw, 48rem"
            />
          )}
          <SmartImage
            src={src}
            alt={imagenes.length > 1 ? `${alt} — imagen ${index + 1}` : alt}
            fill
            className={contain ? 'object-contain' : 'object-cover'}
            sizes="(max-width: 768px) 100vw, 48rem"
            priority={index === 0}
          />
        </motion.div>
      </AnimatePresence>

      {imagenes.length > 1 && (
        <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
          {imagenes.map((_, i) => (
            <span
              key={i}
              className={cn(
                'h-1.5 rounded-full transition-all',
                i === index ? 'w-5 bg-white' : 'w-1.5 bg-white/50',
              )}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function PromoCarousel({ promociones, rotationMs = 5000 }: PromoCarouselProps) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const promo = promociones[index]
  const cierreMs = proximoCierreMs(promo, new Date())

  const next = useCallback(
    () => setIndex((i) => (i + 1) % promociones.length),
    [promociones.length],
  )
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + promociones.length) % promociones.length),
    [promociones.length],
  )

  // Rotación automática — se pausa mientras el mouse está sobre el carrusel.
  useEffect(() => {
    if (promociones.length <= 1 || paused) return
    const id = setInterval(next, rotationMs)
    return () => clearInterval(id)
  }, [promociones.length, paused, rotationMs, next])

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={promo.id}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="relative h-72 w-full overflow-hidden bg-muted sm:h-96">
            <ImageCarousel
              imagenes={promo.imagenes}
              alt={promo.titulo}
              contain={promo.origen === 'evento'}
            />

            {promociones.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Promoción anterior"
                  className="absolute left-4 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Siguiente promoción"
                  className="absolute right-4 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>

          <div className="flex flex-col gap-3 p-8 text-left sm:p-10">
            <h3 className="text-2xl font-extrabold leading-tight text-foreground sm:text-4xl">
              {promo.titulo}
            </h3>
            <p className="line-clamp-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              {promo.descripcion}
            </p>
            {cierreMs !== null && (
              <PromoCountdown
                targetMs={cierreMs}
                variant={promo.origen === 'evento' ? 'evento' : 'promocion'}
              />
            )}
            {promo.link && (
              <Button
                variant="brand"
                size="pill-lg"
                className="mt-2 w-fit"
                nativeButton={false}
                render={<a href={promo.link} />}
              >
                {promo.origen === 'evento' ? 'Reservar' : 'Ver más'}
              </Button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {promociones.length > 1 && (
        <div className="flex justify-center gap-2 pb-6">
          {promociones.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Ir a la promoción ${i + 1}`}
              className={cn(
                'h-2 rounded-full transition-all',
                i === index ? 'w-8 bg-brand' : 'w-2 bg-border',
              )}
            />
          ))}
        </div>
      )}
    </div>
  )
}

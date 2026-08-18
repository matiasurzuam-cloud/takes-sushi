'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { SmartImage } from '@/components/ui/smart-image'

// Auto-rotación entre varias capturas de reseñas (archivos estáticos, ver
// testimonials-section.tsx) — mismo tratamiento de borde/brillo que antes,
// pero ahora dentro de un marco de proporción fija con object-contain, para
// que el cambio entre capturas de distinto tamaño no salte de alto.
export function ResenasCarousel({ imagenes }: { imagenes: string[] }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (imagenes.length <= 1) return
    const id = setInterval(() => setIndex((i) => (i + 1) % imagenes.length), 4500)
    return () => clearInterval(id)
  }, [imagenes.length])

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-3 rounded-[2.5rem] bg-gradient-to-br from-brand/30 via-accent/20 to-brand/30 blur-xl"
      />
      <div className="relative overflow-hidden rounded-[2rem] border-4 border-background shadow-2xl ring-1 ring-border">
        <div className="relative aspect-[3/2] w-full bg-card">
          {imagenes.map((src, i) => (
            <div
              key={src}
              className={cn(
                'absolute inset-0 transition-opacity duration-700 ease-in-out',
                i === index ? 'opacity-100' : 'pointer-events-none opacity-0',
              )}
            >
              <SmartImage
                src={src}
                alt={`Reseña de TAKE'S en Google ${i + 1}`}
                fill
                className="object-contain"
                sizes="(max-width: 640px) 100vw, 36rem"
                priority={i === 0}
              />
            </div>
          ))}
        </div>

        {imagenes.length > 1 && (
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
            {imagenes.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Ver reseña ${i + 1}`}
                className={cn(
                  'h-1.5 rounded-full transition-all',
                  i === index ? 'w-5 bg-brand' : 'w-1.5 bg-white/70',
                )}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

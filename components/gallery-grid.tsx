'use client'

import { useCallback, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { SmartImage } from '@/components/ui/smart-image'
import { cn } from '@/lib/utils'
import type { CategoriaGaleria, FotoGaleria } from '@/lib/content'

const CATEGORY_LABEL: Record<CategoriaGaleria, string> = {
  sushi: 'Sushi',
  cafe: 'Bebidas',
  local: 'Local',
}

// Una sola foto destacada (2×2) + el resto parejo (2×1) en una grilla de 6
// columnas: da el aire de mosaico sin arriesgar huecos. Probamos un patrón
// con más variedad de tamaños, pero con una cantidad de fotos que cambia
// (se cargan y sacan desde Supabase) un item alto sin suficientes vecinos
// chicos después deja un hueco que ni `grid-flow-dense` puede rellenar —
// con un solo destacado y el resto uniforme, la división por 6 siempre
// cierra perfecto, sea cual sea la cantidad de fotos.
function spanFor(index: number): string {
  return index === 0 ? 'lg:col-span-2 lg:row-span-2' : 'lg:col-span-2'
}

// Estas fotos son screenshots de Instagram (algunas de apenas ~420px de
// ancho), no las originales en alta resolución — con `object-cover` en
// posición "center" por defecto, las verticales (el trago de noche, el
// ceviche en lechuga) recortaban justo la parte con más info visual
// (el aderezo/la flor de palta arriba). Ajuste puntual por foto en vez de
// una regla general, porque cada composición es distinta.
const OBJECT_POSITION: Record<string, string> = {
  '/images/galeria/ceviche-lechuga.png': 'object-top',
}

// Ruido sutil en SVG (sin archivo externo) — ayuda a disimular la diferencia
// de nitidez entre fotos de calidades distintas dándoles una textura común,
// en vez de que cada una se vea "borrosa" a su manera.
function GrainOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}
    />
  )
}

// Visor a pantalla completa para ver una foto de la galería en grande, con
// flechas para recorrer el resto sin tener que cerrar y volver a abrir —
// mismo tratamiento de modal (backdrop + blur + botón X) que el resto del
// sitio (CartaModal, CheckoutModal, ClubQrPopup).
function Lightbox({
  fotos,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  fotos: FotoGaleria[]
  index: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose, onPrev, onNext])

  const foto = fotos[index]

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Ver foto en grande"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar"
        className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
      >
        <X className="h-5 w-5" />
      </button>

      {fotos.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onPrev()
            }}
            aria-label="Foto anterior"
            className="absolute left-2 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:left-4"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onNext()
            }}
            aria-label="Foto siguiente"
            className="absolute right-2 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:right-4"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative h-full max-h-[80vh] w-full max-w-4xl"
      >
        <SmartImage
          src={foto.imagen}
          alt={foto.alt}
          fill
          className="object-contain"
          sizes="(max-width: 1024px) 100vw, 56rem"
          priority
        />
      </div>

      <p className="absolute bottom-6 left-1/2 max-w-lg -translate-x-1/2 px-4 text-center text-sm text-white/80">
        {foto.alt}
      </p>
    </div>
  )
}

export function GalleryGrid({ fotos }: { fotos: FotoGaleria[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const goPrev = useCallback(
    () => setOpenIndex((i) => (i === null ? null : (i - 1 + fotos.length) % fotos.length)),
    [fotos.length],
  )
  const goNext = useCallback(
    () => setOpenIndex((i) => (i === null ? null : (i + 1) % fotos.length)),
    [fotos.length],
  )

  return (
    <>
      <div className="grid auto-rows-[160px] grid-cols-2 gap-1.5 sm:auto-rows-[190px] sm:grid-cols-3 lg:auto-rows-[170px] lg:grid-cols-6">
        {fotos.map((foto, i) => (
          <button
            type="button"
            key={foto.id}
            onClick={() => setOpenIndex(i)}
            aria-label={`Ver en grande: ${foto.alt}`}
            className={cn(
              'group relative overflow-hidden rounded-xl text-left',
              spanFor(i),
            )}
          >
            <SmartImage
              src={foto.imagen}
              alt={foto.alt}
              fill
              className={cn(
                'object-cover transition-transform duration-500 [filter:saturate(1.15)_contrast(1.06)_brightness(1.02)] group-hover:scale-105',
                OBJECT_POSITION[foto.imagen],
              )}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
            <GrainOverlay />

            {/* Viñeta pareja, siempre visible — unifica el tono entre
                fotos con luz e iluminación distintas y da un aire más
                "editorial" en vez de mostrarlas planas. */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/25 via-transparent to-transparent" />

            <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            {/* Sello de marca, siempre visible — el mismo look de las
                fotos que ya publican en Instagram. */}
            <span className="absolute bottom-2 left-2 h-7 w-7 overflow-hidden rounded-full shadow-md ring-2 ring-white/85">
              <SmartImage src="/images/logo.jpg" alt="" fill className="object-cover" sizes="28px" />
            </span>

            <span className="absolute right-2 top-2 rounded-full bg-black/50 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
              {CATEGORY_LABEL[foto.categoria]}
            </span>
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <Lightbox
          fotos={fotos}
          index={openIndex}
          onClose={() => setOpenIndex(null)}
          onPrev={goPrev}
          onNext={goNext}
        />
      )}
    </>
  )
}

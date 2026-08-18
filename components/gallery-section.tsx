import { Camera } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { EmptyState } from '@/components/ui/empty-state'
import { SmartImage } from '@/components/ui/smart-image'
import { cn } from '@/lib/utils'
import type { CategoriaGaleria, SiteContent } from '@/lib/content'

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

// Estas 9 fotos son screenshots de Instagram (algunas de apenas ~420px de
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

export function GallerySection({ content }: { content: SiteContent }) {
  const { galeria, contacto } = content
  const instagramHref = contacto.redes.instagram || `https://wa.me/${contacto.redes.whatsapp}`

  return (
    <section id="galeria" className="relative overflow-hidden bg-secondary/40 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-eyebrow">Galería</span>
          <h2 className="text-h2 mt-3">Un vistazo a TAKE&apos;S</h2>
          <p className="text-lead mt-4">Cada plato cuenta una historia.</p>
        </Reveal>
      </div>

      {galeria.length === 0 ? (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mt-12">
            <EmptyState
              icon={Camera}
              title="Todavía no hay fotos cargadas"
              description="Síguenos en Instagram para ver las últimas novedades y fotos reales del local."
              ctaLabel="Síguenos en Instagram"
              ctaHref={instagramHref}
            />
          </Reveal>
        </div>
      ) : (
        // Ancho mayor al resto de las secciones (max-w-7xl) a propósito:
        // es la franja "extensa" que se pidió, sin llegar a full-bleed
        // para que siga respirando en monitores muy anchos.
        <Reveal className="mx-auto mt-12 max-w-[100rem] px-4 sm:px-6 lg:px-8">
          <div className="grid auto-rows-[160px] grid-cols-2 gap-1.5 sm:auto-rows-[190px] sm:grid-cols-3 lg:auto-rows-[170px] lg:grid-cols-6">
            {galeria.map((foto, i) => (
              <div key={foto.id} className={cn('group relative overflow-hidden rounded-xl', spanFor(i))}>
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
              </div>
            ))}
          </div>

          {/* Franja de cierre, aparte del grid (no compite por espacio en el
              mosaico) — invita a seguir en Instagram en vez de repetir el
              texto decorativo fijo del banner original. */}
          <a
            href={instagramHref}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-1.5 flex items-center gap-4 overflow-hidden rounded-xl bg-gradient-to-r from-brand to-accent p-5 transition-transform duration-300 hover:-translate-y-1"
          >
            <Camera className="h-8 w-8 shrink-0 text-white" />
            <div>
              <p className="text-lg font-extrabold leading-tight text-white sm:text-xl">
                Síguenos en Instagram
              </p>
              <p className="text-xs text-white/80 sm:text-sm">
                Más fotos y novedades, todas las semanas.
              </p>
            </div>
          </a>
        </Reveal>
      )}
    </section>
  )
}

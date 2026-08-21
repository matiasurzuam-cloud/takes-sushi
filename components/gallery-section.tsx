import { Camera } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { EmptyState } from '@/components/ui/empty-state'
import { GalleryGrid } from '@/components/gallery-grid'
import type { SiteContent } from '@/lib/content'

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
          <GalleryGrid fotos={galeria} />

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

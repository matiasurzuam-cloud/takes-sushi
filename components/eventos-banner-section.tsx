import { existsSync } from 'node:fs'
import { join } from 'node:path'
import Image from 'next/image'
import { ArrowRight, Calendar, MapPin, PartyPopper } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { PromoCountdown } from '@/components/promo-popup/promo-countdown'
import { formatFechaEvento } from '@/lib/eventos/format'
import { eventosRepo } from '@/lib/eventos/store'
import { addOneDayISO, santiagoMidnightUtcMs } from '@/lib/timezone'

// Imagen de marca fija para este banner (diseñada a 1920x640, ver
// components/eventos-banner-section.tsx en el historial) — a diferencia de
// la foto propia de cada evento (que sigue viviendo en /admin/eventos y se
// usa en /eventos), acá siempre se muestra la misma pieza gráfica sin
// depender de qué evento esté cargado. Mismo patrón de extensión flexible
// que club-qr-popup: mientras no se suba el archivo, cae a la foto del
// evento en vez de romper.
function findBannerImage(): string | null {
  for (const ext of ['png', 'jpg', 'jpeg', 'webp']) {
    const src = `/images/eventos-banner/takes_banner_1920x640.${ext}`
    if (existsSync(join(process.cwd(), 'public', src))) return src
  }
  return null
}

// Banner del próximo evento en la home — mismo tratamiento "hero" que el
// de /club-takes (imagen + degradado + texto centrado + CTA), pero el
// efecto llamativo acá es la cuenta regresiva en vivo (PromoCountdown, ya
// usada en el pop-up de promociones) en vez de repetir el mismo brillo
// pulsante, para que ambos banners del principio de la página no se sientan
// idénticos. Se oculta solo si no hay ningún evento próximo — nunca
// promociona un evento que no existe.
export async function EventosBannerSection() {
  const [proximo] = await eventosRepo.getProximos()
  if (!proximo) return null

  const targetMs = santiagoMidnightUtcMs(addOneDayISO(proximo.fecha))
  const bannerImage = findBannerImage() ?? proximo.imagen

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <a
            href="/eventos"
            className="group relative block overflow-hidden rounded-3xl shadow-2xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_25px_70px_-15px_var(--brand)]"
          >
            <div className="relative h-[340px] w-full sm:h-[400px]">
              <Image
                src={bannerImage}
                alt={proximo.titulo}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 1280px) 100vw, 1280px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10" />
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
                <PartyPopper className="h-3.5 w-3.5 text-brand" />
                Próximo evento
              </span>
              <h2 className="mt-5 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
                {proximo.titulo}
              </h2>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-sm font-semibold text-white/90 sm:text-base">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {formatFechaEvento(proximo.fecha, proximo.hora)}
                </span>
                {proximo.ubicacion && (
                  <span className="inline-flex items-center gap-1.5 text-white/75">
                    <MapPin className="h-4 w-4" />
                    {proximo.ubicacion}
                  </span>
                )}
              </div>
              <PromoCountdown targetMs={targetMs} variant="evento" className="mt-4" />
              <span className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-brand-foreground shadow-lg shadow-brand/30 transition-transform duration-300 group-hover:scale-105">
                Ver evento <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </a>
        </Reveal>
      </div>
    </section>
  )
}

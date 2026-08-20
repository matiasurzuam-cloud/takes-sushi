import type { Metadata } from 'next'
import { Calendar, MapPin, PartyPopper } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { FloatingWhatsapp } from '@/components/floating-whatsapp'
import { Reveal } from '@/components/reveal'
import { EventoReservar } from '@/components/evento-reservar'
import { EmptyState } from '@/components/ui/empty-state'
import { SmartImage } from '@/components/ui/smart-image'
import { formatFechaEvento } from '@/lib/eventos/format'
import { eventosRepo } from '@/lib/eventos/store'
import { getContent } from '@/lib/content'

export const metadata: Metadata = {
  title: "Eventos — TAKE'S Sushi & Coffee",
  description: 'Próximos eventos, noches temáticas y celebraciones especiales en TAKE\'S.',
}

// Mismo criterio que la home (ver app/page.tsx): estos datos cambian poco
// como para necesitar fetch en vivo del lado del cliente, así que un
// revalidate corto alcanza sin perder frescura perceptible.
export const revalidate = 60

export default async function EventosPage() {
  const [eventos, pasados, content] = await Promise.all([
    eventosRepo.getProximos(),
    eventosRepo.getPasados(),
    getContent(),
  ])
  const { contacto } = content
  const instagramHref = contacto.redes.instagram || `https://wa.me/${contacto.redes.whatsapp}`
  // El más próximo va grande y destacado — el resto (si hay más) sigue en
  // la lista compacta de siempre debajo.
  const [proximo, ...resto] = eventos

  return (
    <>
      <SiteHeader />
      <main className="pt-28 sm:pt-32">
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <Reveal className="mx-auto max-w-2xl text-center">
              <span className="text-eyebrow">Catálogo</span>
              <h1 className="text-h2 mt-3">Próximos eventos</h1>
              <p className="text-lead mt-4">
                Todas las noches temáticas, música en vivo y celebraciones especiales que
                tenemos preparadas.
              </p>
            </Reveal>

            {!proximo ? (
              <Reveal className="mt-12">
                <EmptyState
                  icon={PartyPopper}
                  title="Todavía no hay eventos programados"
                  description="Síguenos en Instagram para enterarte apenas anunciemos el próximo."
                  ctaLabel="Síguenos en Instagram"
                  ctaHref={instagramHref}
                />
              </Reveal>
            ) : (
              <>
                <Reveal className="mt-12">
                  <div className="group overflow-hidden rounded-3xl border border-border shadow-xl transition-shadow duration-300 hover:shadow-2xl">
                    {/* Sin fill/overlay/fondo: la imagen se muestra a su
                        proporción real (w-full h-auto) — la tarjeta se
                        adapta a ella en vez de forzarla a un marco fijo. El
                        único efecto es un zoom suave al pasar el mouse. */}
                    <div className="overflow-hidden">
                      <SmartImage
                        src={proximo.imagen}
                        alt={proximo.titulo}
                        width={1600}
                        height={1000}
                        sizes="(max-width: 1024px) 100vw, 64rem"
                        className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                        priority
                      />
                    </div>
                    <div className="bg-card p-6 sm:p-10">
                      <span className="inline-flex items-center rounded-full bg-brand/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand">
                        Próximo evento
                      </span>
                      <h2 className="mt-3 text-3xl font-extrabold leading-tight text-foreground sm:text-5xl">
                        {proximo.titulo}
                      </h2>
                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm font-semibold text-brand sm:text-base">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          {formatFechaEvento(proximo.fecha, proximo.hora)}
                        </span>
                        {proximo.ubicacion && (
                          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            {proximo.ubicacion}
                          </span>
                        )}
                      </div>
                      <p className="mt-3 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
                        {proximo.descripcion}
                      </p>
                      <div className="mt-5 flex flex-wrap items-center gap-4">
                        {proximo.precio && (
                          <span className="text-sm font-semibold text-foreground">{proximo.precio}</span>
                        )}
                        <EventoReservar
                          evento={proximo}
                          whatsappNumber={contacto.redes.whatsapp}
                          size="pill-lg"
                        />
                      </div>
                    </div>
                  </div>
                </Reveal>

                {resto.length > 0 && (
                  <div className="mt-8 space-y-6">
                    {resto.map((evento, i) => {
                      return (
                        <Reveal key={evento.id} delay={i * 60}>
                          <div className="flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm sm:flex-row">
                            <div className="relative h-56 w-full shrink-0 sm:h-auto sm:w-72">
                              <SmartImage
                                src={evento.imagen}
                                alt={evento.titulo}
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 100vw, 18rem"
                              />
                            </div>
                            <div className="flex flex-1 flex-col gap-3 p-6 sm:p-8">
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-semibold text-brand">
                                <span className="inline-flex items-center gap-1.5">
                                  <Calendar className="h-4 w-4" />
                                  {formatFechaEvento(evento.fecha, evento.hora)}
                                </span>
                                {evento.ubicacion && (
                                  <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                                    <MapPin className="h-4 w-4" />
                                    {evento.ubicacion}
                                  </span>
                                )}
                              </div>
                              <h3 className="text-h3">{evento.titulo}</h3>
                              <p className="flex-1 text-pretty leading-relaxed text-muted-foreground">
                                {evento.descripcion}
                              </p>
                              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                                {evento.precio && (
                                  <span className="text-sm font-semibold text-foreground">
                                    {evento.precio}
                                  </span>
                                )}
                                <EventoReservar
                                  evento={evento}
                                  whatsappNumber={contacto.redes.whatsapp}
                                  size="pill"
                                  className="ml-auto w-fit"
                                />
                              </div>
                            </div>
                          </div>
                        </Reveal>
                      )
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {pasados.length > 0 && (
          <section className="border-t border-border bg-secondary/40 py-12 sm:py-16">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <Reveal className="mx-auto max-w-2xl text-center">
                <span className="text-eyebrow">Recap</span>
                <h2 className="text-h2 mt-3">Así han sido nuestros eventos</h2>
                <p className="text-lead mt-4">
                  Un vistazo a las celebraciones que ya vivimos en TAKE&apos;S.
                </p>
              </Reveal>

              <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {pasados.map((evento, i) => (
                  <Reveal key={evento.id} delay={i * 50}>
                    <div className="group relative aspect-square overflow-hidden rounded-2xl">
                      <SmartImage
                        src={evento.imagen}
                        alt={evento.titulo}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/10 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-3">
                        <p className="truncate text-sm font-bold text-white">{evento.titulo}</p>
                        <p className="text-xs text-white/70">{formatFechaEvento(evento.fecha)}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <SiteFooter content={content} />
      <FloatingWhatsapp whatsappNumber={content.contacto.redes.whatsapp} />
    </>
  )
}

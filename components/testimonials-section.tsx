import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { Star, Quote, Camera, MessageCircle, PenLine } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Reveal } from '@/components/reveal'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { SmartImage } from '@/components/ui/smart-image'
import { formatFechaRelativa } from '@/lib/relative-date'
import type { FuenteResena, SiteContent } from '@/lib/content'

// Captura de reseñas (ej. la ficha de Google) como archivo estático del
// proyecto — a propósito NO pasa por Supabase: se reemplaza directo en
// public/ (mismo criterio que hero-sushi.png/about-chef.png) y queda
// permanente en el sitio. `existsSync` corre en el servidor (este
// componente no lleva 'use client'), así que mientras no exista el
// archivo, esta tarjeta simplemente no se muestra — no rompe el build.
const RESENAS_IMAGEN = '/reseña-hero.png'
const tieneCapturaResenas = existsSync(join(process.cwd(), 'public', RESENAS_IMAGEN))

// Logo oficial de Google (4 colores) — se usa como badge de "fuente" en
// cada reseña, igual que hacen los sitios de reserva/reviews.
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 18 18" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
      />
    </svg>
  )
}

const FUENTE_LABEL: Record<FuenteResena, string> = {
  google: 'Reseña de Google',
  instagram: 'Reseña de Instagram',
}

function FuenteBadge({ fuente }: { fuente: FuenteResena }) {
  return (
    <span
      className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-border"
      title={FUENTE_LABEL[fuente]}
      aria-label={FUENTE_LABEL[fuente]}
    >
      {fuente === 'google' ? (
        <GoogleIcon className="h-3 w-3" />
      ) : (
        <Camera className="h-3 w-3 text-accent" />
      )}
    </span>
  )
}

function initialsFrom(nombre: string) {
  return nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

// Datos estructurados (schema.org) para habilitar estrellas en los
// resultados de búsqueda de Google. Solo se emite con datos reales: nunca
// con rating/cantidad en cero, y las reseñas son siempre las que carga el
// dueño del sitio desde Google/Instagram — nunca inventadas (Google
// prohíbe explícitamente las reseñas "self-serving").
function ReviewStructuredData({ content }: { content: SiteContent }) {
  const { resenas, confianza, contacto } = content

  const promedioCalculado =
    resenas.length > 0 ? resenas.reduce((sum, r) => sum + r.rating, 0) / resenas.length : 0
  const ratingValue = confianza.rating > 0 ? confianza.rating : promedioCalculado
  const reviewCount = confianza.resenasCount > 0 ? confianza.resenasCount : resenas.length

  if (ratingValue === 0 && resenas.length === 0) return null

  const restaurant: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: "TAKE'S Sushi & Coffee",
    servesCuisine: ['Sushi', 'Café'],
  }

  if (contacto.direccion.length > 0) {
    restaurant.address = { '@type': 'PostalAddress', streetAddress: contacto.direccion.join(', ') }
  }
  if (contacto.telefono) restaurant.telephone = contacto.telefono

  if (ratingValue > 0) {
    restaurant.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: Number(ratingValue.toFixed(1)),
      reviewCount,
      bestRating: 5,
    }
  }

  if (resenas.length > 0) {
    restaurant.review = resenas.map((r) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r.nombre },
      datePublished: r.fecha,
      reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5 },
      reviewBody: r.comentario,
    }))
  }

  return (
    // eslint-disable-next-line react/no-danger
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurant) }} />
  )
}

// Promedio general arriba de las tarjetas — solo si hay un rating real de
// Google Business cargado (content.confianza.rating). Enlaza a las reseñas
// completas si tenemos el link.
function RatingSummary({ content }: { content: SiteContent }) {
  const { confianza, contacto } = content
  if (confianza.rating === 0) return null

  const Wrapper = contacto.redes.google ? 'a' : 'div'
  const wrapperProps = contacto.redes.google
    ? { href: contacto.redes.google, target: '_blank', rel: 'noopener noreferrer' }
    : {}

  return (
    <Reveal className="mx-auto mt-8 w-fit">
      <Wrapper
        {...wrapperProps}
        className={cn(
          'flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-3 shadow-sm',
          contacto.redes.google && 'transition-colors hover:border-brand/40 hover:bg-brand/5',
        )}
      >
        <GoogleIcon className="h-7 w-7 shrink-0" />
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-extrabold text-foreground">
            {confianza.rating.toFixed(1)}
          </span>
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, s) => (
              <Star
                key={s}
                className={cn(
                  'h-4 w-4',
                  s < Math.round(confianza.rating) ? 'fill-accent text-accent' : 'text-border',
                )}
              />
            ))}
          </div>
        </div>
        {confianza.resenasCount > 0 && (
          <span className="text-sm text-muted-foreground">
            basado en {confianza.resenasCount} reseñas
          </span>
        )}
      </Wrapper>
    </Reveal>
  )
}

export function TestimonialsSection({ content }: { content: SiteContent }) {
  const { resenas, contacto } = content
  const whatsappHref = `https://wa.me/${contacto.redes.whatsapp}`

  return (
    <section id="opiniones" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ReviewStructuredData content={content} />

        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-eyebrow">Opiniones</span>
          <h2 className="text-h2 mt-3">Lo que dicen nuestros clientes</h2>
          <p className="text-lead mt-4">Las reseñas generan confianza.</p>
        </Reveal>

        {contacto.redes.google && (
          <Reveal delay={40} className="mt-5 flex justify-center">
            <Button
              variant="outline"
              size="pill"
              nativeButton={false}
              render={<a href={contacto.redes.google} target="_blank" rel="noopener noreferrer" />}
            >
              <PenLine className="h-4 w-4" /> Danos tu opinión en Google
            </Button>
          </Reveal>
        )}

        <RatingSummary content={content} />

        {tieneCapturaResenas ? (
          <Reveal className="mx-auto mt-12 max-w-xl">
            {/* Sin fill/altura fija: la tarjeta se adapta a la proporción
                real de la captura (h-auto), sin espacios vacíos alrededor.
                El borde grueso + el brillo de fondo rompen el look de
                "screenshot pegado" en vez de solo redondear esquinas. */}
            <div className="relative">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-3 rounded-[2.5rem] bg-gradient-to-br from-brand/30 via-accent/20 to-brand/30 blur-xl"
              />
              <div className="relative overflow-hidden rounded-[2rem] border-4 border-background shadow-2xl ring-1 ring-border">
                <SmartImage
                  src={RESENAS_IMAGEN}
                  alt="Reseñas de TAKE'S en Google"
                  width={1125}
                  height={754}
                  className="h-auto w-full"
                  sizes="(max-width: 640px) 100vw, 36rem"
                />
              </div>
            </div>
          </Reveal>
        ) : resenas.length === 0 ? (
          <Reveal className="mt-12">
            <EmptyState
              icon={MessageCircle}
              title="Todavía no hay reseñas publicadas"
              description="Sé de los primeros en contarnos tu experiencia — escríbenos por WhatsApp."
              ctaLabel="Escríbenos por WhatsApp"
              ctaHref={whatsappHref}
            />
          </Reveal>
        ) : resenas.length === 1 ? (
          // Con una sola reseña real, una tarjeta chica de 1/3 en una
          // grilla de 3 columnas se ve perdida — mientras se suman más, la
          // mostramos como una pieza destacada en vez de eso.
          <Reveal className="mx-auto mt-12 max-w-2xl">
            <figure className="relative overflow-hidden rounded-[2rem] border border-brand/20 bg-card p-10 text-center shadow-2xl sm:p-14">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-20 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-brand/15 blur-3xl"
              />
              <Quote className="relative mx-auto h-12 w-12 text-brand/50" />
              <div className="relative mt-5 flex justify-center gap-1">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star
                    key={s}
                    className={cn(
                      'h-5 w-5',
                      s < resenas[0].rating ? 'fill-accent text-accent' : 'text-border',
                    )}
                  />
                ))}
              </div>
              <blockquote className="relative mt-6 text-pretty text-lg leading-relaxed text-foreground sm:text-xl">
                &ldquo;{resenas[0].comentario}&rdquo;
              </blockquote>
              <figcaption className="relative mt-8 flex flex-col items-center gap-3">
                <span className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand/15 text-lg font-bold text-brand ring-4 ring-background">
                  {resenas[0].avatarUrl ? (
                    <SmartImage
                      src={resenas[0].avatarUrl}
                      alt={resenas[0].nombre}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  ) : (
                    initialsFrom(resenas[0].nombre)
                  )}
                </span>
                <div>
                  <div className="flex items-center justify-center gap-1.5">
                    <p className="font-bold text-foreground">{resenas[0].nombre}</p>
                    <FuenteBadge fuente={resenas[0].fuente} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatFechaRelativa(resenas[0].fecha)}
                  </p>
                </div>
              </figcaption>
            </figure>
          </Reveal>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {resenas.map((resena, i) => (
              <Reveal key={resena.id} delay={i * 100}>
                <figure className="flex h-full flex-col rounded-3xl border border-border bg-card p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
                  <Quote className="h-8 w-8 text-brand/40" />
                  <div className="mt-4 flex gap-1">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star
                        key={s}
                        className={cn(
                          'h-4 w-4',
                          s < resena.rating ? 'fill-accent text-accent' : 'text-border',
                        )}
                      />
                    ))}
                  </div>
                  <blockquote className="mt-4 flex-1 text-pretty text-sm leading-relaxed text-muted-foreground">
                    &ldquo;{resena.comentario}&rdquo;
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                    <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand/15 text-sm font-bold text-brand">
                      {resena.avatarUrl ? (
                        <SmartImage
                          src={resena.avatarUrl}
                          alt={resena.nombre}
                          fill
                          className="object-cover"
                          sizes="44px"
                        />
                      ) : (
                        initialsFrom(resena.nombre)
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate text-sm font-bold text-foreground">{resena.nombre}</p>
                        <FuenteBadge fuente={resena.fuente} />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatFechaRelativa(resena.fecha)}
                      </p>
                    </div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

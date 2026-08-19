import Image from 'next/image'
import { Star, Leaf, Clock, ChevronDown, MessageCircle, Sparkles } from 'lucide-react'
import { PromoBanner } from '@/components/promo-banner'
import { Button } from '@/components/ui/button'
import { OpenNowBadge } from '@/components/open-now-badge'
import { HeroCartaButton } from '@/components/hero-carta-button'
import type { Confianza, SiteContent } from '@/lib/content'

// Badge de confianza junto al CTA principal. Prioriza un rating real (ej.
// de Google) si está cargado; si no, un texto libre (ej. "+500 pedidos este
// mes"); si no hay ninguno de los dos, cae en un mensaje neutro que sigue
// siendo cierto sin inventar cifras que todavía no tenemos.
function TrustBadge({ confianza }: { confianza: Confianza }) {
  if (confianza.rating > 0) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
        <Star className="h-3.5 w-3.5 fill-accent text-accent" />
        {confianza.rating.toFixed(1)}
        {confianza.resenasCount > 0 && (
          <span className="text-white/60">({confianza.resenasCount} reseñas)</span>
        )}
      </span>
    )
  }

  if (confianza.texto) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
        <Sparkles className="h-3.5 w-3.5 text-brand" />
        {confianza.texto}
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
      <MessageCircle className="h-3.5 w-3.5 text-brand" />
      Respuesta inmediata por WhatsApp
    </span>
  )
}

export function HeroSection({ content }: { content: SiteContent }) {
  return (
    <section
      id="inicio"
      className="relative flex min-h-screen items-center overflow-hidden"
    >
      <div className="absolute inset-0">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/images/hero-sushi.png"
            alt="Variedad de sushi fresco preparado en TAKE'S"
            fill
            priority
            className="animate-kenburns object-cover"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-scrim/94 via-scrim/82 to-scrim/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

        {/* Decorative floating glows */}
        <div className="animate-floaty absolute -left-16 top-1/4 h-72 w-72 rounded-full bg-brand/20 blur-3xl" />
        <div
          className="animate-floaty absolute right-0 top-1/2 h-80 w-80 rounded-full bg-accent/15 blur-3xl"
          style={{ animationDelay: '1.5s' }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-28 pb-16 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
          <div className="max-w-2xl">
            <span
              className="animate-fade-in-up inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm"
              style={{ animationDelay: '0.1s' }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse-soft" />
              Sushi &amp; Coffee
            </span>

            <h1
              className="animate-fade-in-up mt-6 text-pretty text-4xl font-extrabold leading-[1.05] text-white sm:text-6xl lg:text-7xl"
              style={{ animationDelay: '0.22s' }}
            >
              Sabor fresco,
              <span className="block text-brand">hecho al momento.</span>
            </h1>

            <p
              className="animate-fade-in-up mt-6 max-w-xl text-pretty text-base leading-relaxed text-white/80 sm:text-lg"
              style={{ animationDelay: '0.34s' }}
            >
              En TAKE&apos;S combinamos sushi de autor con café de especialidad.
              Ingredientes frescos, preparación artesanal y una experiencia pensada
              para disfrutar en cada bocado.
            </p>

            <div
              className="animate-fade-in-up mt-9 flex flex-col gap-4"
              style={{ animationDelay: '0.46s' }}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button
                  variant="brand"
                  size="pill-lg"
                  className="shadow-2xl shadow-brand/40 hover:shadow-brand/60"
                  nativeButton={false}
                  render={<a href="#contacto" />}
                >
                  <MessageCircle className="h-5 w-5" /> Hacer pedido
                </Button>
                <HeroCartaButton />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <TrustBadge confianza={content.confianza} />
                <OpenNowBadge horarioSemanal={content.contacto.horarioSemanal} />
              </div>
            </div>

            <dl
              className="animate-fade-in-up mt-10 grid max-w-lg grid-cols-3 gap-4"
              style={{ animationDelay: '0.58s' }}
            >
              {[
                { icon: Star, label: 'Calidad premium', value: 'Selección diaria' },
                { icon: Leaf, label: 'Opciones veganas', value: 'Disponibles' },
                { icon: Clock, label: 'Listo en minutos', value: 'Al instante' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:bg-white/10 sm:p-4"
                >
                  <item.icon className="h-5 w-5 text-brand" />
                  <dt className="mt-2 text-sm font-semibold text-white">
                    {item.label}
                  </dt>
                  <dd className="text-xs text-white/60">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="flex justify-center lg:justify-end">
            <PromoBanner />
          </div>
        </div>
      </div>

      <a
        href="#nosotros"
        aria-label="Bajar a la siguiente sección"
        className="animate-fade-in absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-1 text-white/60 transition-colors hover:text-white sm:flex"
        style={{ animationDelay: '1s' }}
      >
        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.3em]">
          Descubre más
        </span>
        <ChevronDown className="animate-bounce-y h-5 w-5" />
      </a>
    </section>
  )
}

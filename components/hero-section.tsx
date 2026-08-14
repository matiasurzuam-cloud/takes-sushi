import Image from 'next/image'
import { Star, Leaf, Clock, ChevronDown } from 'lucide-react'
import { PromoBanner } from '@/components/promo-banner'

export function HeroSection() {
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
        <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.16_0.02_235/0.94)] via-[oklch(0.16_0.02_235/0.82)] to-[oklch(0.16_0.02_235/0.55)]" />
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
              className="animate-fade-in-up mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
              style={{ animationDelay: '0.46s' }}
            >
              <a
                href="#carta"
                className="group inline-flex items-center justify-center rounded-full bg-brand px-8 py-3.5 text-base font-semibold text-brand-foreground shadow-xl shadow-brand/30 transition-all hover:-translate-y-0.5 hover:shadow-brand/50"
              >
                Ver la carta
              </a>
              <a
                href="#promociones"
                className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/5 px-8 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-white/15"
              >
                Promociones
              </a>
            </div>

            <dl
              className="animate-fade-in-up mt-12 grid max-w-lg grid-cols-3 gap-4"
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

import Image from 'next/image'
import { Star, Leaf, Clock } from 'lucide-react'

export function HeroSection() {
  return (
    <section
      id="inicio"
      className="relative flex min-h-screen items-center overflow-hidden"
    >
      <div className="absolute inset-0">
        <Image
          src="/images/hero-sushi.png"
          alt="Variedad de sushi fresco preparado en TAKE'S"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.16_0.02_235/0.92)] via-[oklch(0.16_0.02_235/0.78)] to-[oklch(0.16_0.02_235/0.35)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-28 pb-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            Sushi &amp; Coffee
          </span>

          <h1 className="mt-6 text-pretty text-4xl font-extrabold leading-[1.05] text-white sm:text-6xl lg:text-7xl">
            Sabor fresco,
            <span className="block text-brand">hecho al momento.</span>
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-white/80 sm:text-lg">
            En TAKE&apos;S combinamos sushi de autor con café de especialidad.
            Ingredientes frescos, preparación artesanal y una experiencia pensada
            para disfrutar en cada bocado.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#carta"
              className="inline-flex items-center justify-center rounded-full bg-brand px-8 py-3.5 text-base font-semibold text-brand-foreground shadow-xl shadow-brand/30 transition-all hover:-translate-y-0.5 hover:shadow-brand/50"
            >
              Ver la carta
            </a>
            <a
              href="#promociones"
              className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/5 px-8 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/15"
            >
              Promociones
            </a>
          </div>

          <dl className="mt-12 grid max-w-lg grid-cols-3 gap-4">
            {[
              { icon: Star, label: 'Calidad premium', value: 'Selección diaria' },
              { icon: Leaf, label: 'Opciones veganas', value: 'Disponibles' },
              { icon: Clock, label: 'Listo en minutos', value: 'Al instante' },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm sm:p-4"
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
      </div>
    </section>
  )
}

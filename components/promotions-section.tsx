import Image from 'next/image'
import { Tag, Gift, CalendarDays } from 'lucide-react'
import { Reveal } from '@/components/reveal'

const slots = [
  {
    icon: Gift,
    title: 'Combo para compartir',
    hint: 'Espacio reservado para tu promoción destacada.',
  },
  {
    icon: CalendarDays,
    title: 'Promo del día',
    hint: 'Aquí podrás mostrar ofertas por día de la semana.',
  },
  {
    icon: Tag,
    title: 'Descuentos especiales',
    hint: 'Reservado para cupones y precios especiales.',
  },
]

export function PromotionsSection() {
  return (
    <section id="promociones" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-[0.25em] text-accent">
            Promociones
          </span>
          <h2 className="mt-3 text-balance text-3xl font-extrabold leading-tight text-foreground sm:text-4xl lg:text-5xl">
            Ofertas que vas a amar
          </h2>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
            Esta sección está lista para recibir tus promociones reales. Aquí
            destacaremos combos, descuentos y ofertas por temporada.
          </p>
        </Reveal>

        {/* Featured promo */}
        <Reveal className="mt-12">
          <div className="grid overflow-hidden rounded-[2rem] border border-border bg-card shadow-xl transition-shadow duration-300 hover:shadow-2xl lg:grid-cols-2">
            <div className="relative min-h-64 lg:min-h-full">
              <Image
                src="/images/promo-platter.png"
                alt="Tabla de sushi para compartir"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-accent-foreground shadow-lg">
                Destacado
              </span>
            </div>
            <div className="flex flex-col justify-center gap-5 p-8 sm:p-12">
              <h3 className="text-2xl font-extrabold leading-tight text-foreground sm:text-3xl">
                Tu promoción principal aquí
              </h3>
              <p className="text-pretty text-base leading-relaxed text-muted-foreground">
                Reemplaza este bloque con tu oferta estrella: una tabla para
                compartir, un combo del día o el descuento que quieras destacar.
                El diseño se adapta automáticamente a tu contenido.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center justify-center rounded-full bg-brand px-7 py-3 text-sm font-semibold text-brand-foreground shadow-lg shadow-brand/25">
                  Pedir promo
                </span>
                <span className="inline-flex items-center justify-center rounded-full border border-border px-7 py-3 text-sm font-semibold text-foreground">
                  Ver condiciones
                </span>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Promo slots */}
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {slots.map((slot, i) => (
            <Reveal key={slot.title} delay={i * 100}>
              <div className="flex h-full flex-col items-start gap-4 rounded-3xl border border-dashed border-brand/40 bg-brand/5 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-brand hover:bg-brand/10">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-brand-foreground">
                  <slot.icon className="h-6 w-6" />
                </span>
                <h3 className="text-lg font-bold text-foreground">
                  {slot.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {slot.hint}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

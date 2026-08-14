import { Star, Quote } from 'lucide-react'
import { Reveal } from '@/components/reveal'

const testimonials = [
  {
    name: 'Cliente satisfecho',
    role: 'Reseña destacada',
    quote:
      'Este espacio está listo para mostrar las opiniones reales de tus clientes. El sushi siempre llega fresco y bien presentado.',
    initials: 'CS',
  },
  {
    name: 'Opinión de cliente',
    role: 'Reseña destacada',
    quote:
      'Reemplaza estos textos con comentarios verídicos. La atención y la calidad hacen que valga totalmente la pena volver.',
    initials: 'OC',
  },
  {
    name: 'Comentario real',
    role: 'Reseña destacada',
    quote:
      'Aquí podrás incluir testimonios verificados. Los rolls son deliciosos y el café acompaña perfecto cada pedido.',
    initials: 'CR',
  },
]

export function TestimonialsSection() {
  return (
    <section id="opiniones" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-[0.25em] text-accent">
            Opiniones
          </span>
          <h2 className="mt-3 text-balance text-3xl font-extrabold leading-tight text-foreground sm:text-4xl lg:text-5xl">
            Lo que dicen nuestros clientes
          </h2>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
            Las reseñas generan confianza. Sustituye estos ejemplos por los
            comentarios reales de quienes ya probaron TAKE&apos;S.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 100}>
              <figure className="flex h-full flex-col rounded-3xl border border-border bg-card p-7 shadow-sm transition-shadow hover:shadow-lg">
                <Quote className="h-8 w-8 text-brand/40" />
                <div className="mt-4 flex gap-1">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star
                      key={s}
                      className="h-4 w-4 fill-accent text-accent"
                    />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-pretty text-sm leading-relaxed text-muted-foreground">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand/15 text-sm font-bold text-brand">
                    {t.initials}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

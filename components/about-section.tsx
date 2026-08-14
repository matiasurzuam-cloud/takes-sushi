import Image from 'next/image'
import { Fish, Coffee, Sparkles } from 'lucide-react'
import { Reveal } from '@/components/reveal'

const pillars = [
  {
    icon: Fish,
    title: 'Sushi de autor',
    description:
      'Rolls, hosomakis y combinaciones únicas preparados con técnica y dedicación.',
  },
  {
    icon: Coffee,
    title: 'Café de especialidad',
    description:
      'El complemento perfecto: un café bien hecho para acompañar tu pedido.',
  },
  {
    icon: Sparkles,
    title: 'Siempre fresco',
    description:
      'Trabajamos con insumos seleccionados para garantizar calidad en cada plato.',
  },
]

export function AboutSection() {
  return (
    <section id="nosotros" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-2xl">
              <Image
                src="/images/about-chef.png"
                alt="Chef de TAKE'S preparando sushi fresco"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="absolute -bottom-6 -right-2 hidden rounded-2xl bg-brand px-6 py-5 text-brand-foreground shadow-xl sm:block">
              <p className="text-3xl font-extrabold">100%</p>
              <p className="text-sm font-medium">Hecho al momento</p>
            </div>
            <div className="absolute -left-4 top-8 hidden h-20 w-20 animate-floaty rounded-full bg-accent/90 lg:block" />
          </Reveal>

          <div>
            <Reveal>
              <span className="text-sm font-bold uppercase tracking-[0.25em] text-accent">
                Nosotros
              </span>
              <h2 className="mt-3 text-balance text-3xl font-extrabold leading-tight text-foreground sm:text-4xl lg:text-5xl">
                Pasión por el sushi, amor por el detalle
              </h2>
              <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                En TAKE&apos;S creemos que comer bien es una experiencia
                completa. Cada roll se prepara con cuidado, combinando sabores
                frescos y presentaciones que enamoran. Y porque sabemos que un
                buen café lo hace todo mejor, sumamos una barra de especialidad
                para acompañar cada momento.
              </p>
            </Reveal>

            <div className="mt-10 grid gap-5 sm:grid-cols-3 lg:grid-cols-1 lg:gap-4">
              {pillars.map((pillar, i) => (
                <Reveal key={pillar.title} delay={i * 100}>
                  <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand/15 text-brand">
                      <pillar.icon className="h-6 w-6" />
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-foreground">
                        {pillar.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

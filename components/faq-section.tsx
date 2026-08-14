'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Reveal } from '@/components/reveal'

const faqs = [
  {
    q: '¿Cómo puedo hacer un pedido?',
    a: 'Muy pronto podrás pedir directamente desde la web, por WhatsApp o Instagram. Por ahora, esta sección está lista para integrar esos canales.',
  },
  {
    q: '¿Tienen opciones veganas?',
    a: 'Sí. Contamos con rolls veganos elaborados con ingredientes frescos como palmito, palta, champiñón y pepino. Búscalos con la etiqueta "Vegano" en la carta.',
  },
  {
    q: '¿Hacen delivery?',
    a: 'Estamos preparando nuestro sistema de pedidos y delivery. La estructura del sitio ya está pensada para incorporar pagos y entregas más adelante.',
  },
  {
    q: '¿El café es de especialidad?',
    a: 'Así es. Complementamos nuestra carta de sushi con café de especialidad, ideal para acompañar cualquier pedido.',
  },
  {
    q: '¿Puedo personalizar mi roll?',
    a: 'Varios de nuestros rolls California puedes pedirlos envueltos en sésamo, ciboulette, merkén o Takis según tu preferencia.',
  },
]

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="relative bg-secondary/40 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <span className="text-sm font-bold uppercase tracking-[0.25em] text-accent">
            Preguntas frecuentes
          </span>
          <h2 className="mt-3 text-balance text-3xl font-extrabold leading-tight text-foreground sm:text-4xl lg:text-5xl">
            Resolvemos tus dudas
          </h2>
        </Reveal>

        <div className="mt-12 space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = open === i
            return (
              <Reveal key={faq.q} delay={i * 60}>
                <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="text-base font-semibold text-foreground">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={cn(
                        'h-5 w-5 shrink-0 text-brand transition-transform duration-300',
                        isOpen && 'rotate-180',
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      'grid transition-all duration-300 ease-out',
                      isOpen
                        ? 'grid-rows-[1fr] opacity-100'
                        : 'grid-rows-[0fr] opacity-0',
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

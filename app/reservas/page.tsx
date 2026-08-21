import type { Metadata } from 'next'
import { Calendar } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { FloatingSocial } from '@/components/floating-social'
import { Reveal } from '@/components/reveal'
import { ReservaForm } from '@/components/reserva-form'
import { SmartImage } from '@/components/ui/smart-image'
import { getContent } from '@/lib/content'

export const metadata: Metadata = {
  title: "Reservas para eventos y celebraciones | TAKE'S Sushi & Coffee",
  description:
    'Reserva tu mesa en TAKE\'S para cumpleaños, eventos de empresa, after office, reuniones y desayunos.',
}

// Sin esto quedaba 100% estática (sin `revalidate` ni `dynamic`, Next la
// trata como SSG puro) — nunca se habría refrescado tras el primer build.
export const revalidate = 60

export default async function ReservasPage() {
  const content = await getContent()

  return (
    <>
      <SiteHeader />
      <main className="pt-24 sm:pt-28">
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              {/* Dos tarjetas independientes en vez de una sola compartiendo
                  altura: así cada una se ajusta a su propio contenido (la
                  foto a su proporción real, el formulario a lo que mida el
                  calendario) sin dejar espacio vacío cuando una es más alta
                  que la otra. */}
              <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
                <div className="overflow-hidden rounded-3xl border border-border shadow-2xl">
                  <SmartImage
                    src="/images/galeria/terraza.png"
                    alt="Terraza de TAKE'S lista para recibir un evento"
                    width={896}
                    height={1195}
                    className="h-auto w-full"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                </div>

                <div className="flex flex-col gap-6 rounded-3xl border border-border bg-foreground p-8 text-background shadow-2xl sm:p-12">
                  <div>
                    <span className="text-eyebrow text-brand">Reservas</span>
                    <h1 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">
                      Reservas para tu evento
                    </h1>
                    <p className="mt-4 text-pretty leading-relaxed text-background/75">
                      Ven a celebrar con nosotros, reservando tu mesa en Take&apos;s 😊
                    </p>
                  </div>

                  <div className="flex items-start gap-2.5 rounded-2xl bg-background/10 p-4 text-sm text-background/70">
                    <Calendar className="mt-0.5 h-4 w-4 shrink-0" />
                    <p>
                      En fechas especiales no se aceptan reservas, la atención es por orden
                      de llegada.
                    </p>
                  </div>

                  <ReservaForm whatsappNumber={content.contacto.redes.whatsapp} />
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter content={content} />
      <FloatingSocial
        whatsappNumber={content.contacto.redes.whatsapp}
        instagramUrl={content.contacto.redes.instagram}
      />
    </>
  )
}

import { CreditCard } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { Button } from '@/components/ui/button'
import type { SiteContent } from '@/lib/content'

export function ClubBeneficiosSection({ content }: { content: SiteContent }) {
  const { clubBeneficios } = content
  if (!clubBeneficios.activo) return null

  // Mientras no exista el sistema externo de puntos/tracking (campo `link`
  // vacío), el botón lleva a /club-takes en vez de quedar deshabilitado —
  // cuando se cargue el link real desde Supabase, pasa a abrir ese sistema
  // externo en pestaña nueva.
  const tieneLinkExterno = clubBeneficios.link.trim().length > 0
  const href = tieneLinkExterno ? clubBeneficios.link : '/club-takes'

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand to-accent p-8 shadow-2xl sm:p-12">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full bg-white/10 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-14 -left-8 h-48 w-48 rounded-full bg-white/10 blur-3xl"
            />

            <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4 sm:items-center">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white">
                  <CreditCard className="h-7 w-7" />
                </span>
                <div>
                  <h2 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl">
                    {clubBeneficios.titulo}
                  </h2>
                  <p className="mt-1.5 max-w-xl text-pretty leading-relaxed text-white/85">
                    {clubBeneficios.descripcion}
                  </p>
                </div>
              </div>

              <Button
                variant="brand-outline"
                size="pill-lg"
                className="w-full shrink-0 sm:w-auto"
                nativeButton={false}
                render={
                  tieneLinkExterno ? (
                    <a href={href} target="_blank" rel="noopener noreferrer" />
                  ) : (
                    <a href={href} />
                  )
                }
              >
                {clubBeneficios.textoBoton}
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

import type { Metadata } from 'next'
import { CreditCard } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Reveal } from '@/components/reveal'
import { EmptyState } from '@/components/ui/empty-state'
import { getContent } from '@/lib/content'

export const metadata: Metadata = {
  title: "Club Takes | TAKE'S Sushi & Coffee",
  description: 'Muy pronto: acumula beneficios exclusivos en cada visita a TAKE\'S con el Club Takes.',
}

// Aviso simple mientras se termina de definir el programa de fidelización
// — cuando exista el sistema externo de puntos/tracking, el botón "Unirme
// al Club" del banner de la home pasa a apuntar directo ahí (ver
// components/club-beneficios-section.tsx) y esta página deja de ser el
// destino, sin que haga falta borrarla.
// Sin esto quedaba 100% estática (sin `revalidate` ni `dynamic`, Next la
// trata como SSG puro) — nunca se habría refrescado tras el primer build.
export const revalidate = 60

export default async function ClubTakesPage() {
  const content = await getContent()
  const whatsappHref = `https://wa.me/${content.contacto.redes.whatsapp}`

  return (
    <>
      <SiteHeader />
      <main className="pt-28 sm:pt-32">
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <Reveal>
              <span className="text-eyebrow">Club Takes</span>
              <h1 className="text-h2 mt-3">Beneficios exclusivos para ti</h1>
              <p className="text-lead mt-4">
                Nuestro club de fidelización — acumula beneficios en cada visita a TAKE&apos;S.
              </p>
            </Reveal>

            <Reveal delay={80} className="mt-10">
              <EmptyState
                icon={CreditCard}
                title="Muy pronto"
                description="Estamos afinando los últimos detalles del Club Takes. Escríbenos por WhatsApp si quieres que te avisemos apenas esté listo."
                ctaLabel="Consultar por WhatsApp"
                ctaHref={whatsappHref}
              />
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter content={content} />
    </>
  )
}

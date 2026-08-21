import { existsSync } from 'node:fs'
import { join } from 'node:path'
import type { Metadata } from 'next'
import Image from 'next/image'
import {
  ArrowRight,
  Award,
  ClipboardCheck,
  Heart,
  Percent,
  QrCode,
  ShieldCheck,
  Sparkles,
  Star,
  Wallet,
} from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { FloatingSocial } from '@/components/floating-social'
import { ClubTakesConfetti } from '@/components/club-takes-confetti'
import { Reveal } from '@/components/reveal'
import { Button } from '@/components/ui/button'
import { getContent } from '@/lib/content'

export const metadata: Metadata = {
  title: "Club Takes | TAKE'S Sushi & Coffee",
  description:
    "Únete al Club Take's: acumula estampillas en cada visita y desbloquea descuentos exclusivos.",
}

// Sin esto quedaba 100% estática (sin `revalidate` ni `dynamic`, Next la
// trata como SSG puro) — nunca se habría refrescado tras el primer build.
export const revalidate = 60

// Registro del club (TrackingTable). El botón usa un link directo al
// formulario de pase de billetera (con UTM propio del acortador), distinto
// del que codifica el QR de abajo — ambos llevan al mismo club, solo que
// por rutas distintas dentro de TrackingTable.
const CLUB_URL = 'https://app.trackingtable.com/get-wallet-pass/1602?utm_source=url_shortener&url_shortener_id=971'

// Capturas reales del flujo de registro como archivos estáticos — mismo
// criterio que las reseñas (public/, permanentes, fuera de Supabase). De
// las 6 subidas a public/images/club-pasos/ (1.png ... 6.png, también
// sirven .jpg/.jpeg/.webp), se curan estas 4 para la galería de "cómo
// unirte": la 2 (bienvenida/beneficios), 3 (formulario), 5 (pase agregado
// a Wallet) y 6 (éxito) — la 1 (popup de invitación) no aporta a una guía
// de 4 pasos. La 4 (click en "Add to Apple Wallet") es un recorte angosto
// (828×557, no una captura de pantalla completa como las demás, que son
// ~828×1700) — en vez de forzarla a un 5º marco de celular del mismo
// tamaño (se vería desfasada), se muestra como una miniatura debajo de la
// tarjeta "Completa tus datos", que es el paso al que pertenece.
// `existsSync` corre en el servidor (esta página no lleva 'use client'),
// así que mientras no estén todas subidas, sigue mostrando los íconos
// genéricos sin romperse.
const PASO_EXTENSIONES = ['png', 'jpg', 'jpeg', 'webp']
function findPasoImage(n: number) {
  for (const ext of PASO_EXTENSIONES) {
    const src = `/images/club-pasos/${n}.${ext}`
    if (existsSync(join(process.cwd(), 'public', src))) return src
  }
  return null
}
const PASO_CARDS = [
  { n: 2, titulo: 'Escanea el QR' },
  { n: 3, titulo: 'Completa tus datos', extraN: 4 },
  { n: 5, titulo: 'Agrega a tu Wallet' },
  { n: 6, titulo: '¡Listo!' },
]
const pasoImagenes = PASO_CARDS.map((p, i) => ({
  numero: i + 1,
  titulo: p.titulo,
  src: findPasoImage(p.n),
  extraSrc: p.extraN ? findPasoImage(p.extraN) : null,
})).filter((p): p is { numero: number; titulo: string; src: string; extraSrc: string | null } => p.src !== null)

const BENEFICIOS = [
  { icon: Heart, titulo: '10% de descuento', estampillas: 5 },
  { icon: Percent, titulo: '25% de descuento', estampillas: 10 },
  { icon: Award, titulo: '50% de descuento', estampillas: 15 },
]

const PASOS = [
  {
    icon: QrCode,
    titulo: 'Escanea el QR',
    descripcion: 'O toca el botón "Únete Ahora" desde tu celular.',
  },
  {
    icon: ClipboardCheck,
    titulo: 'Completa tus datos',
    descripcion: 'Nombre, apellido, email, teléfono y fecha de nacimiento.',
  },
  {
    icon: Wallet,
    titulo: 'Agrega tu pase',
    descripcion: 'Acepta los términos y guárdalo en Apple Wallet o Google Wallet.',
  },
  {
    icon: Sparkles,
    titulo: '¡Ya eres socio!',
    descripcion: 'Cada compra en Take’s te suma una estampilla.',
  },
]

export default async function ClubTakesPage() {
  const content = await getContent()

  return (
    <>
      <ClubTakesConfetti />
      <SiteHeader />
      <main className="pt-24 sm:pt-28">
        {/* Hero — toda la tarjeta (imagen + título) es un link directo al
            registro del club, con un anillo de brillo pulsante siempre
            activo (funciona en mobile, no depende de hover) + una etiqueta
            con rebote invitando al clic, para que se note que es clicable. */}
        <section className="pt-8 sm:pt-10">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <a
                href={CLUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Únete al Club Take's — abre el registro"
                className="animate-glow-ring group relative block overflow-hidden rounded-3xl shadow-2xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_25px_70px_-15px_var(--accent)]"
              >
                <div className="relative h-[340px] w-full sm:h-[400px]">
                  <Image
                    src="/images/cat-sushi-rolls.png"
                    alt="Rolls de sushi de TAKE'S bañados en salsa"
                    fill
                    priority
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 1280px) 100vw, 1280px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
                    <Sparkles className="h-3.5 w-3.5 text-accent" />
                    Club de beneficios
                  </span>
                  <h1 className="mt-5 text-4xl font-extrabold leading-tight text-white sm:text-5xl">
                    Únete al Club Take&apos;s
                  </h1>
                  <p className="mx-auto mt-4 max-w-xl text-pretty text-base leading-relaxed text-white/85 sm:text-lg">
                    Acumula estampillas en cada visita y desbloquea descuentos exclusivos.
                  </p>
                  <span className="mt-6 inline-flex animate-bounce-y items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-xs font-bold uppercase tracking-wide text-accent-foreground shadow-lg shadow-accent/40">
                    Toca para unirte
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </a>
            </Reveal>
          </div>
        </section>

        {/* Beneficios */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <Reveal className="grid gap-5 sm:grid-cols-3">
              {BENEFICIOS.map((b, i) => (
                <Reveal
                  key={b.titulo}
                  delay={i * 80}
                  className="rounded-3xl border border-border bg-card p-6 text-center shadow-lg shadow-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/15 text-accent">
                    <b.icon className="h-7 w-7" />
                  </span>
                  <p className="mt-4 text-lg font-extrabold text-foreground">{b.titulo}</p>
                  <div className="mt-2 flex items-center justify-center gap-0.5 text-accent">
                    {Array.from({ length: 5 }).map((_, star) => (
                      <Star key={star} className="h-4 w-4 fill-accent" />
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {b.estampillas} estampillas para canjear
                  </p>
                </Reveal>
              ))}
            </Reveal>
          </div>
        </section>

        {/* Cómo unirte */}
        <section className="bg-secondary/40 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <Reveal className="mx-auto max-w-2xl text-center">
              <span className="text-eyebrow">Cómo unirte</span>
              <h2 className="text-h2 mt-3">Solo toma un minuto</h2>
            </Reveal>

            {pasoImagenes.length > 0 ? (
              // Carrusel con snap en mobile (una tarjeta a la vez, con un
              // adelanto de la siguiente para invitar a deslizar); grid fijo
              // desde sm: en adelante, sin scroll.
              <div className="-mx-4 mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden">
                {pasoImagenes.map((paso, i) => (
                  <Reveal
                    key={paso.numero}
                    delay={i * 100}
                    className="w-[72vw] shrink-0 snap-center sm:w-auto"
                  >
                    <div className="mx-auto max-w-[220px]">
                      <div className="relative overflow-hidden rounded-[2rem] border-[5px] border-foreground bg-foreground shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl">
                        <span
                          aria-hidden="true"
                          className="absolute left-1/2 top-1.5 z-10 h-1.5 w-10 -translate-x-1/2 rounded-full bg-foreground"
                        />
                        <div className="relative aspect-[9/19.5] w-full overflow-hidden rounded-[1.6rem]">
                          <Image
                            src={paso.src}
                            alt={`Paso ${paso.numero}: ${paso.titulo}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 72vw, 220px"
                          />
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-center gap-2.5">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground shadow-sm">
                          {paso.numero}
                        </span>
                        <p className="text-sm font-bold text-foreground">{paso.titulo}</p>
                      </div>

                      {paso.extraSrc && (
                        <div className="mt-3">
                          <div className="relative aspect-[828/557] w-full overflow-hidden rounded-xl border-[3px] border-foreground shadow-md shadow-black/10">
                            <Image
                              src={paso.extraSrc}
                              alt="Confirmando y agregando el pase a Wallet"
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 72vw, 220px"
                            />
                          </div>
                          <p className="mt-1.5 text-center text-xs text-muted-foreground">
                            Confirma y agrega tu pase
                          </p>
                        </div>
                      )}
                    </div>
                  </Reveal>
                ))}
              </div>
            ) : (
              <div className="mt-12 grid gap-8 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-10 lg:grid-cols-4">
                {PASOS.map((paso, i) => (
                  <Reveal key={paso.titulo} delay={i * 80} className="relative text-center">
                    <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand text-brand-foreground shadow-lg shadow-brand/25">
                      <paso.icon className="h-7 w-7" />
                      <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                        {i + 1}
                      </span>
                    </div>
                    <p className="mt-4 text-base font-extrabold text-foreground">{paso.titulo}</p>
                    <p className="mt-1.5 text-pretty text-sm leading-relaxed text-muted-foreground">
                      {paso.descripcion}
                    </p>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* QR + CTA */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="grid items-center gap-10 rounded-3xl border border-border bg-foreground p-8 text-background shadow-2xl sm:p-12 lg:grid-cols-[auto_1fr]">
                <div className="mx-auto flex flex-col items-center gap-3">
                  <div className="rounded-3xl bg-white p-4 shadow-xl">
                    <Image
                      src="/images/club-pasos/club-qr.png"
                      alt="Código QR para unirte al Club Take's"
                      width={800}
                      height={800}
                      className="h-48 w-48 sm:h-56 sm:w-56"
                    />
                  </div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-background/60">
                    Escanéame para unirte
                  </p>
                </div>

                <div className="text-center lg:text-left">
                  <span className="text-eyebrow text-brand">¿Sin cámara a mano?</span>
                  <h2 className="mt-3 text-2xl font-extrabold leading-tight sm:text-3xl">
                    Únete desde cualquier dispositivo
                  </h2>
                  <p className="mx-auto mt-3 max-w-md text-pretty leading-relaxed text-background/75 lg:mx-0">
                    Si estás en el computador, usa el botón — te lleva directo al
                    registro del club.
                  </p>
                  <Button
                    variant="accent"
                    size="pill-lg"
                    className="mt-6 w-full sm:w-auto"
                    nativeButton={false}
                    render={<a href={CLUB_URL} target="_blank" rel="noopener noreferrer" />}
                  >
                    Únete Ahora <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Reveal>

            <Reveal delay={100} className="mt-8 flex items-center justify-center gap-2 text-center text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 shrink-0 text-brand" />
              Sin costo, sin letra chica. Tus datos están protegidos.
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

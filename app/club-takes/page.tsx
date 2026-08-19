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

// Registro del club (TrackingTable) — mismo destino que codifica el QR de
// abajo, así que el botón es una alternativa exacta para quien está en
// desktop y no puede escanear con el mismo dispositivo.
const CLUB_URL = 'https://app.trackingtable.com/pdf-menu/348'

// Capturas reales del flujo de registro (paso 1 al 6) como archivos
// estáticos — mismo criterio que las reseñas (public/, permanentes, fuera
// de Supabase). No hace falta tocar código para agregarlas: basta con subir
// `public/images/club-pasos/1.png` ... `6.png` (también sirven .jpg/.jpeg/
// .webp) y aparecen solas. `existsSync` corre en el servidor (esta página
// no lleva 'use client'), así que mientras no estén todas subidas, la
// sección de más abajo sigue mostrando los íconos genéricos sin romperse.
const PASO_EXTENSIONES = ['png', 'jpg', 'jpeg', 'webp']
function findPasoImage(n: number) {
  for (const ext of PASO_EXTENSIONES) {
    const src = `/images/club-pasos/${n}.${ext}`
    if (existsSync(join(process.cwd(), 'public', src))) return src
  }
  return null
}
const pasoImagenes = [1, 2, 3, 4, 5, 6]
  .map((n) => ({ n, src: findPasoImage(n) }))
  .filter((p): p is { n: number; src: string } => p.src !== null)

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
      <SiteHeader />
      <main className="pt-24 sm:pt-28">
        {/* Hero */}
        <section className="pt-8 sm:pt-10">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <Reveal className="relative overflow-hidden rounded-3xl shadow-2xl">
              <div className="relative h-[340px] w-full sm:h-[400px]">
                <Image
                  src="/images/cat-sushi-rolls.png"
                  alt="Rolls de sushi de TAKE'S bañados en salsa"
                  fill
                  priority
                  className="object-cover"
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
              </div>
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
              <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
                {pasoImagenes.map(({ n, src }, i) => (
                  <Reveal key={n} delay={i * 60} className="relative">
                    <div className="relative mx-auto max-w-[200px] overflow-hidden rounded-2xl border border-border shadow-lg shadow-black/10">
                      <span className="absolute left-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground shadow">
                        {n}
                      </span>
                      <Image
                        src={src}
                        alt={`Paso ${n} para unirte al Club Take's`}
                        width={400}
                        height={866}
                        className="h-auto w-full"
                        sizes="(max-width: 640px) 45vw, 200px"
                      />
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
                    Si estás en el computador, usa el botón — te lleva directo al mismo
                    registro que abre el código QR.
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
    </>
  )
}

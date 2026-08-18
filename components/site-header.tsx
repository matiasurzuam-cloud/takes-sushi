'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

// Los anchors llevan el prefijo "/" (ej. "/#nosotros" en vez de "#nosotros")
// porque el header aparece en páginas propias como /eventos o /reservas,
// no solo en la home — sin el "/" el link intentaría saltar a un id que
// no existe en esa página en vez de volver a la home y bajar hasta ahí.
const navLinks = [
  { label: 'Nosotros', href: '/#nosotros' },
  { label: 'Carta', href: '/#carta' },
  { label: 'Promociones', href: '/#promociones' },
  { label: 'Eventos', href: '/eventos' },
  { label: 'Reservas', href: '/reservas' },
  { label: 'Club Takes', href: '/club-takes' },
  { label: 'Galería', href: '/#galeria' },
  { label: 'Opiniones', href: '/#opiniones' },
  { label: 'Contacto', href: '/#contacto' },
]

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={cn(
        'animate-fade-in fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-border/60 bg-background/85 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent py-4',
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Nombre de marca: TAKE'S en mayúsculas como wordmark (logo, título,
            footer). "Take's" en caja natural queda reservado para nombres de
            producto en la carta (ej. "Shirashi Take's") — no mezclar. */}
        <a href="/#inicio" className="flex items-center gap-3">
          <span className="relative block h-11 w-11 overflow-hidden rounded-full ring-2 ring-brand/30 sm:h-12 sm:w-12">
            <Image
              src="/images/logo.jpg"
              alt="Logo de TAKE'S Sushi & Coffee"
              fill
              className="object-cover"
              sizes="48px"
              priority
            />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-lg font-extrabold tracking-tight text-foreground">
              TAKE&apos;S
            </span>
            <span className="text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
              Sushi &amp; Coffee
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-0.5 xl:gap-1 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="whitespace-nowrap rounded-full px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-brand/10 hover:text-foreground xl:px-4"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button variant="brand" size="pill" nativeButton={false} render={<a href="/#contacto" />}>
            Hacer pedido
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-foreground transition-colors hover:bg-brand/15 lg:hidden"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'overflow-hidden border-t border-border/60 bg-background/95 backdrop-blur-xl transition-[max-height,opacity] duration-300 lg:hidden',
          open ? 'max-h-[26rem] opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-brand/10"
            >
              {link.label}
            </a>
          ))}
          <Button
            variant="brand"
            size="pill"
            className="mt-2"
            nativeButton={false}
            render={<a href="/#contacto" onClick={() => setOpen(false)} />}
          >
            Hacer pedido
          </Button>
        </nav>
      </div>
    </header>
  )
}

'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Carta', href: '#carta' },
  { label: 'Promociones', href: '#promociones' },
  { label: 'Galería', href: '#galeria' },
  { label: 'Opiniones', href: '#opiniones' },
  { label: 'Contacto', href: '#contacto' },
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
        <a href="#inicio" className="flex items-center gap-3">
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

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-brand/10 hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <a
            href="#contacto"
            className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-brand-foreground shadow-lg shadow-brand/25 transition-all hover:-translate-y-0.5 hover:shadow-brand/40"
          >
            Hacer pedido
          </a>
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
          <a
            href="#contacto"
            onClick={() => setOpen(false)}
            className="mt-2 inline-flex items-center justify-center rounded-xl bg-brand px-6 py-3 text-base font-semibold text-brand-foreground shadow-lg shadow-brand/25"
          >
            Hacer pedido
          </a>
        </nav>
      </div>
    </header>
  )
}

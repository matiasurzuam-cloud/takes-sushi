import Image from 'next/image'
import { MessageCircle, Camera, MapPin } from 'lucide-react'

const navLinks = [
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Carta', href: '#carta' },
  { label: 'Promociones', href: '#promociones' },
  { label: 'Galería', href: '#galeria' },
  { label: 'Opiniones', href: '#opiniones' },
  { label: 'Contacto', href: '#contacto' },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <span className="relative block h-12 w-12 overflow-hidden rounded-full ring-2 ring-brand/40">
                <Image
                  src="/images/logo.jpg"
                  alt="Logo de TAKE'S Sushi & Coffee"
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </span>
              <div className="leading-none">
                <p className="text-lg font-extrabold">TAKE&apos;S</p>
                <p className="text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-background/60">
                  Sushi &amp; Coffee
                </p>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-pretty text-sm leading-relaxed text-background/70">
              Sushi fresco de autor y café de especialidad, preparados al momento
              con ingredientes seleccionados.
            </p>
            <div className="mt-6 flex gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-background/10 text-background transition-colors hover:bg-brand hover:text-brand-foreground">
                <MessageCircle className="h-5 w-5" />
              </span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-background/10 text-background transition-colors hover:bg-accent hover:text-accent-foreground">
                <Camera className="h-5 w-5" />
              </span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-background/10 text-background transition-colors hover:bg-brand hover:text-brand-foreground">
                <MapPin className="h-5 w-5" />
              </span>
            </div>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-wide">Menú</p>
            <ul className="mt-4 space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-background/70 transition-colors hover:text-brand"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-wide">Horario</p>
            <ul className="mt-4 space-y-2.5 text-sm text-background/70">
              <li>Lunes a Domingo</li>
              <li>Define tu horario aquí</li>
              <li className="pt-2 text-background/50">
                Próximamente: pedidos en línea
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-background/15 pt-7 sm:flex-row">
          <p className="text-xs text-background/60">
            © {new Date().getFullYear()} TAKE&apos;S Sushi &amp; Coffee. Todos los
            derechos reservados.
          </p>
          <p className="text-xs text-background/60">
            Diseño web — listo para integrar pedidos y pagos.
          </p>
        </div>
      </div>
    </footer>
  )
}

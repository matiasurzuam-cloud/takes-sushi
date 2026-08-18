import Image from 'next/image'
import { MessageCircle, Camera, MapPin, Navigation } from 'lucide-react'
import type { SiteContent } from '@/lib/content'

// Mismo motivo que en site-header.tsx: el footer también aparece en
// páginas propias (/eventos, /reservas), así que los anchors necesitan el
// prefijo "/" para volver a la home en vez de intentar saltar a un id que
// no existe ahí.
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

export function SiteFooter({ content }: { content: SiteContent }) {
  const { horario, redes } = content.contacto

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
              <a
                href={`https://wa.me/${redes.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-background/10 text-background transition-colors hover:bg-brand hover:text-brand-foreground"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
              {redes.instagram && (
                <a
                  href={redes.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-background/10 text-background transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <Camera className="h-5 w-5" />
                </a>
              )}
              {redes.maps && (
                <a
                  href={redes.maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Cómo llegar (Google Maps)"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-background/10 text-background transition-colors hover:bg-brand hover:text-brand-foreground"
                >
                  <MapPin className="h-5 w-5" />
                </a>
              )}
              {redes.waze && (
                <a
                  href={redes.waze}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Abrir en Waze"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-background/10 text-background transition-colors hover:bg-brand hover:text-brand-foreground"
                >
                  <Navigation className="h-5 w-5" />
                </a>
              )}
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
            {horario.length > 0 ? (
              <ul className="mt-4 space-y-2.5 text-sm text-background/70">
                {horario.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-background/70">
                Escríbenos por WhatsApp para conocer el horario de hoy.
              </p>
            )}
            <p className="mt-2 text-sm text-background/50">Próximamente: pedidos en línea</p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-background/15 pt-7 sm:flex-row">
          <p className="text-xs text-background/60">
            © {new Date().getFullYear()} TAKE&apos;S Sushi &amp; Coffee. Todos los
            derechos reservados.
          </p>
          <div className="flex items-center gap-4">
            <p className="text-xs text-background/60">
              Diseño web — listo para integrar pedidos y pagos.
            </p>
            <a
              href="/admin/login"
              className="text-xs text-background/40 underline-offset-2 transition-colors hover:text-background/70 hover:underline"
            >
              Admin
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

import { MapPin, Clock, Phone, MessageCircle, Camera, Navigation } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { Button } from '@/components/ui/button'
import type { SiteContent } from '@/lib/content'

export function ContactSection({ content }: { content: SiteContent }) {
  const { direccion, horario, telefono, redes } = content.contacto
  const whatsappHref = `https://wa.me/${redes.whatsapp}`

  // Embed sin API key de Google (funciona con una búsqueda de texto simple,
  // sin depender de un Place ID) — usa la dirección real si ya está
  // cargada en Supabase, y si no cae al nombre del local + ciudad.
  const mapsQuery = direccion.length > 0 ? direccion.join(', ') : "Take's Sushi Molina, Chile"
  const mapsEmbedSrc = `https://www.google.com/maps?q=${encodeURIComponent(mapsQuery)}&output=embed`

  const info = [
    direccion.length > 0 ? { icon: MapPin, title: 'Ubicación', lines: direccion } : null,
    horario.length > 0 ? { icon: Clock, title: 'Horario', lines: horario } : null,
    telefono ? { icon: Phone, title: 'Teléfono', lines: [telefono] } : null,
  ].filter((item): item is NonNullable<typeof item> => item !== null)

  return (
    <section id="contacto" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <Reveal>
              <span className="text-eyebrow">Contacto</span>
              <h2 className="text-h2 mt-3">Hagamos tu pedido</h2>
              <p className="text-lead mt-4">
                Escríbenos directo por WhatsApp o completa el formulario y te
                respondemos a la brevedad.
              </p>
            </Reveal>

            {info.length > 0 ? (
              <div className="mt-8 space-y-4">
                {info.map((item, i) => (
                  <Reveal key={item.title} delay={i * 80}>
                    <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/15 text-brand">
                        <item.icon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-sm font-bold text-foreground">
                          {item.title}
                        </p>
                        {item.lines.map((line) => (
                          <p
                            key={line}
                            className="text-sm leading-relaxed text-muted-foreground"
                          >
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            ) : (
              <Reveal className="mt-8">
                <p className="rounded-2xl border border-dashed border-border bg-card/50 p-5 text-sm leading-relaxed text-muted-foreground">
                  Estamos actualizando nuestros datos de contacto. Mientras
                  tanto, escríbenos directo por WhatsApp.
                </p>
              </Reveal>
            )}

            <Reveal delay={120} className="mt-6 flex flex-wrap gap-3">
              <Button
                variant="brand"
                size="pill"
                nativeButton={false}
                render={<a href={whatsappHref} target="_blank" rel="noopener noreferrer" />}
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </Button>
              {redes.instagram && (
                <Button
                  variant="brand"
                  size="pill"
                  className="bg-accent text-accent-foreground shadow-accent/25 hover:shadow-accent/40"
                  nativeButton={false}
                  render={<a href={redes.instagram} target="_blank" rel="noopener noreferrer" />}
                >
                  <Camera className="h-4 w-4" /> Instagram
                </Button>
              )}
            </Reveal>

            {(redes.maps || redes.waze) && (
              <Reveal delay={160} className="mt-6">
                <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
                  <div className="relative h-56 w-full sm:h-64">
                    <iframe
                      src={mapsEmbedSrc}
                      className="absolute inset-0 h-full w-full border-0 grayscale-[0.15]"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Ubicación de TAKE'S en el mapa"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-3 border-t border-border p-4">
                    <span className="flex items-center gap-2 text-sm font-bold text-foreground">
                      <MapPin className="h-4 w-4 text-brand" /> TAKE&apos;S Sushi &amp; Coffee
                    </span>
                    <div className="ml-auto flex gap-2">
                      {redes.maps && (
                        <Button
                          variant="outline"
                          size="pill-sm"
                          nativeButton={false}
                          render={<a href={redes.maps} target="_blank" rel="noopener noreferrer" />}
                        >
                          Cómo llegar
                        </Button>
                      )}
                      {redes.waze && (
                        <Button
                          variant="outline"
                          size="pill-sm"
                          nativeButton={false}
                          render={<a href={redes.waze} target="_blank" rel="noopener noreferrer" />}
                        >
                          <Navigation className="h-3.5 w-3.5 text-[#33CCFF]" /> Waze
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Reveal>
            )}
          </div>

          {/* Contact form (diseño) */}
          <Reveal delay={100}>
            <div className="rounded-3xl border border-border bg-card p-7 shadow-xl sm:p-9">
              <h3 className="text-h3">Escríbenos</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Formulario de demostración — se conectará más adelante.
              </p>
              <form className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      Nombre
                    </label>
                    <input
                      type="text"
                      placeholder="Tu nombre"
                      className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      placeholder="+56 9 ..."
                      className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Mensaje
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Cuéntanos tu pedido o consulta"
                    className="w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20"
                  />
                </div>
                <Button type="button" variant="brand" size="pill-lg" className="w-full">
                  Enviar mensaje
                </Button>
              </form>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

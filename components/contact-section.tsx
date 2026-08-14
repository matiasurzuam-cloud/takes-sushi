import { MapPin, Clock, Phone, MessageCircle, Camera } from 'lucide-react'
import { Reveal } from '@/components/reveal'

const info = [
  {
    icon: MapPin,
    title: 'Ubicación',
    lines: ['Agrega aquí tu dirección', 'Ciudad, región'],
  },
  {
    icon: Clock,
    title: 'Horario',
    lines: ['Lun a Dom', 'Define tu horario de atención'],
  },
  {
    icon: Phone,
    title: 'Teléfono',
    lines: ['Agrega tu número', 'de contacto'],
  },
]

export function ContactSection() {
  return (
    <section id="contacto" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <Reveal>
              <span className="text-sm font-bold uppercase tracking-[0.25em] text-accent">
                Contacto
              </span>
              <h2 className="mt-3 text-balance text-3xl font-extrabold leading-tight text-foreground sm:text-4xl lg:text-5xl">
                Hagamos tu pedido
              </h2>
              <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
                Próximamente podrás pedir por WhatsApp, Instagram y con pago en
                línea. Por ahora dejamos todo listo para conectar tus canales.
              </p>
            </Reveal>

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

            <Reveal delay={120} className="mt-6 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground shadow-lg shadow-brand/25">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/25">
                <Camera className="h-4 w-4" /> Instagram
              </span>
            </Reveal>
          </div>

          {/* Contact form (diseño) */}
          <Reveal delay={100}>
            <div className="rounded-[2rem] border border-border bg-card p-7 shadow-xl sm:p-9">
              <h3 className="text-xl font-bold text-foreground">
                Escríbenos
              </h3>
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
                <button
                  type="button"
                  className="inline-flex w-full items-center justify-center rounded-xl bg-brand px-6 py-3.5 text-base font-semibold text-brand-foreground shadow-lg shadow-brand/25 transition-all hover:-translate-y-0.5"
                >
                  Enviar mensaje
                </button>
              </form>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

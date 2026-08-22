'use client'

import { useEffect, useState } from 'react'
import { MapPin, X } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { SmartImage } from '@/components/ui/smart-image'
import { formatFechaEvento } from '@/lib/eventos/format'
import type { Evento } from '@/lib/eventos/types'

// Mismo tratamiento de modal (backdrop + blur + botón X) que el resto del
// sitio (CartaModal, EventoReservar, ClubQrPopup) — acá la foto ocupa la
// parte de arriba a todo lo ancho porque es la vitrina del recap, la
// descripción es el contenido principal en vez de un formulario.
function EventoPasadoModal({ evento, onClose }: { evento: Evento; onClose: () => void }) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={evento.titulo}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-border bg-card shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative aspect-[4/3] w-full">
          <SmartImage
            src={evento.imagen}
            alt={evento.titulo}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 32rem"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5">
            <h3 className="text-xl font-extrabold text-white sm:text-2xl">{evento.titulo}</h3>
            <p className="mt-1 text-sm font-medium text-white/80">
              {formatFechaEvento(evento.fecha, evento.hora)}
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-7">
          <p className="text-pretty text-base leading-relaxed text-foreground">
            {evento.descripcion}
          </p>
          {evento.ubicacion && (
            <p className="mt-4 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" />
              {evento.ubicacion}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export function EventosPasados({ eventos }: { eventos: Evento[] }) {
  const [openId, setOpenId] = useState<string | null>(null)
  const abierto = eventos.find((e) => e.id === openId) ?? null

  return (
    <>
      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {eventos.map((evento, i) => (
          <Reveal key={evento.id} delay={i * 50}>
            <button
              type="button"
              onClick={() => setOpenId(evento.id)}
              aria-label={`Ver cómo fue: ${evento.titulo}`}
              className="group relative aspect-square w-full overflow-hidden rounded-2xl text-left"
            >
              <SmartImage
                src={evento.imagen}
                alt={evento.titulo}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3">
                <p className="truncate text-sm font-bold text-white">{evento.titulo}</p>
                <p className="text-xs text-white/70">{formatFechaEvento(evento.fecha)}</p>
              </div>
            </button>
          </Reveal>
        ))}
      </div>

      {abierto && <EventoPasadoModal evento={abierto} onClose={() => setOpenId(null)} />}
    </>
  )
}

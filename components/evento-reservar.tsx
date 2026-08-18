'use client'

import { useState } from 'react'
import { Minus, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatFechaEvento } from '@/lib/eventos/format'
import type { Evento } from '@/lib/eventos/types'

interface EventoReservarProps {
  evento: Evento
  whatsappNumber: string
  size?: 'pill' | 'pill-lg'
  className?: string
}

// Si el evento tiene su propio link (ticketera externa, formulario, etc.),
// "Reservar" abre eso directo — el mini-formulario de abajo (nombre +
// personas) solo aplica cuando el destino es WhatsApp, para no reemplazar
// un sistema de reservas que el admin ya haya definido para ese evento.
export function EventoReservar({ evento, whatsappNumber, size = 'pill', className }: EventoReservarProps) {
  const [open, setOpen] = useState(false)
  const [nombre, setNombre] = useState('')
  const [personas, setPersonas] = useState(2)

  if (evento.link) {
    return (
      <Button
        variant="brand"
        size={size}
        className={className}
        nativeButton={false}
        render={<a href={evento.link} target="_blank" rel="noopener noreferrer" />}
      >
        Reservar
      </Button>
    )
  }

  const mensaje = [
    `¡Hola! Me gustaría reservar para el evento "${evento.titulo}".`,
    `Fecha: ${formatFechaEvento(evento.fecha, evento.hora)}`,
    `Nombre: ${nombre || '[completar]'}`,
    `Número de personas: ${personas}`,
  ].join('\n')
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(mensaje)}`

  return (
    <>
      <Button variant="brand" size={size} className={className} onClick={() => setOpen(true)}>
        Reservar
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Reservar evento"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm rounded-3xl border border-border bg-card p-6 shadow-2xl sm:p-7"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Cerrar"
              className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="pr-8 text-lg font-bold text-foreground">{evento.titulo}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {formatFechaEvento(evento.fecha, evento.hora)}
            </p>

            <div className="mt-5 space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="evento-nombre" className="text-sm font-medium text-foreground">
                  Tu nombre
                </label>
                <input
                  id="evento-nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Nombre y apellido"
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
                />
              </div>

              <div className="space-y-1.5">
                <span className="text-sm font-medium text-foreground">Número de personas</span>
                <div className="flex w-fit items-center gap-4 rounded-full border border-border px-2 py-1.5">
                  <button
                    type="button"
                    onClick={() => setPersonas((p) => Math.max(1, p - 1))}
                    aria-label="Menos personas"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-6 text-center text-base font-bold text-foreground">{personas}</span>
                  <button
                    type="button"
                    onClick={() => setPersonas((p) => Math.min(60, p + 1))}
                    aria-label="Más personas"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <Button
              variant="brand"
              size="pill-lg"
              className="mt-6 w-full"
              nativeButton={false}
              render={
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} />
              }
            >
              Confirmar por WhatsApp
            </Button>
          </div>
        </div>
      )}
    </>
  )
}

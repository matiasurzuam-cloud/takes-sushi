'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, LogOut, MapPin, Pencil, Plus, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { SmartImage } from '@/components/ui/smart-image'
import { AdminNav } from './admin-nav'
import { EventoForm, type EventoFormValues } from './evento-form'
import { formatFechaEvento } from '@/lib/eventos/format'
import { getSantiagoParts } from '@/lib/timezone'
import type { Evento } from '@/lib/eventos/types'

interface EventosAdminProps {
  initialEventos: Evento[]
}

export function EventosAdmin({ initialEventos }: EventosAdminProps) {
  const router = useRouter()
  const [eventos, setEventos] = useState(initialEventos)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Evento | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  // Se calcula solo en el cliente (evita desajustes de hidratación si el
  // render del servidor y el del navegador caen en días distintos).
  const [hoy, setHoy] = useState<string | null>(null)

  useEffect(() => {
    setHoy(getSantiagoParts(new Date()).dateISO)
  }, [])

  async function refresh() {
    const res = await fetch('/api/eventos')
    if (res.ok) setEventos(await res.json())
  }

  function openCreate() {
    setEditing(null)
    setFormOpen(true)
  }

  function openEdit(evento: Evento) {
    setEditing(evento)
    setFormOpen(true)
  }

  async function handleSubmit(values: EventoFormValues) {
    const payload = {
      ...values,
      hora: values.hora || undefined,
      ubicacion: values.ubicacion || undefined,
      precio: values.precio || undefined,
      link: values.link || undefined,
    }

    const res = editing
      ? await fetch(`/api/eventos/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      : await fetch('/api/eventos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

    if (!res.ok) {
      const data = await res.json().catch(() => null)
      throw new Error(data?.error ?? 'No se pudo guardar el evento')
    }

    await refresh()
    setFormOpen(false)
    setEditing(null)
  }

  async function handleDelete(evento: Evento) {
    if (!confirm(`¿Eliminar "${evento.titulo}"? Esta acción no se puede deshacer.`)) return
    setBusyId(evento.id)
    await fetch(`/api/eventos/${evento.id}`, { method: 'DELETE' })
    await refresh()
    setBusyId(null)
  }

  async function handleToggleActivo(evento: Evento) {
    setBusyId(evento.id)
    await fetch(`/api/eventos/${evento.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activo: !evento.activo }),
    })
    await refresh()
    setBusyId(null)
  }

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.replace('/admin/login')
    router.refresh()
  }

  return (
    <div>
      <AdminNav />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Eventos</h1>
          <p className="text-sm text-muted-foreground">
            Administra los próximos eventos y el recap de los que ya pasaron.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="brand" size="pill" onClick={openCreate}>
            <Plus className="h-4 w-4" /> Nuevo evento
          </Button>
          <Button variant="outline" size="pill" onClick={handleLogout}>
            <LogOut className="h-4 w-4" /> Salir
          </Button>
        </div>
      </div>

      <div className="mt-8 divide-y divide-border overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        {eventos.length === 0 && (
          <p className="p-8 text-center text-sm text-muted-foreground">
            Todavía no hay eventos. Crea el primero con el botón de arriba.
          </p>
        )}

        {eventos.map((evento) => (
          <div key={evento.id} className="flex flex-wrap items-center gap-4 p-4 sm:p-5">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-muted">
              <SmartImage
                src={evento.imagen || '/placeholder.svg'}
                alt={evento.titulo}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-foreground">{evento.titulo}</p>
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1 truncate text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatFechaEvento(evento.fecha, evento.hora)}
                </span>
                {evento.ubicacion && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {evento.ubicacion}
                  </span>
                )}
              </p>
            </div>

            {hoy && (
              <span
                className={cn(
                  'shrink-0 rounded-full px-3 py-1.5 text-xs font-bold',
                  evento.fecha < hoy ? 'bg-muted text-muted-foreground' : 'bg-brand/15 text-brand',
                )}
              >
                {evento.fecha < hoy ? 'Pasado' : 'Próximo'}
              </span>
            )}

            <button
              type="button"
              onClick={() => handleToggleActivo(evento)}
              disabled={busyId === evento.id}
              className={cn(
                'shrink-0 rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors',
                evento.activo ? 'bg-brand/15 text-brand' : 'bg-muted text-muted-foreground',
              )}
            >
              {evento.activo ? 'Activo' : 'Inactivo'}
            </button>

            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={() => openEdit(evento)}
                aria-label="Editar"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(evento)}
                disabled={busyId === evento.id}
                aria-label="Eliminar"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-2xl sm:p-8">
            <h2 className="mb-5 text-lg font-bold text-foreground">
              {editing ? 'Editar evento' : 'Nuevo evento'}
            </h2>
            <EventoForm initial={editing} onSubmit={handleSubmit} onCancel={() => setFormOpen(false)} />
          </div>
        </div>
      )}
    </div>
  )
}

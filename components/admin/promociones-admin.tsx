'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowDown, ArrowUp, Clock, LogOut, Pencil, Plus, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { SmartImage } from '@/components/ui/smart-image'
import { AdminNav } from './admin-nav'
import { PromocionForm, type PromocionFormValues } from './promocion-form'
import { describirVigencia } from '@/lib/promociones/vigencia'
import type { Promocion } from '@/lib/promociones/types'

// Colores del badge según el texto de describirVigencia — no hace falta un
// campo aparte, alcanza con mirar el prefijo del mensaje.
function vigenciaBadgeClass(label: string): string {
  if (label.startsWith('Vigente')) return 'bg-brand/15 text-brand'
  if (label === 'Vence hoy' || label === 'Vence mañana') return 'bg-accent/15 text-accent'
  if (label === 'Vencida' || label === 'Inactiva') return 'bg-destructive/10 text-destructive'
  return 'bg-muted text-muted-foreground'
}

interface PromocionesAdminProps {
  initialPromociones: Promocion[]
}

export function PromocionesAdmin({ initialPromociones }: PromocionesAdminProps) {
  const router = useRouter()
  const [promociones, setPromociones] = useState(initialPromociones)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Promocion | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [now, setNow] = useState<Date | null>(null)

  // Se calcula solo en el cliente (evita desajustes de hidratación si el
  // render del servidor y el del navegador caen en minutos distintos).
  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(id)
  }, [])

  async function refresh() {
    const res = await fetch('/api/promociones')
    if (res.ok) setPromociones(await res.json())
  }

  function openCreate() {
    setEditing(null)
    setFormOpen(true)
  }

  function openEdit(promo: Promocion) {
    setEditing(promo)
    setFormOpen(true)
  }

  async function handleSubmit(values: PromocionFormValues) {
    const payload = {
      ...values,
      link: values.link || undefined,
      fechaExpiracion: values.fechaExpiracion || undefined,
    }

    const res = editing
      ? await fetch(`/api/promociones/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      : await fetch('/api/promociones', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

    if (!res.ok) {
      const data = await res.json().catch(() => null)
      throw new Error(data?.error ?? 'No se pudo guardar la promoción')
    }

    await refresh()
    setFormOpen(false)
    setEditing(null)
  }

  async function handleDelete(promo: Promocion) {
    if (!confirm(`¿Eliminar "${promo.titulo}"? Esta acción no se puede deshacer.`)) return
    setBusyId(promo.id)
    await fetch(`/api/promociones/${promo.id}`, { method: 'DELETE' })
    await refresh()
    setBusyId(null)
  }

  async function handleToggleActivo(promo: Promocion) {
    setBusyId(promo.id)
    await fetch(`/api/promociones/${promo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activo: !promo.activo }),
    })
    await refresh()
    setBusyId(null)
  }

  // Reordenar con botones subir/bajar en vez de drag & drop: evita sumar una
  // librería de DnD nueva solo para esto y el proyecto no trae ninguna.
  async function handleMove(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= promociones.length) return

    const reordered = [...promociones]
    ;[reordered[index], reordered[target]] = [reordered[target], reordered[index]]
    setPromociones(reordered)

    await fetch('/api/promociones/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderedIds: reordered.map((p) => p.id) }),
    })
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
          <h1 className="text-2xl font-extrabold text-foreground">Promociones</h1>
          <p className="text-sm text-muted-foreground">
            Administra el pop-up y carrusel promocional del sitio.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="brand" size="pill" onClick={openCreate}>
            <Plus className="h-4 w-4" /> Nueva promoción
          </Button>
          <Button variant="outline" size="pill" onClick={handleLogout}>
            <LogOut className="h-4 w-4" /> Salir
          </Button>
        </div>
      </div>

      <div className="mt-8 divide-y divide-border overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        {promociones.length === 0 && (
          <p className="p-8 text-center text-sm text-muted-foreground">
            Todavía no hay promociones. Crea la primera con el botón de arriba.
          </p>
        )}

        {promociones.map((promo, i) => (
          <div key={promo.id} className="flex flex-wrap items-center gap-4 p-4 sm:p-5">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-muted">
              <SmartImage
                src={promo.imagenes[0] || '/placeholder.svg'}
                alt={promo.titulo}
                fill
                className="object-cover"
                sizes="64px"
              />
              {promo.imagenes.length > 1 && (
                <span className="absolute bottom-0.5 right-0.5 rounded-full bg-black/60 px-1.5 py-0.5 text-[0.6rem] font-bold text-white">
                  +{promo.imagenes.length - 1}
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-foreground">{promo.titulo}</p>
              <p className="truncate text-sm text-muted-foreground">{promo.descripcion}</p>
            </div>

            {now && (
              <span
                className={cn(
                  'inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold',
                  vigenciaBadgeClass(describirVigencia(promo, now)),
                )}
              >
                <Clock className="h-3 w-3" />
                {describirVigencia(promo, now)}
              </span>
            )}

            <button
              type="button"
              onClick={() => handleToggleActivo(promo)}
              disabled={busyId === promo.id}
              className={cn(
                'shrink-0 rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors',
                promo.activo ? 'bg-brand/15 text-brand' : 'bg-muted text-muted-foreground',
              )}
            >
              {promo.activo ? 'Activo' : 'Inactivo'}
            </button>

            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={() => handleMove(i, -1)}
                disabled={i === 0}
                aria-label="Mover arriba"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => handleMove(i, 1)}
                disabled={i === promociones.length - 1}
                aria-label="Mover abajo"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
              >
                <ArrowDown className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => openEdit(promo)}
                aria-label="Editar"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(promo)}
                disabled={busyId === promo.id}
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
              {editing ? 'Editar promoción' : 'Nueva promoción'}
            </h2>
            <PromocionForm initial={editing} onSubmit={handleSubmit} onCancel={() => setFormOpen(false)} />
          </div>
        </div>
      )}
    </div>
  )
}

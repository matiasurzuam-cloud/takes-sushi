'use client'

import { useState } from 'react'
import { Link as LinkIcon, Loader2, Upload, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { SmartImage } from '@/components/ui/smart-image'
import type { Evento } from '@/lib/eventos/types'

export interface EventoFormValues {
  imagen: string
  titulo: string
  descripcion: string
  fecha: string
  hora: string
  ubicacion: string
  precio: string
  link: string
  activo: boolean
}

interface EventoFormProps {
  initial?: Evento | null
  onSubmit: (values: EventoFormValues) => Promise<void>
  onCancel: () => void
}

const emptyValues: EventoFormValues = {
  imagen: '',
  titulo: '',
  descripcion: '',
  fecha: '',
  hora: '',
  ubicacion: '',
  precio: '',
  link: '',
  activo: true,
}

export function EventoForm({ initial, onSubmit, onCancel }: EventoFormProps) {
  const [values, setValues] = useState<EventoFormValues>(
    initial
      ? {
          imagen: initial.imagen,
          titulo: initial.titulo,
          descripcion: initial.descripcion,
          fecha: initial.fecha,
          hora: initial.hora ?? '',
          ubicacion: initial.ubicacion ?? '',
          precio: initial.precio ?? '',
          link: initial.link ?? '',
          activo: initial.activo,
        }
      : emptyValues,
  )
  const [imageMode, setImageMode] = useState<'upload' | 'url'>('upload')
  const [urlDraft, setUrlDraft] = useState('')
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function set<K extends keyof EventoFormValues>(key: K, value: EventoFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }))
  }

  // Reusa el mismo endpoint/bucket que las imágenes de promociones: es el
  // mismo bucket público de Storage, no hace falta uno separado para eventos.
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''

    setUploading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/promociones/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'No se pudo subir la imagen')
      set('imagen', data.path)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo subir la imagen')
    } finally {
      setUploading(false)
    }
  }

  function handleAddUrl() {
    if (!urlDraft.trim()) return
    set('imagen', urlDraft.trim())
    setUrlDraft('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!values.imagen) {
      setError('Agrega una imagen (subiendo un archivo o pegando una URL).')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      await onSubmit(values)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar el evento')
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <span className="text-sm font-medium text-foreground">Imagen</span>

        {values.imagen ? (
          <div className="relative h-32 w-full overflow-hidden rounded-xl border border-border bg-muted">
            <SmartImage src={values.imagen} alt="Imagen del evento" fill className="object-cover" sizes="28rem" />
            <button
              type="button"
              onClick={() => set('imagen', '')}
              aria-label="Quitar imagen"
              className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div className="space-y-2 rounded-xl border border-dashed border-border p-3">
            <div className="inline-flex rounded-lg border border-border p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setImageMode('upload')}
                className={cn(
                  'flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-colors',
                  imageMode === 'upload' ? 'bg-brand text-brand-foreground' : 'text-muted-foreground',
                )}
              >
                <Upload className="h-3.5 w-3.5" /> Subir archivo
              </button>
              <button
                type="button"
                onClick={() => setImageMode('url')}
                className={cn(
                  'flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-colors',
                  imageMode === 'url' ? 'bg-brand text-brand-foreground' : 'text-muted-foreground',
                )}
              >
                <LinkIcon className="h-3.5 w-3.5" /> URL
              </button>
            </div>

            {imageMode === 'upload' ? (
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileChange}
                className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-secondary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-secondary-foreground"
              />
            ) : (
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://…"
                  value={urlDraft}
                  onChange={(e) => setUrlDraft(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
                />
                <button
                  type="button"
                  onClick={handleAddUrl}
                  className="shrink-0 rounded-xl bg-secondary px-4 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80"
                >
                  Agregar
                </button>
              </div>
            )}

            {uploading && (
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Subiendo imagen…
              </p>
            )}
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="titulo" className="text-sm font-medium text-foreground">
          Título
        </label>
        <input
          id="titulo"
          required
          value={values.titulo}
          onChange={(e) => set('titulo', e.target.value)}
          className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="descripcion" className="text-sm font-medium text-foreground">
          Descripción
        </label>
        <textarea
          id="descripcion"
          required
          rows={3}
          value={values.descripcion}
          onChange={(e) => set('descripcion', e.target.value)}
          className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
        />
      </div>

      <div className="flex gap-3">
        <div className="flex-1 space-y-1.5">
          <label htmlFor="fecha" className="text-sm font-medium text-foreground">
            Fecha
          </label>
          <input
            id="fecha"
            type="date"
            required
            value={values.fecha}
            onChange={(e) => set('fecha', e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
          />
        </div>
        <div className="flex-1 space-y-1.5">
          <label htmlFor="hora" className="text-sm font-medium text-foreground">
            Hora (opcional)
          </label>
          <input
            id="hora"
            type="time"
            value={values.hora}
            onChange={(e) => set('hora', e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="ubicacion" className="text-sm font-medium text-foreground">
          Ubicación (opcional)
        </label>
        <input
          id="ubicacion"
          placeholder="Ej. Terraza"
          value={values.ubicacion}
          onChange={(e) => set('ubicacion', e.target.value)}
          className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
        />
      </div>

      <div className="flex gap-3">
        <div className="flex-1 space-y-1.5">
          <label htmlFor="precio" className="text-sm font-medium text-foreground">
            Precio (opcional)
          </label>
          <input
            id="precio"
            placeholder="Ej. Entrada liberada"
            value={values.precio}
            onChange={(e) => set('precio', e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
          />
        </div>
        <div className="flex-1 space-y-1.5">
          <label htmlFor="link" className="text-sm font-medium text-foreground">
            Link de reserva (opcional)
          </label>
          <input
            id="link"
            type="url"
            placeholder="https://…"
            value={values.link}
            onChange={(e) => set('link', e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
          />
        </div>
      </div>

      <label className="flex w-fit cursor-pointer items-center gap-2.5">
        <span className="text-sm font-medium text-foreground">Activo</span>
        <button
          type="button"
          role="switch"
          aria-checked={values.activo}
          onClick={() => set('activo', !values.activo)}
          className={cn(
            'relative h-6 w-11 rounded-full transition-colors',
            values.activo ? 'bg-brand' : 'bg-muted',
          )}
        >
          <span
            className={cn(
              'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
              values.activo ? 'translate-x-[22px]' : 'translate-x-0.5',
            )}
          />
        </button>
      </label>

      {error && <p className="text-sm font-medium text-destructive">{error}</p>}

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" size="pill" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="brand" size="pill" disabled={submitting || uploading}>
          {submitting ? 'Guardando…' : 'Guardar'}
        </Button>
      </div>
    </form>
  )
}

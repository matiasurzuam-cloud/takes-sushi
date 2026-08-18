'use client'

import { useState } from 'react'
import { ArrowLeft, ArrowRight, Link as LinkIcon, Loader2, Upload, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { SmartImage } from '@/components/ui/smart-image'
import type { Promocion } from '@/lib/promociones/types'

export interface PromocionFormValues {
  imagenes: string[]
  titulo: string
  descripcion: string
  link: string
  fechaExpiracion: string
  activo: boolean
  /** ISO: 1=lunes…7=domingo. Vacío = todos los días. */
  diasSemana: number[]
  horaInicio: string
  horaFin: string
}

const DIAS = [
  { value: 1, label: 'Lun' },
  { value: 2, label: 'Mar' },
  { value: 3, label: 'Mié' },
  { value: 4, label: 'Jue' },
  { value: 5, label: 'Vie' },
  { value: 6, label: 'Sáb' },
  { value: 7, label: 'Dom' },
]

interface PromocionFormProps {
  initial?: Promocion | null
  onSubmit: (values: PromocionFormValues) => Promise<void>
  onCancel: () => void
}

const MAX_IMAGENES = 4

const emptyValues: PromocionFormValues = {
  imagenes: [],
  titulo: '',
  descripcion: '',
  link: '',
  fechaExpiracion: '',
  activo: true,
  diasSemana: [],
  horaInicio: '',
  horaFin: '',
}

export function PromocionForm({ initial, onSubmit, onCancel }: PromocionFormProps) {
  const [values, setValues] = useState<PromocionFormValues>(
    initial
      ? {
          imagenes: initial.imagenes,
          titulo: initial.titulo,
          descripcion: initial.descripcion,
          link: initial.link ?? '',
          fechaExpiracion: initial.fechaExpiracion?.slice(0, 10) ?? '',
          activo: initial.activo,
          diasSemana: initial.diasSemana ?? [],
          horaInicio: initial.horaInicio ?? '',
          horaFin: initial.horaFin ?? '',
        }
      : emptyValues,
  )
  const [imageMode, setImageMode] = useState<'upload' | 'url'>('upload')
  const [urlDraft, setUrlDraft] = useState('')
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function set<K extends keyof PromocionFormValues>(key: K, value: PromocionFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }))
  }

  function toggleDia(dia: number) {
    setValues((v) => ({
      ...v,
      diasSemana: v.diasSemana.includes(dia)
        ? v.diasSemana.filter((d) => d !== dia)
        : [...v.diasSemana, dia].sort((a, b) => a - b),
    }))
  }

  function addImagen(path: string) {
    setValues((v) => ({ ...v, imagenes: [...v.imagenes, path].slice(0, MAX_IMAGENES) }))
  }

  function removeImagen(index: number) {
    setValues((v) => ({ ...v, imagenes: v.imagenes.filter((_, i) => i !== index) }))
  }

  function moveImagen(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= values.imagenes.length) return
    setValues((v) => {
      const next = [...v.imagenes]
      ;[next[index], next[target]] = [next[target], next[index]]
      return { ...v, imagenes: next }
    })
  }

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
      addImagen(data.path)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo subir la imagen')
    } finally {
      setUploading(false)
    }
  }

  function handleAddUrl() {
    if (!urlDraft.trim()) return
    addImagen(urlDraft.trim())
    setUrlDraft('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (values.imagenes.length === 0) {
      setError('Agrega al menos una imagen (subiendo un archivo o pegando una URL).')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      await onSubmit(values)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar la promoción')
      setSubmitting(false)
    }
  }

  const canAddMore = values.imagenes.length < MAX_IMAGENES

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Imágenes: hasta 4. La primera es la principal (grande) del collage
          en el pop-up; el resto aparece en los espacios chicos al lado. */}
      <div className="space-y-2">
        <span className="text-sm font-medium text-foreground">
          Imágenes ({values.imagenes.length}/{MAX_IMAGENES})
        </span>

        {values.imagenes.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {values.imagenes.map((src, i) => (
              <div key={i} className="relative">
                <div
                  className={cn(
                    'relative h-20 w-20 overflow-hidden rounded-xl border bg-muted',
                    i === 0 ? 'border-brand ring-2 ring-brand/30' : 'border-border',
                  )}
                >
                  <SmartImage src={src} alt={`Imagen ${i + 1}`} fill className="object-cover" sizes="5rem" />
                </div>
                {i === 0 && (
                  <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 rounded-full bg-brand px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide text-brand-foreground">
                    Principal
                  </span>
                )}
                <div className="mt-1 flex items-center justify-center gap-0.5">
                  <button
                    type="button"
                    onClick={() => moveImagen(i, -1)}
                    disabled={i === 0}
                    aria-label="Mover antes"
                    className="inline-flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
                  >
                    <ArrowLeft className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImagen(i)}
                    aria-label="Quitar imagen"
                    className="inline-flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveImagen(i, 1)}
                    disabled={i === values.imagenes.length - 1}
                    aria-label="Mover después"
                    className="inline-flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
                  >
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {canAddMore ? (
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
        ) : (
          <p className="text-xs text-muted-foreground">
            Llegaste al máximo de {MAX_IMAGENES} imágenes. Quita alguna para agregar otra.
          </p>
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

      <div className="space-y-1.5">
        <label htmlFor="link" className="text-sm font-medium text-foreground">
          Link de acción (opcional)
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

      <div className="space-y-2">
        <span className="text-sm font-medium text-foreground">Días de la semana</span>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => set('diasSemana', [])}
            className={cn(
              'rounded-full px-3 py-1.5 text-xs font-semibold transition-colors',
              values.diasSemana.length === 0
                ? 'bg-brand text-brand-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
            )}
          >
            Todos los días
          </button>
          {DIAS.map((dia) => (
            <button
              key={dia.value}
              type="button"
              onClick={() => toggleDia(dia.value)}
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-semibold transition-colors',
                values.diasSemana.includes(dia.value)
                  ? 'bg-brand text-brand-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
              )}
            >
              {dia.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-sm font-medium text-foreground">Rango horario (opcional)</span>
        <div className="flex items-center gap-3">
          <input
            type="time"
            aria-label="Hora de inicio"
            value={values.horaInicio}
            onChange={(e) => set('horaInicio', e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
          />
          <span className="text-sm text-muted-foreground">a</span>
          <input
            type="time"
            aria-label="Hora de fin"
            value={values.horaFin}
            onChange={(e) => set('horaFin', e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Ej. "Solo de 12:00 a 15:00". Dejar ambos vacíos para todo el día.
        </p>
      </div>

      <div className="flex items-end gap-4">
        <div className="flex-1 space-y-1.5">
          <label htmlFor="fechaExpiracion" className="text-sm font-medium text-foreground">
            Fecha de expiración (opcional)
          </label>
          <input
            id="fechaExpiracion"
            type="date"
            value={values.fechaExpiracion}
            onChange={(e) => set('fechaExpiracion', e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
          />
        </div>

        <label className="flex cursor-pointer items-center gap-2.5 pb-2.5">
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
      </div>

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

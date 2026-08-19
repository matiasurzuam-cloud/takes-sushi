'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, LogOut, Trash2, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { SmartImage } from '@/components/ui/smart-image'
import { AdminNav } from './admin-nav'
import { MAX_FOTOS, type CategoriaGaleria, type GaleriaFoto } from '@/lib/galeria/types'

const CATEGORIAS: { value: CategoriaGaleria; label: string }[] = [
  { value: 'sushi', label: 'Sushi' },
  { value: 'cafe', label: 'Café' },
  { value: 'local', label: 'Local' },
]

const CATEGORIA_LABEL: Record<CategoriaGaleria, string> = {
  sushi: 'Sushi',
  cafe: 'Café',
  local: 'Local',
}

interface GaleriaAdminProps {
  initialFotos: GaleriaFoto[]
}

export function GaleriaAdmin({ initialFotos }: GaleriaAdminProps) {
  const router = useRouter()
  const [fotos, setFotos] = useState(initialFotos)
  const [alt, setAlt] = useState('')
  const [categoria, setCategoria] = useState<CategoriaGaleria>('local')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  async function refresh() {
    const res = await fetch('/api/galeria')
    if (res.ok) setFotos(await res.json())
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''

    if (!alt.trim()) {
      setError('Escribe una breve descripción antes de subir la foto.')
      return
    }

    setUploading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('alt', alt.trim())
      formData.append('categoria', categoria)
      const res = await fetch('/api/galeria', { method: 'POST', body: formData })
      const data = await res.json().catch(() => null)
      if (!res.ok) throw new Error(data?.error ?? 'No se pudo subir la foto')
      setAlt('')
      await refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo subir la foto')
    } finally {
      setUploading(false)
    }
  }

  async function handleDelete(foto: GaleriaFoto) {
    if (!confirm('¿Eliminar esta foto de la galería? Esta acción no se puede deshacer.')) return
    setBusyId(foto.id)
    await fetch(`/api/galeria/${foto.id}`, { method: 'DELETE' })
    await refresh()
    setBusyId(null)
  }

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.replace('/admin/login')
    router.refresh()
  }

  const canUpload = !uploading && alt.trim().length > 0

  return (
    <div>
      <AdminNav />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Galería</h1>
          <p className="text-sm text-muted-foreground">
            {fotos.length}/{MAX_FOTOS} fotos — al subir la {MAX_FOTOS + 1}.ª se borra
            automáticamente la más antigua.
          </p>
        </div>
        <Button variant="outline" size="pill" onClick={handleLogout}>
          <LogOut className="h-4 w-4" /> Salir
        </Button>
      </div>

      <div className="mt-8 rounded-3xl border border-dashed border-border bg-card p-5 shadow-sm">
        <p className="text-sm font-semibold text-foreground">Agregar foto</p>
        <div className="mt-3 flex flex-wrap items-end gap-3">
          <div className="min-w-[220px] flex-1 space-y-1.5">
            <label htmlFor="alt" className="text-xs font-medium text-muted-foreground">
              Descripción (para accesibilidad)
            </label>
            <input
              id="alt"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="Ej. Roll de salmón recién preparado"
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
            />
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground">Categoría</span>
            <div className="flex gap-1.5">
              {CATEGORIAS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setCategoria(c.value)}
                  className={cn(
                    'rounded-full px-3 py-1.5 text-xs font-semibold transition-colors',
                    categoria === c.value
                      ? 'bg-brand text-brand-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
                  )}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <label
            className={cn(
              'inline-flex shrink-0 items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground transition-colors',
              canUpload ? 'cursor-pointer hover:bg-brand/85' : 'pointer-events-none opacity-50',
            )}
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {uploading ? 'Subiendo…' : 'Elegir imagen'}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleFileChange}
              disabled={!canUpload}
              className="hidden"
            />
          </label>
        </div>

        {error && <p className="mt-3 text-sm font-medium text-destructive">{error}</p>}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {fotos.map((foto) => (
          <div
            key={foto.id}
            className="group relative overflow-hidden rounded-2xl border border-border bg-muted shadow-sm"
          >
            <div className="relative aspect-square">
              <SmartImage
                src={foto.imagen}
                alt={foto.alt}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, 25vw"
              />
            </div>
            <span className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-white">
              {CATEGORIA_LABEL[foto.categoria]}
            </span>
            <button
              type="button"
              onClick={() => handleDelete(foto)}
              disabled={busyId === foto.id}
              aria-label="Eliminar foto"
              className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-destructive disabled:pointer-events-none disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <p className="truncate bg-card p-2 text-xs text-muted-foreground">{foto.alt}</p>
          </div>
        ))}

        {fotos.length === 0 && (
          <div className="col-span-full rounded-3xl border border-border bg-card p-10 text-center text-sm text-muted-foreground shadow-sm">
            Todavía no hay fotos en la galería. Sube la primera arriba.
          </div>
        )}
      </div>
    </div>
  )
}

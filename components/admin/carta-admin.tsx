'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Info, Loader2, LogOut, RotateCcw, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { SmartImage } from '@/components/ui/smart-image'
import { AdminNav } from './admin-nav'
import type { MenuCategoryMeta } from '@/lib/menu/categories'

interface CartaAdminProps {
  categories: MenuCategoryMeta[]
  /** Solo las categorías con imagen personalizada (ver /api/menu-categorias). */
  initialOverrides: Record<string, string>
}

export function CartaAdmin({ categories, initialOverrides }: CartaAdminProps) {
  const router = useRouter()
  const [overrides, setOverrides] = useState(initialOverrides)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function saveImage(categoryId: string, imagen: string | null) {
    setBusyId(categoryId)
    setError(null)
    try {
      const res = await fetch('/api/menu-categorias', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryId, imagen }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) throw new Error(data?.error ?? 'No se pudo guardar')
      setOverrides(data as Record<string, string>)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar')
    } finally {
      setBusyId(null)
    }
  }

  async function handleFileChange(categoryId: string, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''

    setBusyId(categoryId)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/promociones/upload', { method: 'POST', body: formData })
      const data = await res.json().catch(() => null)
      if (!res.ok) throw new Error(data?.error ?? 'No se pudo subir la imagen')
      await saveImage(categoryId, data.path)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo subir la imagen')
      setBusyId(null)
    }
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
          <h1 className="text-2xl font-extrabold text-foreground">Carta — Imágenes de categoría</h1>
          <p className="text-sm text-muted-foreground">
            La foto grande que aparece al elegir cada pestaña en &quot;Explora nuestro menú&quot;.
          </p>
        </div>
        <Button variant="outline" size="pill" onClick={handleLogout}>
          <LogOut className="h-4 w-4" /> Salir
        </Button>
      </div>

      <p className="mt-4 flex items-start gap-1.5 rounded-2xl border border-dashed border-border bg-card p-4 text-xs leading-relaxed text-muted-foreground">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        Ideal: foto horizontal (apaisada), proporción entre 16:7 y 16:5 — por
        ejemplo <strong className="text-foreground">1600×700px</strong> o más
        grande. Se recorta desde el centro según el ancho de pantalla (más
        panorámica en desktop, algo más cuadrada en celular), así que evita
        detalles importantes muy cerca de los bordes izquierdo/derecho.
      </p>

      {error && <p className="mt-3 text-sm font-medium text-destructive">{error}</p>}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {categories.map((cat) => {
          const image = overrides[cat.id] || cat.defaultImage
          const hasOverride = Boolean(overrides[cat.id])
          const busy = busyId === cat.id

          return (
            <div
              key={cat.id}
              className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm"
            >
              <div className="relative aspect-[16/7]">
                <SmartImage
                  src={image}
                  alt={cat.label}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                {hasOverride && (
                  <span className="absolute left-2 top-2 rounded-full bg-brand px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-brand-foreground">
                    Personalizada
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between gap-3 p-4">
                <p className="min-w-0 truncate text-sm font-bold text-foreground">{cat.label}</p>
                <div className="flex shrink-0 items-center gap-2">
                  {hasOverride && (
                    <button
                      type="button"
                      onClick={() => saveImage(cat.id, null)}
                      disabled={busy}
                      aria-label="Restaurar imagen original"
                      title="Restaurar imagen original"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                  )}
                  <label
                    className={cn(
                      'inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-secondary px-3.5 py-2 text-xs font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80',
                      busy && 'pointer-events-none opacity-50',
                    )}
                  >
                    {busy ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Upload className="h-3.5 w-3.5" />
                    )}
                    {busy ? 'Subiendo…' : 'Cambiar'}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={(e) => handleFileChange(cat.id, e)}
                      disabled={busy}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Info, Loader2, LogOut, RotateCcw, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { SmartImage } from '@/components/ui/smart-image'
import { AdminNav } from './admin-nav'
import { DEFAULT_HERO_IMAGE } from '@/components/hero-parallax-bg'

interface InicioAdminProps {
  initialImagen: string
}

export function InicioAdmin({ initialImagen }: InicioAdminProps) {
  const router = useRouter()
  const [imagen, setImagen] = useState(initialImagen)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const hasOverride = Boolean(imagen)
  const preview = imagen || DEFAULT_HERO_IMAGE

  async function saveImagen(next: string | null) {
    setBusy(true)
    setError(null)
    try {
      const res = await fetch('/api/hero-imagen', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imagen: next }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) throw new Error(data?.error ?? 'No se pudo guardar')
      setImagen(data.imagen ?? '')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar')
    } finally {
      setBusy(false)
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''

    setBusy(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/promociones/upload', { method: 'POST', body: formData })
      const data = await res.json().catch(() => null)
      if (!res.ok) throw new Error(data?.error ?? 'No se pudo subir la imagen')
      await saveImagen(data.path)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo subir la imagen')
      setBusy(false)
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
          <h1 className="text-2xl font-extrabold text-foreground">Inicio — Fondo del Hero</h1>
          <p className="text-sm text-muted-foreground">
            La imagen de fondo grande de la primera pantalla, arriba de todo.
          </p>
        </div>
        <Button variant="outline" size="pill" onClick={handleLogout}>
          <LogOut className="h-4 w-4" /> Salir
        </Button>
      </div>

      <p className="mt-4 flex items-start gap-1.5 rounded-2xl border border-dashed border-border bg-card p-4 text-xs leading-relaxed text-muted-foreground">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        Esta imagen cubre toda la pantalla (de punta a punta, alto y ancho), así
        que se recorta MUCHO más que el resto de las fotos del sitio: desde muy
        panorámica en un monitor ancho hasta casi vertical en un celular. Usa
        una foto grande y de buena calidad —{' '}
        <strong className="text-foreground">al menos 2400×2400px</strong>, cuadrada
        o algo más ancha que alta— con el sujeto centrado y repartido por toda
        la imagen (no un solo plato pegado a un borde), para que se vea bien sin
        importar cuánto se recorte a los costados o arriba/abajo.
      </p>

      {error && <p className="mt-3 text-sm font-medium text-destructive">{error}</p>}

      <div className="mt-6 overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        <div className="relative aspect-[16/9]">
          <SmartImage
            src={preview}
            alt="Fondo del Hero"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 48rem"
          />
          {hasOverride && (
            <span className="absolute left-3 top-3 rounded-full bg-brand px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-brand-foreground">
              Personalizada
            </span>
          )}
        </div>
        <div className="flex items-center justify-between gap-3 p-4">
          <p className="text-sm text-muted-foreground">
            {hasOverride ? 'Imagen personalizada activa.' : 'Usando la imagen por defecto.'}
          </p>
          <div className="flex shrink-0 items-center gap-2">
            {hasOverride && (
              <button
                type="button"
                onClick={() => saveImagen(null)}
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
              {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
              {busy ? 'Subiendo…' : 'Cambiar imagen'}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileChange}
                disabled={busy}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

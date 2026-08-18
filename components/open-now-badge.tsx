'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { getSantiagoParts } from '@/lib/timezone'
import type { HorarioBloque } from '@/lib/content'

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

function calcularAbierto(bloques: HorarioBloque[], now: Date): boolean {
  const { weekdayJs, hour, minute } = getSantiagoParts(now)
  const nowMinutes = hour * 60 + minute

  return bloques.some((bloque) => {
    if (!bloque.dias.includes(weekdayJs)) return false
    const abre = toMinutes(bloque.abre)
    let cierra = toMinutes(bloque.cierra)
    let actual = nowMinutes
    // Soporta horarios que cruzan medianoche (ej. abre 18:00, cierra 02:00).
    if (cierra <= abre) cierra += 24 * 60
    if (actual < abre) actual += 24 * 60
    return actual >= abre && actual < cierra
  })
}

interface OpenNowBadgeProps {
  horarioSemanal: HorarioBloque[]
  className?: string
}

// Se calcula en el cliente (no en el servidor) porque la home es estática:
// si esto se calculara al hacer build, quedaría "congelado" en el momento
// del build en vez de reflejar la hora real de cada visita.
export function OpenNowBadge({ horarioSemanal, className }: OpenNowBadgeProps) {
  const [abierto, setAbierto] = useState<boolean | null>(null)

  useEffect(() => {
    if (horarioSemanal.length === 0) return
    const check = () => setAbierto(calcularAbierto(horarioSemanal, new Date()))
    check()
    const id = setInterval(check, 60_000)
    return () => clearInterval(id)
  }, [horarioSemanal])

  if (abierto === null) return null

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm',
        className,
      )}
    >
      <span
        className={cn(
          'h-1.5 w-1.5 rounded-full',
          abierto ? 'bg-brand animate-pulse-soft' : 'bg-white/40',
        )}
      />
      {abierto ? 'Abierto ahora' : 'Cerrado ahora'}
    </span>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface PromoCountdownProps {
  /** Instante (ms) hasta el que cuenta — ver lib/promociones/vigencia.ts
   * → proximoCierreMs (cierre de la ventana horaria diaria si aplica hoy,
   * o fin del día de fechaExpiracion). */
  targetMs: number
  className?: string
  /** 'evento': cuenta regresiva a que empiece, en vez de a que venza. */
  variant?: 'promocion' | 'evento'
}

interface Restante {
  dias: number
  horas: number
  minutos: number
  segundos: number
  totalMs: number
}

function calcularRestante(targetMs: number, nowMs: number): Restante {
  const totalMs = Math.max(0, targetMs - nowMs)
  const totalSeg = Math.floor(totalMs / 1000)
  return {
    dias: Math.floor(totalSeg / 86_400),
    horas: Math.floor((totalSeg % 86_400) / 3600),
    minutos: Math.floor((totalSeg % 3600) / 60),
    segundos: totalSeg % 60,
    totalMs,
  }
}

// Countdown en vivo, visualmente urgente. Muestra días si falta más de un
// día; por debajo de eso, tickea en segundos reales ("Termina en 2h 14min
// 32seg"). `targetMs` ya viene resuelto por el caller (ver arriba) — este
// componente solo cuenta hacia atrás, no decide de dónde sale la fecha.
export function PromoCountdown({ targetMs, className, variant = 'promocion' }: PromoCountdownProps) {
  const [restante, setRestante] = useState<Restante | null>(null)

  useEffect(() => {
    const tick = () => setRestante(calcularRestante(targetMs, Date.now()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [targetMs])

  if (!restante || restante.totalMs <= 0) return null

  const verboEvento = restante.dias === 1 ? 'Falta' : 'Faltan'
  const verbo = variant === 'evento' ? verboEvento : 'Vence en'
  const texto =
    restante.dias >= 1
      ? `${verbo} ${restante.dias} ${restante.dias === 1 ? 'día' : 'días'}`
      : `${variant === 'evento' ? 'Empieza en' : 'Termina en'} ${restante.horas}h ${String(
          restante.minutos,
        ).padStart(2, '0')}min ${String(restante.segundos).padStart(2, '0')}seg`

  return (
    <div
      className={cn(
        'inline-flex w-fit items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3.5 py-1.5 text-xs font-bold text-accent',
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-soft" />
      {texto}
    </div>
  )
}

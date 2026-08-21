// Zona horaria del local — fija, independiente de dónde esté el visitante
// o el servidor que renderiza la página. La usan tanto "Abierto ahora"
// (components/open-now-badge.tsx) como la vigencia de promociones
// (lib/promociones/vigencia.ts).
export const TIMEZONE = 'America/Santiago'

const WEEKDAY_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
}

export interface SantiagoParts {
  /** 0 = domingo … 6 = sábado (convención de Date.getDay()). */
  weekdayJs: number
  hour: number
  minute: number
  /** "YYYY-MM-DD" en hora de Santiago. */
  dateISO: string
}

export function getSantiagoParts(now: Date): SantiagoParts {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23', // evita que medianoche salga como "24" en vez de "00"
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now)

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? ''

  return {
    weekdayJs: WEEKDAY_INDEX[get('weekday')] ?? 0,
    hour: Number(get('hour')),
    minute: Number(get('minute')),
    dateISO: `${get('year')}-${get('month')}-${get('day')}`,
  }
}

/** "2026-08-23" -> "2026-08-24". Suma un día calendario a una fecha ISO. */
export function addOneDayISO(dateISO: string): string {
  const d = new Date(`${dateISO}T00:00:00.000Z`)
  d.setUTCDate(d.getUTCDate() + 1)
  return d.toISOString().slice(0, 10)
}

/**
 * Instante UTC (en ms) que corresponde a las 00:00:00 de `dateISO`
 * ("YYYY-MM-DD") en hora de Santiago. Usa el truco estándar de "ida y
 * vuelta" para no depender de un offset fijo (Chile tiene horario de
 * verano) ni de una librería de fechas.
 */
export function santiagoMidnightUtcMs(dateISO: string): number {
  const asUtc = new Date(`${dateISO}T00:00:00.000Z`)

  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(asUtc)
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '00'

  // Lo que marca el reloj de Santiago en el instante `asUtc`, reinterpretado
  // como si fuera UTC — la diferencia con `asUtc` es el offset real vigente.
  const readAsUtc = new Date(
    `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}:${get('second')}.000Z`,
  )
  const offsetMs = asUtc.getTime() - readAsUtc.getTime()
  return asUtc.getTime() + offsetMs
}

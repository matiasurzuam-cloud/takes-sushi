const UNITS: { limit: number; divisor: number; unit: Intl.RelativeTimeFormatUnit }[] = [
  { limit: 60, divisor: 1, unit: 'second' },
  { limit: 3600, divisor: 60, unit: 'minute' },
  { limit: 86400, divisor: 3600, unit: 'hour' },
  { limit: 604800, divisor: 86400, unit: 'day' },
  { limit: 2629800, divisor: 604800, unit: 'week' },
  { limit: 31557600, divisor: 2629800, unit: 'month' },
  { limit: Infinity, divisor: 31557600, unit: 'year' },
]

const formatter = new Intl.RelativeTimeFormat('es', { numeric: 'auto' })

/** "2026-06-12" -> "hace 2 semanas". */
export function formatFechaRelativa(fechaISO: string, ahora: Date = new Date()): string {
  const segundos = (ahora.getTime() - new Date(fechaISO).getTime()) / 1000
  const { divisor, unit } = UNITS.find((u) => segundos < u.limit) ?? UNITS[UNITS.length - 1]
  const valor = Math.round(segundos / divisor)
  return formatter.format(-valor, unit)
}

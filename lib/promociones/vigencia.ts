import { addOneDayISO, getSantiagoParts, santiagoMidnightUtcMs } from '@/lib/timezone'
import type { Promocion } from './types'

// IMPORTANTE — convención de días: `promo.diasSemana` usa 1=lunes…7=domingo
// (ISO 8601, así lo pidió el usuario y así quedó en supabase/schema.sql),
// a propósito distinta de `HorarioBloque.dias` en site_config → contacto
// (que usa 0=domingo…6=sábado, la convención de Date.getDay()/getSantiagoParts).
// Por eso acá se convierte explícitamente en vez de reusar el número crudo.
function weekdayJsToIso(weekdayJs: number): number {
  return weekdayJs === 0 ? 7 : weekdayJs
}

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

function enRangoHorario(horaInicio: string, horaFin: string, hour: number, minute: number): boolean {
  const inicio = toMinutes(horaInicio)
  let fin = toMinutes(horaFin)
  let actual = hour * 60 + minute
  // Soporta rangos que cruzan medianoche (ej. 18:00 a 02:00).
  if (fin <= inicio) fin += 24 * 60
  if (actual < inicio) actual += 24 * 60
  return actual >= inicio && actual < fin
}

/** true si la promo se puede mostrar en este instante (hora de Santiago). */
export function estaVigenteAhora(promo: Promocion, now: Date): boolean {
  if (!promo.activo) return false

  const { weekdayJs, hour, minute, dateISO } = getSantiagoParts(now)

  // Vigente hasta el final del día de expiración (inclusive), no desde su inicio.
  if (promo.fechaExpiracion && dateISO > promo.fechaExpiracion) return false

  if (promo.diasSemana && promo.diasSemana.length > 0) {
    const isoWeekday = weekdayJsToIso(weekdayJs)
    if (!promo.diasSemana.includes(isoWeekday)) return false
  }

  if (promo.horaInicio && promo.horaFin) {
    if (!enRangoHorario(promo.horaInicio, promo.horaFin, hour, minute)) return false
  }

  return true
}

/**
 * Instante (ms) del próximo cierre de la promo — para mostrar un cronómetro
 * real de "cuánto queda". Dos casos:
 * - Si está dentro de su ventana horaria diaria ahora mismo (ej. Happy Hour
 *   17-19hrs), el cierre relevante es el de HOY: más útil como urgencia real
 *   que fechaExpiracion, que puede ser semanas después y no dice nada sobre
 *   que la promo deja de verse en un par de horas.
 * - Si no, cae en fechaExpiracion (fin de ese día) si existe.
 * - Si no tiene ninguna de las dos, `null` — promo indefinida, sin cronómetro.
 *
 * El cálculo de minutos restantes reusa la misma aritmética que
 * `enRangoHorario` (incluye el soporte para rangos que cruzan medianoche),
 * pero trabajando en "minutos desde ahora" en vez de fechas de calendario
 * — así no hay que decidir aparte si el hora_fin cae hoy o mañana.
 */
export function proximoCierreMs(promo: Promocion, now: Date): number | null {
  if (promo.horaInicio && promo.horaFin) {
    const { hour, minute } = getSantiagoParts(now)
    const inicio = toMinutes(promo.horaInicio)
    let fin = toMinutes(promo.horaFin)
    let actual = hour * 60 + minute
    if (fin <= inicio) fin += 24 * 60
    if (actual < inicio) actual += 24 * 60

    if (actual >= inicio && actual < fin) {
      const minutosRestantes = fin - actual
      return now.getTime() + minutosRestantes * 60_000
    }
  }

  if (promo.fechaExpiracion) {
    return santiagoMidnightUtcMs(addOneDayISO(promo.fechaExpiracion))
  }

  return null
}

/**
 * Filtra a las promos vigentes ahora mismo y las ordena por `orden`. Si hay
 * varias vigentes a la vez, la primera del arreglo es "la" promo principal
 * — el carrusel del pop-up igual puede rotar entre el resto.
 */
export function elegirPromosVigentes(promos: Promocion[], now: Date): Promocion[] {
  return promos.filter((p) => estaVigenteAhora(p, now)).sort((a, b) => a.orden - b.orden)
}

const DIA_LABEL = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']

function formatDiasSemana(dias: number[]): string {
  // dias viene en convención ISO (1=lunes…7=domingo); DIA_LABEL está indexado 0=domingo.
  const nombres = dias.map((d) => DIA_LABEL[d % 7])
  if (nombres.length === 1) return `Solo ${nombres[0]}`
  return `Solo ${nombres.slice(0, -1).join(', ')} y ${nombres[nombres.length - 1]}`
}

/** Etiqueta corta para el badge de vigencia en la lista del admin. */
export function describirVigencia(promo: Promocion, now: Date): string {
  if (!promo.activo) return 'Inactiva'

  const { dateISO } = getSantiagoParts(now)
  if (promo.fechaExpiracion) {
    if (dateISO > promo.fechaExpiracion) return 'Vencida'
    const diasRestantes = Math.round(
      (new Date(`${promo.fechaExpiracion}T00:00:00`).getTime() -
        new Date(`${dateISO}T00:00:00`).getTime()) /
        86_400_000,
    )
    if (diasRestantes === 0) return 'Vence hoy'
    if (diasRestantes === 1) return 'Vence mañana'
    if (diasRestantes > 1) return `Vence en ${diasRestantes} días`
  }

  if (!estaVigenteAhora(promo, now)) {
    if (promo.diasSemana && promo.diasSemana.length > 0) {
      return formatDiasSemana(promo.diasSemana)
    }
    if (promo.horaInicio && promo.horaFin) {
      return `Fuera de horario (${promo.horaInicio}-${promo.horaFin})`
    }
    return 'No vigente'
  }

  if (promo.diasSemana && promo.diasSemana.length > 0) {
    return `Vigente ahora — ${formatDiasSemana(promo.diasSemana).toLowerCase()}`
  }
  if (promo.horaInicio && promo.horaFin) {
    return `Vigente ahora (${promo.horaInicio}-${promo.horaFin})`
  }
  return 'Vigente ahora'
}

import { supabaseAdmin } from '@/lib/supabase/admin'
import { getSantiagoParts } from '@/lib/timezone'
import type { Promocion, PromocionInput } from './types'

/**
 * Capa de acceso a datos para promociones (tabla `promociones` en Supabase
 * — ver supabase/schema.sql). El resto de la app (API routes, páginas)
 * solo conoce la interfaz `PromocionesRepository` — para cambiar de motor
 * de datos alcanza con escribir una nueva clase que la implemente y
 * cambiar la instancia exportada al final de este archivo.
 */
export interface PromocionesRepository {
  getAll(): Promise<Promocion[]>
  getById(id: string): Promise<Promocion | null>
  getActivas(): Promise<Promocion[]>
  create(input: PromocionInput): Promise<Promocion>
  update(id: string, input: Partial<Omit<Promocion, 'id'>>): Promise<Promocion | null>
  remove(id: string): Promise<boolean>
  reorder(orderedIds: string[]): Promise<Promocion[]>
}

interface PromocionRow {
  id: string
  imagenes: string[]
  titulo: string
  descripcion: string
  link: string | null
  fecha_expiracion: string | null
  activo: boolean
  orden: number
  dias_semana: number[] | null
  hora_inicio: string | null
  hora_fin: string | null
}

// Postgres devuelve `time` como "HH:MM:SS" — lo recortamos a "HH:MM" para
// que coincida con el formato que usa el resto de la app (ver HorarioBloque).
function toHHMM(value: string | null): string | undefined {
  return value ? value.slice(0, 5) : undefined
}

function fromRow(row: PromocionRow): Promocion {
  return {
    id: row.id,
    imagenes: row.imagenes,
    titulo: row.titulo,
    descripcion: row.descripcion,
    link: row.link ?? undefined,
    fechaExpiracion: row.fecha_expiracion ?? undefined,
    activo: row.activo,
    orden: row.orden,
    diasSemana: row.dias_semana ?? undefined,
    horaInicio: toHHMM(row.hora_inicio),
    horaFin: toHHMM(row.hora_fin),
  }
}

// Solo incluye las claves presentes en `input` — así un PUT parcial (ej.
// { activo: false }) no pisa el resto de las columnas con `undefined`.
function toRow(input: Partial<PromocionInput & { orden: number }>): Record<string, unknown> {
  const row: Record<string, unknown> = {}
  if (input.imagenes !== undefined) row.imagenes = input.imagenes
  if (input.titulo !== undefined) row.titulo = input.titulo
  if (input.descripcion !== undefined) row.descripcion = input.descripcion
  if (input.link !== undefined) row.link = input.link || null
  if (input.fechaExpiracion !== undefined) row.fecha_expiracion = input.fechaExpiracion || null
  if (input.activo !== undefined) row.activo = input.activo
  if (input.orden !== undefined) row.orden = input.orden
  if (input.diasSemana !== undefined) {
    row.dias_semana = input.diasSemana && input.diasSemana.length > 0 ? input.diasSemana : null
  }
  if (input.horaInicio !== undefined) row.hora_inicio = input.horaInicio || null
  if (input.horaFin !== undefined) row.hora_fin = input.horaFin || null
  return row
}

const TABLE = 'promociones'

class SupabasePromocionesRepository implements PromocionesRepository {
  async getAll() {
    const { data, error } = await supabaseAdmin.from(TABLE).select('*').order('orden')
    if (error) throw error
    return (data as PromocionRow[]).map(fromRow)
  }

  async getById(id: string) {
    const { data, error } = await supabaseAdmin.from(TABLE).select('*').eq('id', id).maybeSingle()
    if (error) throw error
    return data ? fromRow(data as PromocionRow) : null
  }

  // Usado por el pop-up público: solo promociones activas y no vencidas.
  // El filtro por día/hora (dias_semana, hora_inicio/hora_fin) NO se hace
  // acá — se recalcula en el cliente para que no quede pisado por el
  // caché ISR de la home ni desincronizado del countdown. Ver
  // lib/promociones/vigencia.ts.
  async getActivas() {
    const { dateISO: hoy } = getSantiagoParts(new Date())
    const { data, error } = await supabaseAdmin
      .from(TABLE)
      .select('*')
      .eq('activo', true)
      .or(`fecha_expiracion.is.null,fecha_expiracion.gte.${hoy}`)
      .order('orden')
    if (error) throw error
    return (data as PromocionRow[]).map(fromRow)
  }

  async create(input: PromocionInput) {
    const { data: last } = await supabaseAdmin
      .from(TABLE)
      .select('orden')
      .order('orden', { ascending: false })
      .limit(1)
      .maybeSingle()
    const orden = last ? (last as { orden: number }).orden + 1 : 0

    const { data, error } = await supabaseAdmin
      .from(TABLE)
      .insert(toRow({ ...input, orden }))
      .select()
      .single()
    if (error) throw error
    return fromRow(data as PromocionRow)
  }

  async update(id: string, input: Partial<Omit<Promocion, 'id'>>) {
    const { data, error } = await supabaseAdmin
      .from(TABLE)
      .update(toRow(input))
      .eq('id', id)
      .select()
      .maybeSingle()
    if (error) throw error
    return data ? fromRow(data as PromocionRow) : null
  }

  async remove(id: string) {
    const { error, count } = await supabaseAdmin
      .from(TABLE)
      .delete({ count: 'exact' })
      .eq('id', id)
    if (error) throw error
    return (count ?? 0) > 0
  }

  // Reasigna `orden` según la posición de cada id en `orderedIds`.
  async reorder(orderedIds: string[]) {
    await Promise.all(
      orderedIds.map((id, i) => supabaseAdmin.from(TABLE).update({ orden: i }).eq('id', id)),
    )
    return this.getAll()
  }
}

// Punto único de instanciación: cambiar esta línea (y agregar la clase
// equivalente) es todo lo que hace falta para migrar de motor de datos.
export const promocionesRepo: PromocionesRepository = new SupabasePromocionesRepository()

import { supabaseAdmin } from '@/lib/supabase/admin'
import { getSantiagoParts } from '@/lib/timezone'
import type { Evento, EventoInput } from './types'

/**
 * Capa de acceso a datos para eventos (tabla `eventos` en Supabase — ver
 * supabase/schema.sql). Mismo patrón que lib/promociones/store.ts: no hay
 * campo `orden` porque el orden natural de un catálogo de eventos es la
 * fecha, no una posición manual.
 */
export interface EventosRepository {
  getAll(): Promise<Evento[]>
  getById(id: string): Promise<Evento | null>
  getProximos(): Promise<Evento[]>
  getPasados(): Promise<Evento[]>
  create(input: EventoInput): Promise<Evento>
  update(id: string, input: Partial<Omit<Evento, 'id'>>): Promise<Evento | null>
  remove(id: string): Promise<boolean>
}

interface EventoRow {
  id: string
  imagen: string
  titulo: string
  descripcion: string
  fecha: string
  hora: string | null
  ubicacion: string | null
  precio: string | null
  link: string | null
  activo: boolean
}

function toHHMM(value: string | null): string | undefined {
  return value ? value.slice(0, 5) : undefined
}

function fromRow(row: EventoRow): Evento {
  return {
    id: row.id,
    imagen: row.imagen,
    titulo: row.titulo,
    descripcion: row.descripcion,
    fecha: row.fecha,
    hora: toHHMM(row.hora),
    ubicacion: row.ubicacion ?? undefined,
    precio: row.precio ?? undefined,
    link: row.link ?? undefined,
    activo: row.activo,
  }
}

// Solo incluye las claves presentes en `input` — así un PUT parcial (ej.
// { activo: false }) no pisa el resto de las columnas con `undefined`.
function toRow(input: Partial<EventoInput>): Record<string, unknown> {
  const row: Record<string, unknown> = {}
  if (input.imagen !== undefined) row.imagen = input.imagen
  if (input.titulo !== undefined) row.titulo = input.titulo
  if (input.descripcion !== undefined) row.descripcion = input.descripcion
  if (input.fecha !== undefined) row.fecha = input.fecha
  if (input.hora !== undefined) row.hora = input.hora || null
  if (input.ubicacion !== undefined) row.ubicacion = input.ubicacion || null
  if (input.precio !== undefined) row.precio = input.precio || null
  if (input.link !== undefined) row.link = input.link || null
  if (input.activo !== undefined) row.activo = input.activo
  return row
}

const TABLE = 'eventos'

// Tope del recap de "eventos anteriores" — es una vitrina de fotos, no un
// archivo histórico completo, así que alcanza con los más recientes.
const MAX_PASADOS = 12

class SupabaseEventosRepository implements EventosRepository {
  async getAll() {
    const { data, error } = await supabaseAdmin.from(TABLE).select('*').order('fecha')
    if (error) throw error
    return (data as EventoRow[]).map(fromRow)
  }

  async getById(id: string) {
    const { data, error } = await supabaseAdmin.from(TABLE).select('*').eq('id', id).maybeSingle()
    if (error) throw error
    return data ? fromRow(data as EventoRow) : null
  }

  // Usado por el catálogo público y la vista previa del home: solo eventos
  // activos cuya fecha no haya pasado, ordenados del más próximo al más lejano.
  // `app/eventos/page.tsx` corre esto en build time (ISR) — si Supabase no
  // responde (URL mal configurada, caída temporal), no puede tumbar el
  // build entero: se degrada a "sin eventos" en vez de un 500.
  async getProximos() {
    try {
      const { dateISO: hoy } = getSantiagoParts(new Date())
      const { data, error } = await supabaseAdmin
        .from(TABLE)
        .select('*')
        .eq('activo', true)
        .gte('fecha', hoy)
        .order('fecha')
      if (error) throw error
      return (data as EventoRow[]).map(fromRow)
    } catch (err) {
      console.error('eventosRepo.getProximos falló, se muestra como si no hubiera eventos:', err)
      return []
    }
  }

  // Recap de eventos ya realizados: activos, con fecha pasada, del más
  // reciente al más antiguo — misma tabla, solo cambia el filtro de fecha.
  // Mismo motivo que getProximos: nunca debe tumbar el build.
  async getPasados() {
    try {
      const { dateISO: hoy } = getSantiagoParts(new Date())
      const { data, error } = await supabaseAdmin
        .from(TABLE)
        .select('*')
        .eq('activo', true)
        .lt('fecha', hoy)
        .order('fecha', { ascending: false })
        .limit(MAX_PASADOS)
      if (error) throw error
      return (data as EventoRow[]).map(fromRow)
    } catch (err) {
      console.error('eventosRepo.getPasados falló, se omite el recap:', err)
      return []
    }
  }

  async create(input: EventoInput) {
    const { data, error } = await supabaseAdmin.from(TABLE).insert(toRow(input)).select().single()
    if (error) throw error
    return fromRow(data as EventoRow)
  }

  async update(id: string, input: Partial<Omit<Evento, 'id'>>) {
    const { data, error } = await supabaseAdmin
      .from(TABLE)
      .update(toRow(input))
      .eq('id', id)
      .select()
      .maybeSingle()
    if (error) throw error
    return data ? fromRow(data as EventoRow) : null
  }

  async remove(id: string) {
    const { error, count } = await supabaseAdmin.from(TABLE).delete({ count: 'exact' }).eq('id', id)
    if (error) throw error
    return (count ?? 0) > 0
  }
}

export const eventosRepo: EventosRepository = new SupabaseEventosRepository()

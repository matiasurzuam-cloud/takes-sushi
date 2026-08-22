import { supabaseAdmin } from '@/lib/supabase/admin'
import { MAX_FOTOS, type CategoriaGaleria, type GaleriaFoto, type GaleriaFotoInput } from './types'

/**
 * Capa de acceso a datos para la galería (tabla `galeria` en Supabase — ver
 * supabase/schema.sql). A diferencia de promociones/eventos, esta galería
 * tiene un tope duro de `MAX_FOTOS`: al crear una foto que superaría el
 * tope, se borra automáticamente la más antigua (fila + archivo en
 * Storage) para no acumular peso indefinidamente — pedido explícito del
 * negocio, no un límite técnico de Supabase.
 *
 * Orden: las fotos nuevas entran con el `orden` más bajo (aparecen
 * primero en la grilla pública, que ordena ascendente) y la que se
 * evict es siempre la de `orden` más alto (la más antigua).
 */
export interface GaleriaRepository {
  getAll(): Promise<GaleriaFoto[]>
  create(input: GaleriaFotoInput): Promise<GaleriaFoto>
  updateImage(id: string, imagen: string): Promise<GaleriaFoto | null>
  remove(id: string): Promise<boolean>
}

const TABLE = 'galeria'
const BUCKET = 'galeria'

interface GaleriaRow {
  id: string
  imagen: string
  alt: string
  categoria: string
  activo: boolean
  orden: number
}

function fromRow(row: GaleriaRow): GaleriaFoto {
  return {
    id: row.id,
    imagen: row.imagen,
    alt: row.alt,
    categoria: row.categoria as CategoriaGaleria,
    activo: row.activo,
    orden: row.orden,
  }
}

// El nombre de archivo en el bucket es siempre el último segmento de la URL
// pública (ver app/api/galeria/route.ts, que sube todo al root del bucket
// sin subcarpetas).
function storageFileName(imagenUrl: string): string | null {
  try {
    const { pathname } = new URL(imagenUrl)
    return pathname.split('/').pop() || null
  } catch {
    return null
  }
}

// Best-effort: si el archivo ya no existe en Storage, o la fila fue cargada
// a mano en Supabase Studio con una URL externa, no debe bloquear el
// borrado de la fila en la tabla.
async function removeFromStorage(imagenUrl: string) {
  const fileName = storageFileName(imagenUrl)
  if (!fileName) return
  await supabaseAdmin
    .storage.from(BUCKET)
    .remove([fileName])
    .catch(() => {})
}

class SupabaseGaleriaRepository implements GaleriaRepository {
  async getAll() {
    const { data, error } = await supabaseAdmin.from(TABLE).select('*').order('orden')
    if (error) throw error
    return (data as GaleriaRow[]).map(fromRow)
  }

  async create(input: GaleriaFotoInput) {
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from(TABLE)
      .select('id, imagen, orden')
      .order('orden', { ascending: true })
    if (fetchError) throw fetchError

    const rows = (existing ?? []) as { id: string; imagen: string; orden: number }[]

    if (rows.length >= MAX_FOTOS) {
      const oldest = rows[rows.length - 1]
      await removeFromStorage(oldest.imagen)
      const { error: deleteError } = await supabaseAdmin.from(TABLE).delete().eq('id', oldest.id)
      if (deleteError) throw deleteError
    }

    const nuevoOrden = rows.length > 0 ? rows[0].orden - 1 : 0

    const { data, error } = await supabaseAdmin
      .from(TABLE)
      .insert({
        imagen: input.imagen,
        alt: input.alt,
        categoria: input.categoria,
        activo: true,
        orden: nuevoOrden,
      })
      .select()
      .single()
    if (error) throw error
    return fromRow(data as GaleriaRow)
  }

  // Reemplaza solo la imagen de una foto existente (mantiene alt/categoría/
  // orden). El archivo viejo en Storage se borra recién después de que el
  // UPDATE de la fila confirme, para no quedar sin imagen si algo falla.
  async updateImage(id: string, imagen: string) {
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from(TABLE)
      .select('imagen')
      .eq('id', id)
      .maybeSingle()
    if (fetchError) throw fetchError
    if (!existing) return null

    const { data, error } = await supabaseAdmin
      .from(TABLE)
      .update({ imagen })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error

    await removeFromStorage((existing as { imagen: string }).imagen)
    return fromRow(data as GaleriaRow)
  }

  async remove(id: string) {
    const { data: row, error: fetchError } = await supabaseAdmin
      .from(TABLE)
      .select('imagen')
      .eq('id', id)
      .maybeSingle()
    if (fetchError) throw fetchError
    if (!row) return false

    await removeFromStorage((row as { imagen: string }).imagen)

    const { error, count } = await supabaseAdmin.from(TABLE).delete({ count: 'exact' }).eq('id', id)
    if (error) throw error
    return (count ?? 0) > 0
  }
}

// Punto único de instanciación: cambiar esta línea (y agregar la clase
// equivalente) es todo lo que hace falta para migrar de motor de datos.
export const galeriaRepo: GaleriaRepository = new SupabaseGaleriaRepository()

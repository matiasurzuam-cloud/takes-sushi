import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { galeriaRepo } from '@/lib/galeria/store'
import type { CategoriaGaleria } from '@/lib/galeria/types'

// Sin esto, Next cachea el GET a nivel de build y el panel admin sigue
// mostrando datos viejos después de subir/borrar una foto.
export const dynamic = 'force-dynamic'

const STORAGE_BUCKET = 'galeria'
const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5MB
const CATEGORIAS_VALIDAS = new Set(['sushi', 'cafe', 'local'])

// La extensión sale de una tabla fija según el mime type, nunca del nombre
// de archivo que manda el cliente (mismo criterio que /api/promociones/upload).
const EXTENSION_BY_MIME_TYPE: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
}

// GET /api/galeria -> listado completo (panel admin). Protegido por proxy.ts.
export async function GET() {
  const fotos = await galeriaRepo.getAll()
  return NextResponse.json(fotos)
}

// POST /api/galeria (multipart/form-data: file, alt, categoria) -> sube la
// imagen al bucket "galeria" y crea la fila en un solo paso. A diferencia
// de promociones (varias imágenes por fila, subida en dos tiempos), acá
// una fila es una foto, así que no hace falta un flujo de "staging" previo
// al submit. Si ya hay 8 fotos, galeriaRepo.create() borra la más antigua
// (fila + archivo) antes de insertar esta.
export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file')
  const alt = formData.get('alt')
  const categoria = formData.get('categoria')

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No se recibió ningún archivo' }, { status: 400 })
  }
  if (typeof alt !== 'string' || alt.trim().length === 0) {
    return NextResponse.json({ error: 'Falta la descripción de la foto' }, { status: 400 })
  }
  if (typeof categoria !== 'string' || !CATEGORIAS_VALIDAS.has(categoria)) {
    return NextResponse.json({ error: 'Categoría inválida' }, { status: 400 })
  }

  const ext = EXTENSION_BY_MIME_TYPE[file.type]
  if (!ext) {
    return NextResponse.json(
      { error: 'Formato no permitido. Usa JPG, PNG, WEBP o GIF.' },
      { status: 400 },
    )
  }
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: 'La imagen no puede superar 5MB.' }, { status: 400 })
  }

  const fileName = `${Date.now()}-${randomUUID().slice(0, 8)}${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const { error: uploadError } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .upload(fileName, buffer, { contentType: file.type, upsert: false })

  if (uploadError) {
    return NextResponse.json({ error: 'No se pudo subir la imagen' }, { status: 500 })
  }

  const { data: publicUrlData } = supabaseAdmin.storage.from(STORAGE_BUCKET).getPublicUrl(fileName)

  try {
    const foto = await galeriaRepo.create({
      imagen: publicUrlData.publicUrl,
      alt: alt.trim(),
      categoria: categoria as CategoriaGaleria,
    })
    // La home tiene `revalidate = 60` (ISR) — sin esto, la foto recién se
    // vería reflejada hasta 1 minuto después en vez de al instante.
    revalidatePath('/')
    return NextResponse.json(foto, { status: 201 })
  } catch {
    // Si falló guardar la fila, no dejar el archivo huérfano en Storage.
    await supabaseAdmin.storage.from(STORAGE_BUCKET).remove([fileName]).catch(() => {})
    return NextResponse.json({ error: 'No se pudo guardar la foto' }, { status: 500 })
  }
}

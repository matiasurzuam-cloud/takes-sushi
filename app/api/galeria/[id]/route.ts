import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { galeriaRepo } from '@/lib/galeria/store'

interface RouteParams {
  params: Promise<{ id: string }>
}

const STORAGE_BUCKET = 'galeria'
const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5MB

// Misma tabla que app/api/galeria/route.ts: la extensión sale del mime type,
// nunca del nombre de archivo que manda el cliente.
const EXTENSION_BY_MIME_TYPE: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
}

// PUT /api/galeria/:id (multipart/form-data: file) -> reemplaza la imagen
// de una foto existente, sin perder su descripción/categoría ni su lugar
// en el orden de la grilla.
export async function PUT(req: NextRequest, { params }: RouteParams) {
  const { id } = await params
  const formData = await req.formData()
  const file = formData.get('file')

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No se recibió ningún archivo' }, { status: 400 })
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
    const foto = await galeriaRepo.updateImage(id, publicUrlData.publicUrl)
    if (!foto) {
      await supabaseAdmin.storage.from(STORAGE_BUCKET).remove([fileName]).catch(() => {})
      return NextResponse.json({ error: 'Foto no encontrada' }, { status: 404 })
    }
    // La home tiene `revalidate = 60` (ISR) — sin esto, el cambio recién se
    // vería reflejado hasta 1 minuto después en vez de al instante.
    revalidatePath('/')
    return NextResponse.json(foto)
  } catch {
    // Si falló guardar la fila, no dejar el archivo huérfano en Storage.
    await supabaseAdmin.storage.from(STORAGE_BUCKET).remove([fileName]).catch(() => {})
    return NextResponse.json({ error: 'No se pudo guardar la foto' }, { status: 500 })
  }
}

// DELETE /api/galeria/:id -> borra la fila y su archivo en Storage.
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const { id } = await params
  const ok = await galeriaRepo.remove(id)
  if (!ok) {
    return NextResponse.json({ error: 'Foto no encontrada' }, { status: 404 })
  }
  revalidatePath('/')
  return NextResponse.json({ success: true })
}

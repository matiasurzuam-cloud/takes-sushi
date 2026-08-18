import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'
import { supabaseAdmin } from '@/lib/supabase/admin'

const STORAGE_BUCKET = 'promociones'
const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5MB

// La extensión sale de una tabla fija según el mime type, nunca del nombre
// de archivo que manda el cliente, para no depender de un valor no confiable
// al armar la ruta del archivo en el bucket.
const EXTENSION_BY_MIME_TYPE: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
}

// POST /api/promociones/upload  (multipart/form-data, campo "file")
// Sube la imagen al bucket "promociones" de Supabase Storage (público para
// lectura — ver supabase/schema.sql) y devuelve su URL pública. Reemplaza
// la subida a /public/images/promociones, que no funciona en plataformas
// serverless de solo lectura como Vercel.
export async function POST(req: NextRequest) {
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

  const { error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .upload(fileName, buffer, { contentType: file.type, upsert: false })

  if (error) {
    return NextResponse.json({ error: 'No se pudo subir la imagen' }, { status: 500 })
  }

  const { data } = supabaseAdmin.storage.from(STORAGE_BUCKET).getPublicUrl(fileName)
  return NextResponse.json({ path: data.publicUrl }, { status: 201 })
}

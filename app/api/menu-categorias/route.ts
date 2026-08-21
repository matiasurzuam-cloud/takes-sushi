import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { MENU_CATEGORIES_CONFIG_ID } from '@/lib/menu/categories'

// Página admin: siempre tiene que traer el estado actual de la base, nunca
// una versión cacheada/estática.
export const dynamic = 'force-dynamic'

// GET -> { [categoryId]: imagenUrl }, solo las categorías con imagen
// personalizada (ver lib/content.ts → menuCategoryImages).
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('site_config')
    .select('data')
    .eq('id', MENU_CATEGORIES_CONFIG_ID)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: 'No se pudo leer' }, { status: 500 })
  }
  return NextResponse.json((data?.data as Record<string, string>) ?? {})
}

// PUT { categoryId, imagen } -> guarda la imagen de esa categoría.
// `imagen` vacío o null borra el override (vuelve a la imagen por defecto).
export async function PUT(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as
    | { categoryId?: string; imagen?: string | null }
    | null

  if (!body?.categoryId) {
    return NextResponse.json({ error: 'Falta categoryId' }, { status: 400 })
  }

  const { data: existing, error: readError } = await supabaseAdmin
    .from('site_config')
    .select('data')
    .eq('id', MENU_CATEGORIES_CONFIG_ID)
    .maybeSingle()

  if (readError) {
    return NextResponse.json({ error: 'No se pudo leer el estado actual' }, { status: 500 })
  }

  const current = { ...((existing?.data as Record<string, string>) ?? {}) }
  if (body.imagen) {
    current[body.categoryId] = body.imagen
  } else {
    delete current[body.categoryId]
  }

  const { error: writeError } = await supabaseAdmin
    .from('site_config')
    .upsert({ id: MENU_CATEGORIES_CONFIG_ID, data: current })

  if (writeError) {
    return NextResponse.json({ error: 'No se pudo guardar' }, { status: 500 })
  }
  return NextResponse.json(current)
}

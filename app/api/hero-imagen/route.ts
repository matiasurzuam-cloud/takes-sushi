import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

// Página admin: siempre tiene que traer el estado actual de la base, nunca
// una versión cacheada/estática.
export const dynamic = 'force-dynamic'

const CONFIG_ID = 'hero_fondo'

// GET -> { imagen: string } (vacío = usa la imagen por defecto hardcoded en
// components/hero-parallax-bg.tsx).
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('site_config')
    .select('data')
    .eq('id', CONFIG_ID)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: 'No se pudo leer' }, { status: 500 })
  }
  return NextResponse.json((data?.data as { imagen?: string }) ?? { imagen: '' })
}

// PUT { imagen } -> guarda el fondo del Hero. `imagen` vacío o null borra
// el override (vuelve a la imagen por defecto).
export async function PUT(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as { imagen?: string | null } | null
  const imagen = body?.imagen?.trim() || ''

  const { error } = await supabaseAdmin.from('site_config').upsert({ id: CONFIG_ID, data: { imagen } })

  if (error) {
    return NextResponse.json({ error: 'No se pudo guardar' }, { status: 500 })
  }
  return NextResponse.json({ imagen })
}

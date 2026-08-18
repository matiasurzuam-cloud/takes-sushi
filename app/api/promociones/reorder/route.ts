import { NextRequest, NextResponse } from 'next/server'
import { promocionesRepo } from '@/lib/promociones/store'

// POST /api/promociones/reorder  body: { orderedIds: string[] }
// Redefine el campo `orden` de cada promoción según su posición en el arreglo.
export async function POST(req: NextRequest) {
  const { orderedIds } = (await req.json()) as { orderedIds?: unknown }

  if (!Array.isArray(orderedIds) || !orderedIds.every((id) => typeof id === 'string')) {
    return NextResponse.json({ error: 'orderedIds debe ser un arreglo de ids' }, { status: 400 })
  }

  const promociones = await promocionesRepo.reorder(orderedIds)
  return NextResponse.json(promociones)
}

import { NextRequest, NextResponse } from 'next/server'
import { promocionesRepo } from '@/lib/promociones/store'

interface RouteParams {
  params: Promise<{ id: string }>
}

// PUT /api/promociones/:id -> actualiza campos parciales de una promoción.
export async function PUT(req: NextRequest, { params }: RouteParams) {
  const { id } = await params
  const body = await req.json()

  const updated = await promocionesRepo.update(id, body)
  if (!updated) {
    return NextResponse.json({ error: 'Promoción no encontrada' }, { status: 404 })
  }
  return NextResponse.json(updated)
}

// DELETE /api/promociones/:id
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const { id } = await params
  const ok = await promocionesRepo.remove(id)
  if (!ok) {
    return NextResponse.json({ error: 'Promoción no encontrada' }, { status: 404 })
  }
  return NextResponse.json({ success: true })
}

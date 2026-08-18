import { NextRequest, NextResponse } from 'next/server'
import { eventosRepo } from '@/lib/eventos/store'

interface RouteParams {
  params: Promise<{ id: string }>
}

// PUT /api/eventos/:id -> actualiza campos parciales de un evento.
export async function PUT(req: NextRequest, { params }: RouteParams) {
  const { id } = await params
  const body = await req.json()

  const updated = await eventosRepo.update(id, body)
  if (!updated) {
    return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 })
  }
  return NextResponse.json(updated)
}

// DELETE /api/eventos/:id
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const { id } = await params
  const ok = await eventosRepo.remove(id)
  if (!ok) {
    return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 })
  }
  return NextResponse.json({ success: true })
}

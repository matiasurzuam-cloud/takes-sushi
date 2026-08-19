import { NextRequest, NextResponse } from 'next/server'
import { galeriaRepo } from '@/lib/galeria/store'

interface RouteParams {
  params: Promise<{ id: string }>
}

// DELETE /api/galeria/:id -> borra la fila y su archivo en Storage.
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const { id } = await params
  const ok = await galeriaRepo.remove(id)
  if (!ok) {
    return NextResponse.json({ error: 'Foto no encontrada' }, { status: 404 })
  }
  return NextResponse.json({ success: true })
}

import { NextRequest, NextResponse } from 'next/server'
import { eventosRepo } from '@/lib/eventos/store'
import type { EventoInput } from '@/lib/eventos/types'

// Ver comentario equivalente en app/api/promociones/route.ts: sin esto,
// Next cachea el GET a nivel de build y el panel admin queda desactualizado.
export const dynamic = 'force-dynamic'

// GET /api/eventos -> listado completo (panel admin). Protegido por proxy.ts.
export async function GET() {
  const eventos = await eventosRepo.getAll()
  return NextResponse.json(eventos)
}

// POST /api/eventos -> crea un evento nuevo.
export async function POST(req: NextRequest) {
  const body = (await req.json()) as Partial<EventoInput>

  if (!body.titulo || !body.descripcion || !body.imagen || !body.fecha) {
    return NextResponse.json(
      { error: 'Faltan campos obligatorios: imagen, titulo, descripcion, fecha' },
      { status: 400 },
    )
  }

  const evento = await eventosRepo.create({
    imagen: body.imagen,
    titulo: body.titulo,
    descripcion: body.descripcion,
    fecha: body.fecha,
    hora: body.hora || undefined,
    ubicacion: body.ubicacion || undefined,
    precio: body.precio || undefined,
    link: body.link || undefined,
    activo: body.activo ?? true,
  })

  return NextResponse.json(evento, { status: 201 })
}

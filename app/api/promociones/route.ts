import { NextRequest, NextResponse } from 'next/server'
import { promocionesRepo } from '@/lib/promociones/store'
import type { PromocionInput } from '@/lib/promociones/types'

// Sin esto, Next cachea el GET a nivel de build (no usa cookies/headers ni
// un NextRequest) y el panel admin sigue mostrando datos viejos después de
// editar, aunque el PUT sí haya guardado el cambio en Supabase.
export const dynamic = 'force-dynamic'

// GET /api/promociones -> listado completo (panel admin). Protegido por middleware.ts.
export async function GET() {
  const promociones = await promocionesRepo.getAll()
  return NextResponse.json(promociones)
}

// POST /api/promociones -> crea una promoción nueva.
export async function POST(req: NextRequest) {
  const body = (await req.json()) as Partial<PromocionInput>

  if (!body.titulo || !body.descripcion || !Array.isArray(body.imagenes) || body.imagenes.length === 0) {
    return NextResponse.json(
      { error: 'Faltan campos obligatorios: al menos 1 imagen, titulo, descripcion' },
      { status: 400 },
    )
  }

  const promocion = await promocionesRepo.create({
    imagenes: body.imagenes,
    titulo: body.titulo,
    descripcion: body.descripcion,
    link: body.link || undefined,
    fechaExpiracion: body.fechaExpiracion || undefined,
    activo: body.activo ?? true,
    diasSemana: body.diasSemana && body.diasSemana.length > 0 ? body.diasSemana : undefined,
    horaInicio: body.horaInicio || undefined,
    horaFin: body.horaFin || undefined,
  })

  return NextResponse.json(promocion, { status: 201 })
}

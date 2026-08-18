import { NextResponse } from 'next/server'
import { promocionesRepo } from '@/lib/promociones/store'

// Mismo motivo que en la ruta admin: sin esto, Next cachea el GET a nivel
// de build y el pop-up/carrusel público queda pegado en datos viejos.
export const dynamic = 'force-dynamic'

// GET /api/promociones/public -> solo promociones activas y vigentes.
// Es la única sub-ruta de /api/promociones que proxy.ts deja pasar
// sin sesión de administrador: es la que consume el pop-up público.
export async function GET() {
  const promociones = await promocionesRepo.getActivas()
  return NextResponse.json(promociones)
}

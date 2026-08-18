import { NextResponse } from 'next/server'
import { eventosRepo } from '@/lib/eventos/store'

// Mismo motivo que en app/api/promociones/public/route.ts.
export const dynamic = 'force-dynamic'

// GET /api/eventos/public -> solo próximos eventos activos. Sub-ruta que
// proxy.ts deja pasar sin sesión de administrador: la consumen la vista
// previa del home y el catálogo público en /eventos.
export async function GET() {
  const eventos = await eventosRepo.getProximos()
  return NextResponse.json(eventos)
}

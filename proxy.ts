import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// Rutas alcanzadas por el matcher de abajo que NO requieren sesión:
// el login en sí, y los endpoints que el sitio público usa para leer
// promociones y eventos activos.
const PUBLIC_PATHS = new Set([
  '/admin/login',
  '/api/promociones/public',
  '/api/eventos/public',
])

export const config = {
  matcher: [
    '/admin',
    '/admin/:path*',
    '/api/promociones',
    '/api/promociones/:path*',
    '/api/eventos',
    '/api/eventos/:path*',
    '/api/galeria',
    '/api/galeria/:path*',
    '/api/menu-categorias',
    '/api/hero-imagen',
  ],
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (PUBLIC_PATHS.has(pathname)) return NextResponse.next()

  const { response, user } = await updateSession(req)
  if (user) return response

  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const loginUrl = req.nextUrl.clone()
  loginUrl.pathname = '/admin/login'
  loginUrl.searchParams.set('next', pathname)
  return NextResponse.redirect(loginUrl)
}

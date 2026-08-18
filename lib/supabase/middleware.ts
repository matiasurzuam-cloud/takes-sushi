import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './env'

// Variante del cliente para usar dentro de proxy.ts (no puede usar
// next/headers ahí). Refresca el token de sesión si venció y devuelve tanto
// la respuesta (con las cookies ya actualizadas) como el usuario actual.
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  // getUser() (no getSession()) porque revalida contra el servidor de Auth
  // de Supabase en vez de solo leer el JWT de la cookie sin verificar.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return { response, user }
}

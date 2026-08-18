import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './env'

// Cliente ligado a las cookies de la request actual — es el que usan las
// rutas de login/logout para crear y cerrar la sesión de Supabase Auth, y
// cualquier Server Component que necesite saber "quién está logueado".
// Usa la anon key: Supabase Auth valida igual la contraseña del lado suyo,
// esta key no ignora RLS (a diferencia de supabaseAdmin).
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            )
          } catch {
            // Llamado desde un Server Component (no puede escribir cookies)
            // — el proxy ya se encarga de refrescar la sesión en cada request.
          }
        },
      },
    },
  )
}

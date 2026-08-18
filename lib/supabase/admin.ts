import { createClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from './env'

// Cliente con la service_role key: ignora Row Level Security por completo.
// Solo se importa desde código que corre en el servidor (API routes, Server
// Components) — nunca desde un componente cliente ni se expone al navegador.
// Es el único cliente que usamos para leer/escribir datos: nada le habla a
// Supabase directo desde el browser (ver supabase/schema.sql).
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

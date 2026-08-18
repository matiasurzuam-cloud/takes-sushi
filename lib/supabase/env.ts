// Vercel a veces guarda las env vars de Supabase con saltos de línea o
// espacios de más (típico al copiar y pegar un JWT largo en su dashboard)
// — eso rompe `Headers.set` recién en build/runtime con "invalid header
// value" (nunca localmente, porque .env.local no tenía el problema). Un
// JWT o una URL real nunca llevan espacios, así que sacarlos siempre es
// seguro — mejor sanear acá una vez que repetirlo en cada cliente.
function clean(value: string | undefined, name: string): string {
  if (!value) throw new Error(`Falta la variable de entorno ${name}`)
  return value.replace(/\s/g, '')
}

export const SUPABASE_URL = clean(process.env.NEXT_PUBLIC_SUPABASE_URL, 'NEXT_PUBLIC_SUPABASE_URL')
export const SUPABASE_ANON_KEY = clean(
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
)
export const SUPABASE_SERVICE_ROLE_KEY = clean(
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  'SUPABASE_SERVICE_ROLE_KEY',
)

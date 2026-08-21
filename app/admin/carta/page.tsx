import { supabaseAdmin } from '@/lib/supabase/admin'
import { MENU_CATEGORIES, MENU_CATEGORIES_CONFIG_ID } from '@/lib/menu/categories'
import { CartaAdmin } from '@/components/admin/carta-admin'

// Página admin: siempre tiene que traer el estado actual de la base, nunca
// una versión cacheada/estática.
export const dynamic = 'force-dynamic'

// Server component: lee el estado inicial directo del repositorio (sin pasar
// por HTTP) y se lo pasa al panel interactivo, que ya sigue todo por API.
export default async function AdminCartaPage() {
  const { data } = await supabaseAdmin
    .from('site_config')
    .select('data')
    .eq('id', MENU_CATEGORIES_CONFIG_ID)
    .maybeSingle()

  const overrides = (data?.data as Record<string, string>) ?? {}

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <CartaAdmin categories={MENU_CATEGORIES} initialOverrides={overrides} />
    </div>
  )
}

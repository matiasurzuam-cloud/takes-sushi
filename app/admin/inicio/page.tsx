import { supabaseAdmin } from '@/lib/supabase/admin'
import { InicioAdmin } from '@/components/admin/inicio-admin'

// Página admin: siempre tiene que traer el estado actual de la base, nunca
// una versión cacheada/estática.
export const dynamic = 'force-dynamic'

// Server component: lee el estado inicial directo del repositorio (sin pasar
// por HTTP) y se lo pasa al panel interactivo, que ya sigue todo por API.
export default async function AdminInicioPage() {
  const { data } = await supabaseAdmin
    .from('site_config')
    .select('data')
    .eq('id', 'hero_fondo')
    .maybeSingle()

  const imagen = (data?.data as { imagen?: string })?.imagen ?? ''

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <InicioAdmin initialImagen={imagen} />
    </div>
  )
}

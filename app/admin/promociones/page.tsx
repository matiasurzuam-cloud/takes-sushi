import { promocionesRepo } from '@/lib/promociones/store'
import { PromocionesAdmin } from '@/components/admin/promociones-admin'

// Página admin: siempre tiene que traer el estado actual de la base, nunca
// una versión cacheada/estática.
export const dynamic = 'force-dynamic'

// Server component: lee el estado inicial directo del repositorio (sin pasar
// por HTTP) y se lo pasa al panel interactivo, que ya sigue todo por API.
export default async function AdminPromocionesPage() {
  const promociones = await promocionesRepo.getAll()

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <PromocionesAdmin initialPromociones={promociones} />
    </div>
  )
}

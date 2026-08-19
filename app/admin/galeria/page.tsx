import { galeriaRepo } from '@/lib/galeria/store'
import { GaleriaAdmin } from '@/components/admin/galeria-admin'

// Página admin: siempre tiene que traer el estado actual de la base, nunca
// una versión cacheada/estática.
export const dynamic = 'force-dynamic'

// Server component: lee el estado inicial directo del repositorio (sin pasar
// por HTTP) y se lo pasa al panel interactivo, que ya sigue todo por API.
export default async function AdminGaleriaPage() {
  const fotos = await galeriaRepo.getAll()

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <GaleriaAdmin initialFotos={fotos} />
    </div>
  )
}

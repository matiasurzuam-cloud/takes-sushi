import { eventosRepo } from '@/lib/eventos/store'
import { EventosAdmin } from '@/components/admin/eventos-admin'

// Página admin: siempre tiene que traer el estado actual de la base, nunca
// una versión cacheada/estática.
export const dynamic = 'force-dynamic'

export default async function AdminEventosPage() {
  const eventos = await eventosRepo.getAll()

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <EventosAdmin initialEventos={eventos} />
    </div>
  )
}

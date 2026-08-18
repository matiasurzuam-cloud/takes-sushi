import { formatFechaEvento } from '@/lib/eventos/format'
import type { Evento } from '@/lib/eventos/types'
import type { Promocion } from '@/lib/promociones/types'

// Adapta el próximo evento al mismo "shape" que Promocion para que rote
// dentro del mismo carrusel del pop-up sin tener que duplicar su UI
// (imagen, countdown, botón) — ver components/promo-popup/promo-carousel.tsx.
export function eventoToPromocion(evento: Evento): Promocion {
  const fechaTexto = formatFechaEvento(evento.fecha, evento.hora)
  const detalle = evento.ubicacion ? `${fechaTexto} · ${evento.ubicacion}` : fechaTexto

  return {
    id: `evento-${evento.id}`,
    imagenes: [evento.imagen],
    titulo: evento.titulo,
    descripcion: `${detalle}. ${evento.descripcion}`,
    link: evento.link || '/eventos',
    fechaExpiracion: evento.fecha,
    activo: true,
    orden: Number.MAX_SAFE_INTEGER,
    origen: 'evento',
  }
}

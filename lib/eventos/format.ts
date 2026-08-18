// Ancla al mediodía (en vez de medianoche) para que formatear con una
// zona horaria específica nunca empuje la fecha al día anterior/siguiente
// por un desfase — acá solo nos importa el día calendario, no la hora exacta.
const fechaFormatter = new Intl.DateTimeFormat('es-CL', {
  weekday: 'short',
  day: 'numeric',
  month: 'long',
})

/** "2026-08-23" + "20:00" -> "sáb, 23 de agosto · 20:00". */
export function formatFechaEvento(fechaISO: string, hora?: string | null): string {
  const fecha = fechaFormatter.format(new Date(`${fechaISO}T12:00:00`))
  return hora ? `${fecha} · ${hora}` : fecha
}

export interface Evento {
  id: string
  imagen: string
  titulo: string
  descripcion: string
  /** "YYYY-MM-DD". */
  fecha: string
  /** "HH:MM", opcional. */
  hora?: string | null
  ubicacion?: string | null
  precio?: string | null
  link?: string | null
  activo: boolean
}

export type EventoInput = Omit<Evento, 'id'>

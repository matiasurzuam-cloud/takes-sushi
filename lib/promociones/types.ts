export interface Promocion {
  id: string
  /** 1 a 4 imágenes. La primera es la principal (grande) del collage. */
  imagenes: string[]
  titulo: string
  descripcion: string
  link?: string
  fechaExpiracion?: string
  activo: boolean
  orden: number
  /**
   * 1=lunes…7=domingo (ISO 8601). `null`/`undefined` o vacío = todos los
   * días. Distinto de la convención de `HorarioBloque.dias` en
   * lib/content.ts (0=domingo…6=sábado) — ver lib/promociones/vigencia.ts.
   */
  diasSemana?: number[] | null
  /** "HH:MM". Junto con `horaFin` acotan el rango horario; ambos null = todo el día. */
  horaInicio?: string | null
  horaFin?: string | null
  /**
   * Marca las promos "sintéticas" armadas a partir del próximo evento (ver
   * components/promo-popup/evento-to-promo.ts) para que el carrusel del
   * pop-up pueda mostrar un copy distinto en el countdown ("Falta" en vez
   * de "Vence"). `undefined` = promoción real, viene de la tabla `promociones`.
   */
  origen?: 'evento'
}

export type PromocionInput = Omit<Promocion, 'id' | 'orden'>

'use client'

import { PromoBanner, type Promo } from '@/components/promo-banner'
import { usePromosVigentes } from '@/components/promo-popup/use-promos-vigentes'
import type { Promocion } from '@/lib/promociones/types'

// Conecta la tarjeta giratoria del Hero a las promociones reales del panel
// admin — mismo hook que ya usan el pop-up y la sección Promociones
// (misma lógica de vigencia por día/hora/vencimiento en un solo lugar), en
// vez del promo hardcodeado (DEFAULT_PROMOS) que tenía antes. El efecto
// visual (giro, cross-fade, indicadores) es el mismo de siempre — ver
// components/promo-banner.tsx — acá solo se cambia de dónde salen los datos.
function toPromo(promocion: Promocion): Promo {
  return {
    id: promocion.id,
    imageUrl: promocion.imagenes[0] || '/placeholder.svg',
    badge: 'Promo',
    title: promocion.titulo,
    subtitle: promocion.descripcion,
    ctaText: 'Ver más',
    ctaLink: '/promociones',
  }
}

export function HeroPromoBanner() {
  const { promos } = usePromosVigentes()

  // Sin promos vigentes (o todavía cargando): no mostrar el promo de
  // ejemplo — mejor un hueco vacío que promocionar algo que no es real.
  if (!promos || promos.length === 0) return null

  return <PromoBanner promos={promos.map(toPromo)} />
}

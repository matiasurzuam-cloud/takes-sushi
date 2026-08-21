'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { SmartImage } from '@/components/ui/smart-image'

// Exportada para que /admin/inicio (components/admin/inicio-admin.tsx) sepa
// a qué imagen "restaurar" cuando el admin borra su override personalizado.
export const DEFAULT_HERO_IMAGE = '/images/hero-sushi.png'

// Capa de fondo del Hero con un parallax sutil: al hacer scroll, la imagen
// se desplaza más lento que el resto de la sección (efecto de profundidad
// clásico), sumado al zoom lento que ya tenía (animate-kenburns, CSS puro,
// sigue intacto). Aparte de hero-section.tsx (que sigue siendo Server
// Component) porque useScroll necesita un ref y correr en el navegador —
// mismo criterio que HeroCartaButton/HeroPromoBanner.
//
// El wrapper interno se extiende bastante más allá de inset-0
// (-top-28/-bottom-28, 112px de sobrante arriba y abajo) para que el
// desplazamiento (hasta 90px) nunca deje ver un borde vacío de la imagen.
export function HeroParallaxBg({ imageSrc }: { imageSrc?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 90])

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-x-0 -top-28 -bottom-28">
        <SmartImage
          src={imageSrc || DEFAULT_HERO_IMAGE}
          alt="Variedad de sushi fresco preparado en TAKE'S"
          fill
          priority
          className="animate-kenburns object-cover"
          sizes="100vw"
        />
      </motion.div>
    </div>
  )
}

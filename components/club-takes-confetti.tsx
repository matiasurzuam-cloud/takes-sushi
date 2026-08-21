'use client'

import { useEffect } from 'react'
import { celebrateWelcome } from '@/lib/confetti'

// Dispara un confetti de bienvenida apenas se entra a /club-takes — no
// depende de ningún clic, solo de aterrizar en la página. Aparte de
// page.tsx (que sigue siendo Server Component) porque necesita useEffect
// — mismo criterio que HeroCartaButton/HeroPromoBanner/HeroParallaxBg.
// El pequeño delay deja que el hero termine de aparecer antes de celebrar,
// en vez de dispararse antes de que haya nada visible en pantalla.
export function ClubTakesConfetti() {
  useEffect(() => {
    const id = window.setTimeout(() => celebrateWelcome(), 400)
    return () => window.clearTimeout(id)
  }, [])

  return null
}

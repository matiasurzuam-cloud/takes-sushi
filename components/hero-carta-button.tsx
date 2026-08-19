'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CartaModal } from './carta-modal'

// hero-section.tsx es un Server Component — este wrapper es lo único que
// necesita 'use client' (el estado del modal), para no tener que convertir
// todo el Hero.
export function HeroCartaButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button variant="brand-outline" size="pill" onClick={() => setOpen(true)}>
        Ver la carta
      </Button>
      <CartaModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}

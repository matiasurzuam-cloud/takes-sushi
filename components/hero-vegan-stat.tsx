'use client'

import { Leaf } from 'lucide-react'
import {
  MENU_UNLOCK_KEY,
  MENU_UNLOCK_EVENT,
  MENU_SELECT_CATEGORY_KEY,
  MENU_SELECT_CATEGORY_EVENT,
} from './carta-modal'

// hero-section.tsx es un Server Component — este wrapper es lo único que
// necesita 'use client' (mismo patrón que hero-carta-button.tsx). A
// diferencia de los otros dos stats del Hero (decorativos), este lleva
// directo a la pestaña "Vegano" de la carta: destraba el gate de
// local/delivery (igual que "Pedir para delivery" en CartaModal) y además
// selecciona esa pestaña — ver el useEffect correspondiente en
// menu-section.tsx.
export function HeroVeganStat() {
  function handleClick() {
    sessionStorage.setItem(MENU_UNLOCK_KEY, '1')
    sessionStorage.setItem(MENU_SELECT_CATEGORY_KEY, 'vegano')
    window.dispatchEvent(new Event(MENU_UNLOCK_EVENT))
    window.dispatchEvent(new CustomEvent(MENU_SELECT_CATEGORY_EVENT, { detail: 'vegano' }))
  }

  return (
    <a
      href="#carta"
      onClick={handleClick}
      className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:bg-white/10 sm:p-4"
    >
      <Leaf className="h-5 w-5 text-brand" />
      <span className="mt-2 block text-sm font-semibold text-white">Opciones veganas</span>
      <span className="block text-xs text-white/60">Ver catálogo</span>
    </a>
  )
}

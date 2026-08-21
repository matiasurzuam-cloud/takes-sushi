'use client'

import { useEffect, useState } from 'react'
import { Camera, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

// Burbujas persistentes en todo el sitio público (no en /admin).
//
// Ocultas hasta pasar unos ~320px de scroll: en mobile, con la altura justa
// del Hero de la home, quedaban tapando el botón "Ver la carta" y las
// tarjetas de estadísticas (Calidad premium, etc.) apenas cargaba la
// página — un choque de posición fija contra contenido real, no solo un
// detalle estético. Aparecen recién cuando el usuario empieza a bajar,
// patrón común en botones de contacto flotantes y evita el problema en
// cualquier página sin tener que coordinar layouts caso por caso.
//
// z-40 (uno por debajo de la barra flotante del carrito en menu-section.tsx,
// que es z-50 e inset-x-0): en mobile esa barra ocupa casi todo el ancho
// inferior y terminaría tapando esta esquina — con z-40 queda debajo y se
// oculta sola mientras el carrito está activo, sin necesitar compartir
// estado entre componentes. En desktop la barra es más angosta (max-w-3xl
// centrada) y no llega a tapar la esquina, así que ahí conviven sin problema.
//
// WhatsApp va primero (queda arriba en la pila) porque es el canal de
// contacto principal del sitio: en mobile, cuando el carrito tapa el borde
// inferior, el elemento más cercano a esa esquina (Instagram) es el que se
// oculta primero — así WhatsApp es el que se sigue viendo si solo entra uno.
export function FloatingSocial({
  whatsappNumber,
  instagramUrl,
}: {
  whatsappNumber: string
  instagramUrl: string
}) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!whatsappNumber && !instagramUrl) return null

  return (
    <div
      className={cn(
        'fixed bottom-6 right-6 z-40 flex flex-col items-center gap-3 transition-all duration-300',
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0',
      )}
    >
      {whatsappNumber && (
        <a
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Escríbenos por WhatsApp"
          className="animate-pulse-soft flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-black/25 transition-all duration-300 hover:scale-110 hover:shadow-2xl"
        >
          <MessageCircle className="h-7 w-7" fill="currentColor" />
        </a>
      )}
      {instagramUrl && (
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Síguenos en Instagram"
          style={{ animationDelay: '0.4s' }}
          className="animate-pulse-soft flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white shadow-xl shadow-black/25 transition-all duration-300 hover:scale-110 hover:shadow-2xl"
        >
          <Camera className="h-7 w-7" />
        </a>
      )}
    </div>
  )
}

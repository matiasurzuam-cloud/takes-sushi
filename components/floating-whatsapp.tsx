import { MessageCircle } from 'lucide-react'

// Burbuja persistente en todo el sitio público (no en /admin). Sin
// 'use client': es solo un <a>, no necesita estado ni hooks del navegador,
// así que un Server Component puede renderizarlo directo.
//
// z-40 (uno por debajo de la barra flotante del carrito en menu-section.tsx,
// que es z-50 e inset-x-0): en mobile esa barra ocupa casi todo el ancho
// inferior y terminaría tapando esta burbuja en la esquina — con z-40 queda
// debajo y se oculta sola mientras el carrito está activo, sin necesitar
// compartir estado entre componentes. En desktop la barra es más angosta
// (max-w-3xl centrada) y no llega a tapar la esquina, así que ahí conviven
// sin problema.
export function FloatingWhatsapp({ whatsappNumber }: { whatsappNumber: string }) {
  if (!whatsappNumber) return null

  return (
    <a
      href={`https://wa.me/${whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="animate-pulse-soft fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-black/25 transition-all duration-300 hover:scale-110 hover:shadow-2xl"
    >
      <MessageCircle className="h-7 w-7" fill="currentColor" />
    </a>
  )
}

import { Camera, MessageCircle } from 'lucide-react'

// Burbujas persistentes en todo el sitio público (no en /admin). Sin
// 'use client': son solo <a>, no necesitan estado ni hooks del navegador,
// así que un Server Component puede renderizarlas directo.
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
  if (!whatsappNumber && !instagramUrl) return null

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-center gap-3">
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

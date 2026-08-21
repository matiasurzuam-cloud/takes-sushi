'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, X } from 'lucide-react'
import { CLUB_URL } from '@/lib/club-url'

const SESSION_KEY = 'takes-club-popup-dismissed'

interface ClubQrPopupProps {
  /** Ruta de la imagen (ver app/page.tsx: existsSync la resuelve del lado
   * del servidor). `null` mientras no se haya subido el archivo — no se
   * muestra nada en vez de un pop-up con una imagen rota. */
  imageSrc: string | null
  /** Milisegundos de espera antes de aparecer. Más tarde que el pop-up de
   * promociones (delayMs=4000 por defecto) para que no se pisen si ambos
   * tienen contenido que mostrar en la misma visita. */
  delayMs?: number
}

// Invitación al Club Takes, separada del pop-up de promociones (que sigue
// intacto — ver components/promo-popup/promo-popup.tsx). Mismo patrón de
// esa: aparece sola tras un delay, se recuerda cerrada por sessionStorage
// (no persiste entre pestañas nuevas ni tras cerrar el navegador), y toda
// la tarjeta es un link — no solo un botón chico — al mismo registro que
// usa la página /club-takes.
export function ClubQrPopup({ imageSrc, delayMs = 9000 }: ClubQrPopupProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!imageSrc) return
    if (sessionStorage.getItem(SESSION_KEY)) return

    const timer = setTimeout(() => setOpen(true), delayMs)
    return () => clearTimeout(timer)
  }, [imageSrc, delayMs])

  const close = useCallback(() => {
    setOpen(false)
    sessionStorage.setItem(SESSION_KEY, '1')
  }, [])

  if (!imageSrc) return null

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="Únete al Club Take's"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
          >
            <button
              type="button"
              onClick={close}
              aria-label="Cerrar"
              className="absolute right-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
            >
              <X className="h-4 w-4" />
            </button>

            <a
              href={CLUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={close}
              className="group block"
            >
              <div className="bg-white p-6 pb-4">
                <div className="relative mx-auto aspect-square w-full max-w-[260px]">
                  <Image
                    src={imageSrc}
                    alt="Código QR para unirte al Club Take's"
                    fill
                    className="object-contain"
                    sizes="260px"
                  />
                </div>
              </div>
              <div className="p-6 pt-4 text-center">
                <p className="text-lg font-extrabold text-foreground">Únete al Club Take&apos;s</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Acumula estampillas y desbloquea descuentos exclusivos
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-accent-foreground shadow-lg shadow-accent/25 transition-transform duration-300 group-hover:scale-105">
                  Únete Ahora <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

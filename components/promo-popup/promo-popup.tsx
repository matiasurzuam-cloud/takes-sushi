'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { PromoCarousel } from './promo-carousel'
import { usePromosVigentes } from './use-promos-vigentes'
import { useProximoEvento } from './use-proximo-evento'
import { eventoToPromocion } from './evento-to-promo'

const SESSION_KEY = 'takes-promo-popup-dismissed'

interface PromoPopupProps {
  /** Milisegundos de espera antes de mostrar el pop-up al cargar la página. */
  delayMs?: number
  /** Milisegundos entre cada rotación automática del carrusel interno. */
  rotationMs?: number
}

export function PromoPopup({ delayMs = 4000, rotationMs = 5000 }: PromoPopupProps) {
  const { promos } = usePromosVigentes()
  const { evento } = useProximoEvento()
  const [open, setOpen] = useState(false)

  // El próximo evento se suma como una tarjeta más al mismo carrusel (no
  // reemplaza las promociones) — así el pop-up puede abrir solo por el
  // evento aunque no haya ninguna promo vigente en ese momento.
  const items = useMemo(() => {
    if (promos === null) return null
    return evento ? [...promos, eventoToPromocion(evento)] : promos
  }, [promos, evento])

  // `items` es un arreglo nuevo cada segundo (usePromosVigentes reevalúa
  // la vigencia en cada tick del countdown), así que no puede ir directo
  // como dependencia acá: reiniciaría este timer cada segundo y nunca
  // llegaría a `delayMs`. `hasItems` es un booleano — solo cambia cuando
  // de verdad pasa de "sin nada" a "con algo" (o viceversa).
  const hasItems = items !== null && items.length > 0

  // Programa la aparición tras `delayMs`, salvo que ya se haya cerrado en
  // esta misma sesión de navegador (sessionStorage, no persiste entre pestañas
  // nuevas ni tras cerrar el navegador).
  useEffect(() => {
    if (!hasItems) return
    if (sessionStorage.getItem(SESSION_KEY)) return

    const timer = setTimeout(() => setOpen(true), delayMs)
    return () => clearTimeout(timer)
  }, [hasItems, delayMs])

  // Si mientras estaba abierto dejaron de quedar promos vigentes (ej. se
  // acabó el rango horario), se cierra solo.
  useEffect(() => {
    if (open && items && items.length === 0) setOpen(false)
  }, [open, items])

  const close = useCallback(() => {
    setOpen(false)
    sessionStorage.setItem(SESSION_KEY, '1')
  }, [])

  if (!items || items.length === 0) return null

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
          aria-label="Promociones"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto overflow-x-hidden rounded-3xl border border-border bg-card shadow-2xl"
          >
            <button
              type="button"
              onClick={close}
              aria-label="Cerrar"
              className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
            >
              <X className="h-5 w-5" />
            </button>

            <PromoCarousel promociones={items} rotationMs={rotationMs} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

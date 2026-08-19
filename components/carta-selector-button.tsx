'use client'

import { useState, type ReactNode } from 'react'
import { CartaModal } from './carta-modal'

// Trigger genérico para el nav (header/footer): mismo look que un link de
// texto normal, pero en vez de saltar directo a #carta abre el selector
// "local o delivery" — ver carta-modal.tsx.
export function CartaSelectorButton({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {children}
      </button>
      <CartaModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}

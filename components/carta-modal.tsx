'use client'

import { X, Store, Bike } from 'lucide-react'

// Link real de la carta para servir en el local (Toteat) — el sitio propio
// (sección #carta) es la otra opción, para pedidos con delivery.
const TOTEAT_URL = "https://toteat.shop/r/cl/Take's/21730/checkin/menu"

export function CartaModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Elige cómo quieres ver la carta"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <h3 className="text-center text-xl font-extrabold text-foreground sm:text-2xl">
          ¿Cómo quieres tu pedido?
        </h3>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Elige según dónde vas a disfrutarlo.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <a
            href={TOTEAT_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="group flex flex-col items-center gap-3 rounded-2xl border-2 border-border bg-secondary/40 p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-brand hover:shadow-xl"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/15 text-brand transition-colors group-hover:bg-brand group-hover:text-brand-foreground">
              <Store className="h-7 w-7" />
            </span>
            <span className="text-base font-extrabold text-foreground">Comer en el local</span>
            <span className="text-xs leading-relaxed text-muted-foreground">
              Carta para pedir en tu mesa
            </span>
          </a>

          <a
            href="/#carta"
            onClick={onClose}
            className="group flex flex-col items-center gap-3 rounded-2xl border-2 border-border bg-secondary/40 p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-xl"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/15 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
              <Bike className="h-7 w-7" />
            </span>
            <span className="text-base font-extrabold text-foreground">Pedir para delivery</span>
            <span className="text-xs leading-relaxed text-muted-foreground">
              Arma tu pedido para retiro o despacho
            </span>
          </a>
        </div>
      </div>
    </div>
  )
}

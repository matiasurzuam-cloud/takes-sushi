'use client'

import { useEffect, useState } from 'react'
import type { Evento } from '@/lib/eventos/types'

const FETCH_INTERVAL_MS = 60_000

// Solo lo usa el pop-up (ver evento-to-promo.ts) — la sección "Promociones"
// de la home sigue usando exclusivamente usePromosVigentes, sin mezclar
// eventos, así que este hook vive aparte en vez de sumarse a ese otro.
export function useProximoEvento(): { evento: Evento | null } {
  const [evento, setEvento] = useState<Evento | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchEvento() {
      try {
        const res = await fetch('/api/eventos/public')
        const data: Evento[] = res.ok ? await res.json() : []
        if (!cancelled) setEvento(data[0] ?? null)
      } catch {
        if (!cancelled) setEvento(null)
      }
    }

    fetchEvento()
    const id = setInterval(fetchEvento, FETCH_INTERVAL_MS)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [])

  return { evento }
}

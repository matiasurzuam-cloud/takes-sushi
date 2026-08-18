'use client'

import { useEffect, useRef, useState } from 'react'
import { elegirPromosVigentes } from '@/lib/promociones/vigencia'
import type { Promocion } from '@/lib/promociones/types'

const FETCH_INTERVAL_MS = 60_000
const TICK_INTERVAL_MS = 1_000

interface UsePromosVigentesResult {
  /** Promos vigentes ahora mismo, filtradas y ordenadas. null mientras carga. */
  promos: Promocion[] | null
}

// Hook compartido por el pop-up y la sección "Promociones" de la home:
// trae las promos activas/no vencidas (filtro que ya hace el servidor) y
// reevalúa la vigencia por día/hora en el cliente cada segundo — así el
// countdown tickea en vivo y una promo que deja de aplicar (cambia el día,
// se acaba el rango horario) desaparece sola sin recargar la página.
// El fetch se repite cada 60s para levantar cambios hechos desde el admin,
// no cada segundo (el tick de 1s solo recalcula sobre los datos en memoria).
export function usePromosVigentes(): UsePromosVigentesResult {
  const [todas, setTodas] = useState<Promocion[] | null>(null)
  const [vigentes, setVigentes] = useState<Promocion[] | null>(null)
  const todasRef = useRef<Promocion[] | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchPromos() {
      try {
        const res = await fetch('/api/promociones/public')
        const data: Promocion[] = res.ok ? await res.json() : []
        if (!cancelled) {
          todasRef.current = data
          setTodas(data)
        }
      } catch {
        if (!cancelled) {
          todasRef.current = []
          setTodas([])
        }
      }
    }

    fetchPromos()
    const fetchId = setInterval(fetchPromos, FETCH_INTERVAL_MS)
    return () => {
      cancelled = true
      clearInterval(fetchId)
    }
  }, [])

  useEffect(() => {
    function tick() {
      if (todasRef.current) setVigentes(elegirPromosVigentes(todasRef.current, new Date()))
    }
    tick()
    const tickId = setInterval(tick, TICK_INTERVAL_MS)
    return () => clearInterval(tickId)
  }, [todas])

  return { promos: todas === null ? null : vigentes }
}

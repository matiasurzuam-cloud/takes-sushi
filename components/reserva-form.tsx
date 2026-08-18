'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MessageCircle,
  Minus,
  Plus,
  Sparkles,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { getSantiagoParts } from '@/lib/timezone'

const TIPOS_EVENTO = [
  'Cumpleaños',
  'Eventos de empresa',
  'After office',
  'Reuniones',
  'Desayunos',
  'Otras ideas que tengas',
]

const HORAS_SUGERIDAS = ['12:30', '13:00', '14:00', '17:30', '18:00', '19:00', '20:00', '21:00']

const DIAS_HEADER = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
]

function pad2(n: number): string {
  return String(n).padStart(2, '0')
}

function toISO(y: number, m: number, d: number): string {
  return `${y}-${pad2(m + 1)}-${pad2(d)}`
}

// Grilla de semanas lunes-a-domingo del mes de `cursor` (día 1 = cualquiera,
// solo se usa año/mes). Cada celda es la fecha ISO o null si es relleno de
// una semana incompleta al principio/final del mes.
function buildMonthGrid(cursor: Date): (string | null)[] {
  const year = cursor.getFullYear()
  const month = cursor.getMonth()
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7 // 0=lunes
  const totalDays = new Date(year, month + 1, 0).getDate()

  const cells: (string | null)[] = Array(firstWeekday).fill(null)
  for (let d = 1; d <= totalDays; d++) cells.push(toISO(year, month, d))
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

function formatFechaLarga(iso: string): string {
  const d = new Date(`${iso}T12:00:00`)
  return new Intl.DateTimeFormat('es-CL', { weekday: 'long', day: 'numeric', month: 'long' }).format(d)
}

function armarMensaje(opts: {
  tipoEvento: string | null
  fechaISO: string | null
  hora: string
  personas: number
}): string {
  return [
    "¡Hola! Me gustaría reservar una mesa para un evento en Take's.",
    `Tipo de evento: ${opts.tipoEvento ?? '[completar]'}`,
    `Fecha: ${opts.fechaISO ? formatFechaLarga(opts.fechaISO) : '[completar]'}`,
    `Hora: ${opts.hora || '[completar]'}`,
    `Número de personas: ${opts.personas > 0 ? opts.personas : '[completar]'}`,
  ].join('\n')
}

export function ReservaForm({ whatsappNumber }: { whatsappNumber: string }) {
  // `hoy` se calcula solo en el cliente (evita desajustes de hidratación) y
  // define tanto el mes inicial del calendario como el límite de fechas
  // pasadas que se deshabilitan.
  const [hoy, setHoy] = useState<string | null>(null)
  const [cursor, setCursor] = useState<Date | null>(null)
  const [fechaISO, setFechaISO] = useState<string | null>(null)
  const [hora, setHora] = useState('')
  const [personas, setPersonas] = useState(2)
  const [tipoEvento, setTipoEvento] = useState<string | null>(null)

  useEffect(() => {
    const parts = getSantiagoParts(new Date())
    setHoy(parts.dateISO)
    const [y, m] = parts.dateISO.split('-').map(Number)
    setCursor(new Date(y, m - 1, 1))
  }, [])

  const mensaje = useMemo(
    () => armarMensaje({ tipoEvento, fechaISO, hora, personas }),
    [tipoEvento, fechaISO, hora, personas],
  )
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(mensaje)}`

  const esMesActual = cursor && hoy && `${cursor.getFullYear()}-${pad2(cursor.getMonth() + 1)}` === hoy.slice(0, 7)

  function cambiarMes(delta: 1 | -1) {
    setCursor((c) => (c ? new Date(c.getFullYear(), c.getMonth() + delta, 1) : c))
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Tipo de evento */}
      <div className="space-y-2.5">
        <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-brand">
          <Sparkles className="h-3.5 w-3.5" /> Tipo de evento
        </span>
        <div className="flex flex-wrap gap-2">
          {TIPOS_EVENTO.map((tipo) => (
            <button
              key={tipo}
              type="button"
              onClick={() => setTipoEvento((t) => (t === tipo ? null : tipo))}
              className={cn(
                'rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all',
                tipoEvento === tipo
                  ? 'border-brand bg-brand text-brand-foreground shadow-[0_0_16px] shadow-brand/50'
                  : 'border-background/20 bg-background/5 text-background/80 hover:border-brand/50 hover:bg-background/10',
              )}
            >
              {tipo}
            </button>
          ))}
        </div>
      </div>

      {/* Calendario "futurista" */}
      <div className="space-y-2.5">
        <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-brand">
          <CalendarIcon className="h-3.5 w-3.5" /> Fecha
        </span>
        <div className="relative overflow-hidden rounded-2xl border border-brand/25 bg-black/30 p-4 shadow-[inset_0_0_40px_rgba(22,197,212,0.08)]">
          {/* Grilla decorativa de fondo, sutil */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
              backgroundSize: '22px 22px',
            }}
          />

          {!cursor || !hoy ? (
            <div className="relative h-64 animate-pulse rounded-xl bg-white/5" />
          ) : (
            <div className="relative">
              <div className="mb-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => cambiarMes(-1)}
                  disabled={!!esMesActual}
                  aria-label="Mes anterior"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-background/70 transition-colors hover:bg-white/10 hover:text-brand disabled:pointer-events-none disabled:opacity-20"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <p className="text-sm font-bold uppercase tracking-wide text-background">
                  {MESES[cursor.getMonth()]} <span className="text-background/50">{cursor.getFullYear()}</span>
                </p>
                <button
                  type="button"
                  onClick={() => cambiarMes(1)}
                  aria-label="Mes siguiente"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-background/70 transition-colors hover:bg-white/10 hover:text-brand"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center">
                {DIAS_HEADER.map((d, i) => (
                  <span key={i} className="py-1 text-[0.65rem] font-bold uppercase text-background/40">
                    {d}
                  </span>
                ))}
                {buildMonthGrid(cursor).map((iso, i) => {
                  if (!iso) return <span key={i} />
                  const dia = Number(iso.slice(-2))
                  const esPasado = iso < hoy
                  const esHoy = iso === hoy
                  const seleccionado = iso === fechaISO
                  return (
                    <button
                      key={i}
                      type="button"
                      disabled={esPasado}
                      onClick={() => setFechaISO(iso)}
                      className={cn(
                        'relative aspect-square rounded-full text-sm font-semibold transition-all',
                        esPasado && 'pointer-events-none text-background/20',
                        !esPasado && !seleccionado && 'text-background/85 hover:bg-white/10 hover:text-brand',
                        esHoy && !seleccionado && 'ring-1 ring-inset ring-brand/60',
                        seleccionado &&
                          'bg-brand text-brand-foreground shadow-[0_0_18px] shadow-brand/60',
                      )}
                    >
                      {dia}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hora */}
      <div className="space-y-2.5">
        <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-brand">
          <Clock className="h-3.5 w-3.5" /> Hora
        </span>
        <div className="flex flex-wrap gap-2">
          {HORAS_SUGERIDAS.map((h) => (
            <button
              key={h}
              type="button"
              onClick={() => setHora((v) => (v === h ? '' : h))}
              className={cn(
                'rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all',
                hora === h
                  ? 'border-brand bg-brand text-brand-foreground shadow-[0_0_16px] shadow-brand/50'
                  : 'border-background/20 bg-background/5 text-background/80 hover:border-brand/50 hover:bg-background/10',
              )}
            >
              {h}
            </button>
          ))}
          <input
            type="time"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            aria-label="Otra hora"
            className="rounded-full border border-background/20 bg-background/5 px-3.5 py-1.5 text-sm font-medium text-background outline-none [color-scheme:dark] focus:border-brand"
          />
        </div>
      </div>

      {/* Personas */}
      <div className="space-y-2.5">
        <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-brand">
          <Users className="h-3.5 w-3.5" /> Número de personas
        </span>
        <div className="flex w-fit items-center gap-4 rounded-full border border-background/20 bg-background/5 px-2 py-1.5">
          <button
            type="button"
            onClick={() => setPersonas((p) => Math.max(1, p - 1))}
            aria-label="Menos personas"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-background/80 transition-colors hover:bg-white/10 hover:text-brand"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-6 text-center text-base font-bold text-background">{personas}</span>
          <button
            type="button"
            onClick={() => setPersonas((p) => Math.min(60, p + 1))}
            aria-label="Más personas"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-background/80 transition-colors hover:bg-white/10 hover:text-brand"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <Button
        variant="brand"
        size="pill-lg"
        className="w-fit"
        nativeButton={false}
        render={<a href={whatsappHref} target="_blank" rel="noopener noreferrer" />}
      >
        <MessageCircle className="h-5 w-5 text-[#25D366]" />
        Reservar por WhatsApp
      </Button>
    </div>
  )
}

'use client'

import { usePathname } from 'next/navigation'
import { CalendarDays, Gift, Image, Images, UtensilsCrossed } from 'lucide-react'
import { cn } from '@/lib/utils'

const TABS = [
  { href: '/admin/inicio', label: 'Inicio', icon: Image },
  { href: '/admin/promociones', label: 'Promociones', icon: Gift },
  { href: '/admin/eventos', label: 'Eventos', icon: CalendarDays },
  { href: '/admin/galeria', label: 'Galería', icon: Images },
  { href: '/admin/carta', label: 'Carta', icon: UtensilsCrossed },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="mb-6 flex w-fit gap-1 rounded-2xl border border-border bg-card p-1 shadow-sm">
      {TABS.map((tab) => {
        const active = pathname?.startsWith(tab.href)
        return (
          <a
            key={tab.href}
            href={tab.href}
            className={cn(
              'flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors',
              active ? 'bg-brand text-brand-foreground' : 'text-muted-foreground hover:bg-muted',
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </a>
        )
      })}
    </nav>
  )
}

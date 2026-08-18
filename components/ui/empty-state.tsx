import type { LucideIcon } from 'lucide-react'
import { Button } from './button'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  ctaLabel?: string
  ctaHref?: string
}

// Estado vacío elegante para secciones sin contenido cargado todavía
// (ver lib/content.ts). Reemplaza el viejo patrón de texto "próximamente".
export function EmptyState({ icon: Icon, title, description, ctaLabel, ctaHref }: EmptyStateProps) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-3xl border border-dashed border-border bg-card/50 px-8 py-14 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/15 text-brand">
        <Icon className="h-7 w-7" />
      </span>
      <div>
        <p className="text-h3">{title}</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
      {ctaLabel && ctaHref && (
        <Button
          variant="brand"
          size="pill"
          nativeButton={false}
          render={<a href={ctaHref} target="_blank" rel="noopener noreferrer" />}
        >
          {ctaLabel}
        </Button>
      )}
    </div>
  )
}

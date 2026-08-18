'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { SmartImage } from '@/components/ui/smart-image'

// Un `Promo` mapea 1:1 a un futuro documento de la colección Appwrite
// "promotions" (campos: imageUrl, badge, title, subtitle, ctaText,
// ctaLink, price, order, active). Cuando exista esa colección, basta
// con hacer el fetch, ordenar por `order`/`active` y pasar el arreglo
// resultante como prop `promos` — el resto del componente no cambia.
export interface Promo {
  id: string
  imageUrl: string
  badge?: string
  title: string
  subtitle?: string
  ctaText?: string
  ctaLink?: string
  price?: string
}

interface PromoBannerProps {
  promos?: Promo[]
  intervalMs?: number
  className?: string
}

const DEFAULT_PROMOS: Promo[] = [
  {
    id: 'default-1',
    imageUrl: '/images/promo-platter.png',
    badge: 'Promo',
    title: '2x1 en Rolls',
    subtitle: 'Todos los martes, en local y para retiro.',
    ctaText: 'Ver promoción',
    ctaLink: '#promociones',
  },
]

export function PromoBanner({
  promos = DEFAULT_PROMOS,
  intervalMs = 6000,
  className,
}: PromoBannerProps) {
  const [index, setIndex] = useState(0)
  const promo = promos[index] ?? promos[0]

  useEffect(() => {
    if (promos.length <= 1) return
    const id = setInterval(
      () => setIndex((i) => (i + 1) % promos.length),
      intervalMs,
    )
    return () => clearInterval(id)
  }, [promos.length, intervalMs])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={cn('relative mx-auto w-full max-w-[22rem] sm:max-w-sm', className)}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
        className="relative aspect-square"
      >
        {/* Soft ambient glow */}
        <div className="absolute -inset-5 rounded-4xl bg-brand/30 blur-2xl animate-pulse-soft" />

        {/* Rotating conic-gradient border */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
          className="absolute -inset-[2px] rounded-3xl bg-[conic-gradient(from_0deg,var(--brand),var(--accent-orange),transparent_45%,var(--brand))] opacity-90"
        />

        {/* Glass card */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="group relative h-full w-full overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-2xl shadow-brand/25 backdrop-blur-xl"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={promo.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0"
            >
              <SmartImage
                src={promo.imageUrl || '/placeholder.svg'}
                alt={promo.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 90vw, 26rem"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
            </motion.div>
          </AnimatePresence>

          <div className="relative flex h-full flex-col justify-end gap-2 p-6 text-left">
            {promo.badge && (
              <span className="animate-pulse-soft mb-1 inline-flex w-fit items-center gap-1.5 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-sm">
                <Sparkles className="h-3 w-3 text-brand" />
                {promo.badge}
              </span>
            )}
            <h3 className="text-xl font-extrabold leading-tight text-white sm:text-2xl">
              {promo.title}
            </h3>
            {promo.subtitle && (
              <p className="text-pretty text-sm leading-relaxed text-white/75">
                {promo.subtitle}
              </p>
            )}
            <div className="mt-2 flex items-center justify-between gap-3">
              {promo.ctaLink && (
                <Button
                  variant="brand"
                  size="pill-sm"
                  className="shadow-brand/40 group-hover:translate-x-0.5"
                  nativeButton={false}
                  render={<a href={promo.ctaLink} />}
                >
                  {promo.ctaText ?? 'Ver más'}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              )}
              {promo.price && (
                <span className="text-2xl font-extrabold text-brand">
                  {promo.price}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {promos.length > 1 && (
        <div className="mt-4 flex justify-center gap-1.5">
          {promos.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Ver promoción ${i + 1}`}
              className={cn(
                'h-1.5 rounded-full transition-all',
                i === index ? 'w-6 bg-brand' : 'w-1.5 bg-white/30',
              )}
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}

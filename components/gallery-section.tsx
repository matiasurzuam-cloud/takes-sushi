import Image from 'next/image'
import { Reveal } from '@/components/reveal'

const images = [
  { src: '/images/hero-sushi.png', alt: 'Variedad de sushi', span: 'lg:row-span-2' },
  { src: '/images/dish-maki.png', alt: 'Hosomakis frescos', span: '' },
  { src: '/images/coffee.png', alt: 'Café de especialidad', span: '' },
  { src: '/images/dish-nigiri.png', alt: 'Nigiri de salmón', span: '' },
  {
    src: '/images/gallery-interior.png',
    alt: 'Interior del local',
    span: 'lg:col-span-2',
  },
  { src: '/images/dish-california.png', alt: 'California rolls', span: '' },
]

export function GallerySection() {
  return (
    <section id="galeria" className="relative bg-secondary/40 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-[0.25em] text-accent">
            Galería
          </span>
          <h2 className="mt-3 text-balance text-3xl font-extrabold leading-tight text-foreground sm:text-4xl lg:text-5xl">
            Un vistazo a TAKE&apos;S
          </h2>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
            Cada plato cuenta una historia. Reemplaza estas imágenes con tus
            fotografías reales para mostrar lo mejor de tu cocina.
          </p>
        </Reveal>

        <div className="mt-12 grid auto-rows-[200px] grid-cols-2 gap-4 sm:auto-rows-[240px] lg:grid-cols-4">
          {images.map((img, i) => (
            <Reveal
              key={img.src + i}
              delay={(i % 4) * 70}
              className={`group relative overflow-hidden rounded-2xl ${img.span}`}
            >
              <Image
                src={img.src || '/placeholder.svg'}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

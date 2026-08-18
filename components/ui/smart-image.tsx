import Image, { type ImageProps } from 'next/image'

// Wrapper de next/image para imágenes cuya fuente puede ser una URL externa
// pegada a mano (ej. el campo "URL" del admin de promociones, o una imagen
// de content.json). Next.js exige declarar cada dominio remoto en
// next.config para poder optimizarlo — como no podemos anticipar qué URL va
// a pegar el admin, esas se sirven sin optimizar (comportamiento anterior).
// Las rutas locales (/images/...) sí se optimizan (WebP/AVIF + srcset).
export function SmartImage({ src, ...props }: ImageProps) {
  const isExternal = typeof src === 'string' && /^https?:\/\//.test(src)
  return <Image src={src} {...props} unoptimized={isExternal} />
}

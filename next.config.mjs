/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Habilita el optimizador de imágenes de Next (usa `sharp`, ya
    // instalado): sirve WebP/AVIF según el navegador y genera el srcset
    // responsivo automáticamente a partir del prop `sizes` de cada
    // <Image>. Las URLs externas (ej. pegadas a mano en el admin) se
    // renderizan sin optimizar vía <SmartImage> — ver components/ui/smart-image.tsx.
    formats: ['image/avif', 'image/webp'],
  },
}

export default nextConfig

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'

// Plantilla compartida para las imágenes de Open Graph (una por ruta, vía
// el archivo especial opengraph-image.tsx de Next.js — se detecta solo,
// sin tocar el `metadata` de cada página). Corre en runtime Node (no edge)
// porque necesita leer el logo del disco con `node:fs` para incrustarlo
// como data URI — Satori (el motor detrás de ImageResponse) no puede
// resolver rutas de /public como lo hace next/image.
//
// Colores tomados de app/globals.css (tokens --brand/--accent/--foreground/
// --scrim en oklch) — Satori no soporta oklch(), así que van como hex
// calculado una sola vez (ver historial: canvas.fillStyle + getImageData).
export const OG_SIZE = { width: 1200, height: 630 }
export const OG_CONTENT_TYPE = 'image/png'

const BRAND = '#30c8cf'
const ACCENT = '#f26f27'
const SCRIM = '#050f15'

let logoDataUri: string | null = null
function getLogoDataUri() {
  if (!logoDataUri) {
    const buf = readFileSync(join(process.cwd(), 'public', 'images', 'logo.jpg'))
    logoDataUri = `data:image/jpeg;base64,${buf.toString('base64')}`
  }
  return logoDataUri
}

export function renderOgImage({ eyebrow, title }: { eyebrow: string; title: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px',
          backgroundColor: SCRIM,
          backgroundImage: `radial-gradient(circle at 15% 15%, ${BRAND}55, transparent 45%), radial-gradient(circle at 85% 85%, ${ACCENT}4d, transparent 45%)`,
          fontFamily: 'sans-serif',
        }}
      >
        <img
          src={getLogoDataUri()}
          width={104}
          height={104}
          style={{ borderRadius: '9999px', border: `4px solid ${BRAND}` }}
        />
        <div
          style={{
            marginTop: 36,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            color: BRAND,
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: 4,
            textTransform: 'uppercase',
          }}
        >
          {eyebrow}
        </div>
        <div
          style={{
            marginTop: 20,
            display: 'flex',
            color: 'white',
            fontSize: 68,
            fontWeight: 800,
            lineHeight: 1.15,
            textAlign: 'center',
            maxWidth: 980,
          }}
        >
          {title}
        </div>
        <div
          style={{
            marginTop: 28,
            display: 'flex',
            color: '#ffffffb3',
            fontSize: 28,
            fontWeight: 500,
          }}
        >
          TAKE&apos;S · Sushi &amp; Coffee
        </div>
      </div>
    ),
    { ...OG_SIZE },
  )
}

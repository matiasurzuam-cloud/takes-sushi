import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-image'

export const runtime = 'nodejs'
export const alt = "Club Takes — TAKE'S Sushi & Coffee"
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return renderOgImage({
    eyebrow: "TAKE'S · Sushi & Coffee",
    title: "Únete al Club Take's",
  })
}

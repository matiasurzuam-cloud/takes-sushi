import { supabaseAdmin } from '@/lib/supabase/admin'

/**
 * Contenido editable del sitio (galería, reseñas y datos de contacto),
 * leído de Supabase (tablas `galeria`, `resenas`, `site_config` — ver
 * supabase/schema.sql). La sección "Promociones" de la home NO vive acá:
 * usa la tabla `promociones` (la misma del pop-up) vía
 * components/promo-popup/use-promos-vigentes.ts, para que ambas compartan
 * la misma lógica de vigencia por día/hora/countdown — ver
 * lib/promociones/vigencia.ts. La tabla `ofertas` quedó sin uso (no se
 * borró, solo se dejó de leer).
 *
 * `getContent()` usa la service_role key (bypassa RLS) y por eso solo se
 * puede llamar desde código de servidor. Se llama UNA vez en app/page.tsx
 * y el resultado se pasa como prop a cada sección — ningún componente
 * cliente debe importar este archivo directamente (menu-section.tsx es
 * 'use client' y recibe solo el string que necesita, no el objeto entero).
 *
 * Cada sección muestra un estado vacío elegante (ver
 * components/ui/empty-state.tsx) cuando el arreglo correspondiente está
 * vacío, en vez de texto de relleno tipo "próximamente".
 *
 * Campos:
 * - galeria[]: { id, imagen, alt, categoria } — 6 a 8 fotos.
 *   `categoria` es "sushi" | "cafe" | "local".
 * - resenas[]: { id, nombre, rating, comentario, fecha, fuente, avatarUrl? }
 *   — reseñas reales, copiadas tal cual desde Google Business o Instagram
 *   (nunca inventadas — Google penaliza las reseñas "self-serving").
 *   `rating` es 1 a 5. `fecha` en formato ISO, se muestra como fecha
 *   relativa ("hace 2 semanas"). `fuente` define qué logo se muestra junto
 *   al nombre. `avatarUrl` es opcional (si no hay foto, se usan iniciales).
 * - confianza: { texto, rating, resenasCount } — badge de confianza en el
 *   Hero y promedio general arriba de las reseñas. Si `rating` > 0 se
 *   muestra como "★ 4.9 (120 reseñas)" y habilita el structured data
 *   (AggregateRating); si no, se usa `texto` tal cual; si ambos están
 *   vacíos, cae en un badge neutro por defecto (no inventa cifras).
 * - contacto: dirección/horario como arreglos de líneas, teléfono, y
 *   redes.whatsapp / redes.instagram / redes.google / redes.maps / redes.waze.
 *   `maps` es el link directo a la ficha de Google Maps del local (con su
 *   Place ID) — `google` es un link distinto, al buscador con las reseñas.
 * - contacto.horarioSemanal: igual que `horario` pero estructurado, solo
 *   para calcular "Abierto ahora" en tiempo real — `horario` (texto libre)
 *   no se puede parsear de forma confiable, por eso son dos campos.
 *   `dias` usa la convención de Date.getDay() (0 = domingo … 6 = sábado).
 * - clubBeneficios: { activo, titulo, descripcion, link, textoBoton } — fila
 *   propia en site_config (id "club_beneficios"). `activo` en false = la
 *   sección no se renderiza (ni vacía). Pensado para un sistema externo de
 *   puntos/tracking que todavía no existe: `link` arranca vacío y se carga
 *   más adelante desde Supabase Studio — sin necesidad de tocar código.
 */
export type CategoriaGaleria = 'sushi' | 'cafe' | 'local'

export interface FotoGaleria {
  id: string
  imagen: string
  alt: string
  categoria: CategoriaGaleria
}

export type FuenteResena = 'google' | 'instagram'

export interface Resena {
  id: string
  nombre: string
  rating: number
  comentario: string
  fecha: string
  fuente: FuenteResena
  avatarUrl?: string
}

export interface Confianza {
  texto: string
  rating: number
  resenasCount: number
}

export interface HorarioBloque {
  /** 0 = domingo … 6 = sábado (misma convención que Date.getDay()). */
  dias: number[]
  /** Hora de apertura, formato "HH:MM" (24h). */
  abre: string
  /** Hora de cierre, formato "HH:MM" (24h). */
  cierra: string
}

export interface ContactoInfo {
  direccion: string[]
  horario: string[]
  horarioSemanal: HorarioBloque[]
  telefono: string
  redes: {
    whatsapp: string
    instagram: string
    google: string
    maps: string
    waze: string
  }
}

export interface ClubBeneficios {
  activo: boolean
  titulo: string
  descripcion: string
  link: string
  textoBoton: string
}

export interface SiteContent {
  galeria: FotoGaleria[]
  resenas: Resena[]
  confianza: Confianza
  contacto: ContactoInfo
  clubBeneficios: ClubBeneficios
}

const DEFAULT_CONFIANZA: Confianza = { texto: '', rating: 0, resenasCount: 0 }

const DEFAULT_CONTACTO: ContactoInfo = {
  direccion: [],
  horario: [],
  horarioSemanal: [],
  telefono: '',
  redes: { whatsapp: '', instagram: '', google: '', maps: '', waze: '' },
}

const DEFAULT_CLUB_BENEFICIOS: ClubBeneficios = {
  activo: false,
  titulo: '',
  descripcion: '',
  link: '',
  textoBoton: 'Unirme al Club',
}

interface FotoRow {
  id: string
  imagen: string
  alt: string
  categoria: CategoriaGaleria
}

interface ResenaRow {
  id: string
  nombre: string
  rating: number
  comentario: string
  fecha: string
  fuente: FuenteResena
  avatar_url: string | null
}

function mapFoto(row: FotoRow): FotoGaleria {
  return { id: row.id, imagen: row.imagen, alt: row.alt, categoria: row.categoria }
}

function mapResena(row: ResenaRow): Resena {
  return {
    id: row.id,
    nombre: row.nombre,
    rating: row.rating,
    comentario: row.comentario,
    fecha: row.fecha,
    fuente: row.fuente,
    avatarUrl: row.avatar_url ?? undefined,
  }
}

export async function getContent(): Promise<SiteContent> {
  const [galeriaRes, resenasRes, configRes] = await Promise.all([
    supabaseAdmin.from('galeria').select('*').eq('activo', true).order('orden'),
    supabaseAdmin.from('resenas').select('*').eq('activo', true).order('orden'),
    supabaseAdmin.from('site_config').select('*'),
  ])

  const configById = new Map(
    (configRes.data ?? []).map((row: { id: string; data: unknown }) => [row.id, row.data]),
  )

  return {
    galeria: ((galeriaRes.data ?? []) as FotoRow[]).map(mapFoto),
    resenas: ((resenasRes.data ?? []) as ResenaRow[]).map(mapResena),
    confianza: { ...DEFAULT_CONFIANZA, ...(configById.get('confianza') as Partial<Confianza>) },
    contacto: { ...DEFAULT_CONTACTO, ...(configById.get('contacto') as Partial<ContactoInfo>) },
    clubBeneficios: {
      ...DEFAULT_CLUB_BENEFICIOS,
      ...(configById.get('club_beneficios') as Partial<ClubBeneficios>),
    },
  }
}

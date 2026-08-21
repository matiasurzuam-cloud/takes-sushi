export type CategoriaGaleria = 'sushi' | 'cafe' | 'local'

export interface GaleriaFoto {
  id: string
  imagen: string
  alt: string
  categoria: CategoriaGaleria
  activo: boolean
  orden: number
}

export type GaleriaFotoInput = Omit<GaleriaFoto, 'id' | 'orden' | 'activo'>

// Tope de fotos visibles en la galería del sitio: al subir la 13ª, se borra
// automáticamente la más antigua (fila + archivo en Storage) — ver
// lib/galeria/store.ts. Esta constante vive acá (no en store.ts) porque el
// panel admin (client component) necesita este número sin arrastrar el
// módulo del repositorio, que importa el cliente service_role de Supabase.
export const MAX_FOTOS = 12

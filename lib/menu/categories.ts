// Metadata liviana de las categorías del menú — solo lo necesario para que
// el panel admin (components/admin/carta-admin.tsx) pueda listarlas y dejar
// cambiar la imagen de banner de cada una, sin tener que importar
// components/menu-section.tsx completo (que trae los ~150 platos hardcoded
// y es 'use client'). Si se agrega, saca o renombra una categoría allá, hay
// que reflejarlo acá también — mismo id, mismo orden en que aparecen las
// pestañas (Vegano primero, después el resto tal como están en `categories`).
export interface MenuCategoryMeta {
  id: string
  label: string
  /** Imagen que se usa mientras no haya un override guardado en Supabase. */
  defaultImage: string
}

export const MENU_CATEGORIES: MenuCategoryMeta[] = [
  { id: 'vegano', label: 'Vegano', defaultImage: '/images/cat-sushi-rolls.png' },
  { id: 'entradas', label: 'Entradas & Picoteos', defaultImage: '/images/cat-entradas.png' },
  { id: 'sushi', label: 'Sushi & Rolls', defaultImage: '/images/cat-sushi-rolls.png' },
  { id: 'shirashi', label: 'Shirashi Bowls', defaultImage: '/images/cat-shirashi.png' },
  { id: 'promociones', label: "Promociones Take's", defaultImage: '/images/promo-platter.png' },
  { id: 'pizzas', label: 'Pizzas & Ceviches', defaultImage: '/images/cat-pizzas-ceviches.png' },
  { id: 'almuerzo', label: 'Almuerzos', defaultImage: '/images/cat-almuerzo.png' },
  {
    id: 'ensaladas',
    label: 'Ensaladas, Fajitas & Quesadillas',
    defaultImage: '/images/cat-ensaladas-fajitas.png',
  },
  {
    id: 'tostadas',
    label: 'Tostadas, Sandwiches & Desayunos',
    defaultImage: '/images/cat-sandwiches.png',
  },
  { id: 'cafeteria', label: 'Cafetería', defaultImage: '/images/coffee.png' },
  { id: 'bebidas', label: 'Bebidas, Cócteles & Mocktails', defaultImage: '/images/cat-mocktails.png' },
  { id: 'postres', label: 'Postres & Pastelería', defaultImage: '/images/cat-postres.png' },
]

// Fila "singleton" en site_config (mismo patrón que 'confianza', 'contacto',
// 'club_beneficios' — ver lib/content.ts) — no hace falta una tabla nueva,
// `data` es un jsonb con forma { [categoryId]: imagenUrl } y solo trae las
// categorías que el admin haya personalizado (las demás caen a defaultImage).
export const MENU_CATEGORIES_CONFIG_ID = 'menu_categorias'

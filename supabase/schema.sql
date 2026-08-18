-- TAKE'S Sushi & Coffee — schema inicial de Supabase
--
-- Cómo correrlo: Supabase Studio → SQL Editor → pegar todo este archivo →
-- Run. Es idempotente (se puede volver a correr sin duplicar nada).
--
-- Diseño de acceso: todas las tablas tienen RLS activado SIN políticas
-- públicas. Nada le habla a Supabase directo desde el navegador — el
-- pop-up público, la home y el panel admin siguen pasando por las API
-- routes de Next.js, que van a usar la service_role key del lado del
-- servidor (esa key ignora RLS). Así no hace falta diseñar políticas para
-- el anon key porque nunca se usa.
-- La única excepción es el bucket de Storage: las imágenes sí las carga
-- el navegador directo desde la URL pública de Supabase (evita duplicar
-- tráfico a través de nuestro propio servidor).

create extension if not exists pgcrypto;

-- Función compartida para mantener `updated_at` al día en cada UPDATE.
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ---------------------------------------------------------------------------
-- 1. Promociones del pop-up (reemplaza data/promociones.json)
-- ---------------------------------------------------------------------------
create table if not exists public.promociones (
  id uuid primary key default gen_random_uuid(),
  imagenes text[] not null default '{}',
  titulo text not null,
  descripcion text not null,
  link text,
  fecha_expiracion date,
  activo boolean not null default true,
  orden integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.promociones enable row level security;

drop trigger if exists set_updated_at on public.promociones;
create trigger set_updated_at
  before update on public.promociones
  for each row execute function public.set_updated_at();

-- Semilla: misma promo que ya existía en data/promociones.json.
insert into public.promociones (imagenes, titulo, descripcion, link, activo, orden)
select '{/images/promo-platter.png}', '2x1 en Rolls',
  'Todos los martes, en local y para retiro. Válido en rolls seleccionados.',
  '#promociones', true, 0
where not exists (select 1 from public.promociones);

-- ---------------------------------------------------------------------------
-- 2. Contenido del sitio (reemplaza data/content.json)
-- ---------------------------------------------------------------------------
create table if not exists public.ofertas (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descripcion text not null,
  imagen text not null,
  condiciones text,
  activo boolean not null default true,
  orden integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.ofertas enable row level security;
drop trigger if exists set_updated_at on public.ofertas;
create trigger set_updated_at
  before update on public.ofertas
  for each row execute function public.set_updated_at();

create table if not exists public.galeria (
  id uuid primary key default gen_random_uuid(),
  imagen text not null,
  alt text not null,
  categoria text not null check (categoria in ('sushi', 'cafe', 'local')),
  activo boolean not null default true,
  orden integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.galeria enable row level security;
drop trigger if exists set_updated_at on public.galeria;
create trigger set_updated_at
  before update on public.galeria
  for each row execute function public.set_updated_at();

create table if not exists public.resenas (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  rating smallint not null check (rating between 1 and 5),
  comentario text not null,
  fecha date not null,
  fuente text not null check (fuente in ('google', 'instagram')),
  avatar_url text,
  activo boolean not null default true,
  orden integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.resenas enable row level security;
drop trigger if exists set_updated_at on public.resenas;
create trigger set_updated_at
  before update on public.resenas
  for each row execute function public.set_updated_at();

-- Config "singleton" (confianza, contacto) — un blob jsonb por fila en vez
-- de normalizar en más tablas: son objetos únicos, no listas, y calzan
-- mejor así con la forma en que ya vivían en content.json.
create table if not exists public.site_config (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.site_config enable row level security;
drop trigger if exists set_updated_at on public.site_config;
create trigger set_updated_at
  before update on public.site_config
  for each row execute function public.set_updated_at();

-- Semilla: mismos valores que hoy tiene data/content.json (horario e
-- Instagram reales que ya cargamos; el resto vacío hasta que lo completes).
insert into public.site_config (id, data) values
  ('confianza', '{"texto": "", "rating": 0, "resenasCount": 0}'),
  ('contacto', '{
    "direccion": [],
    "horario": [
      "Lunes y martes: 13:00 - 22:30",
      "Miércoles a viernes: 13:00 - 23:00",
      "Sábado: 17:30 - 23:00",
      "Domingo: cerrado"
    ],
    "horarioSemanal": [
      {"dias": [1, 2], "abre": "13:00", "cierra": "22:30"},
      {"dias": [3, 4, 5], "abre": "13:00", "cierra": "23:00"},
      {"dias": [6], "abre": "17:30", "cierra": "23:00"}
    ],
    "telefono": "",
    "redes": {
      "whatsapp": "56933327395",
      "instagram": "https://www.instagram.com/takesmolina/",
      "google": "https://www.google.com/search?q=takes+sushi&oq=takes+&gs_lcrp=EgZjaHJvbWUqCAgAEEUYJxg7MggIABBFGCcYOzIGCAEQRRg5MgYIAhAjGCcyCggDEC4YsQMYgAQyCggEEAAYsQMYgAQyBggFEEUYPDIGCAYQRRg8MgYIBxBFGDzSAQc4ODdqMGo0qAIAsAIB&sourceid=chrome&source=chrome.ob&ie=UTF-8#lrd=0x9664551fcd30c597:0xed75c71f28f2705b,1,,,,",
      "maps": "https://www.google.com/maps/place/take+sushi+molina/data=!4m2!3m1!1s0x9664551fcd30c597:0xed75c71f28f2705b",
      "waze": "https://waze.com/ul?q=Take%27s%20Sushi%20Molina%2C%20Chile&navigate=yes"
    }
  }'),
  -- "activo" en false: el banner de la home se queda oculto hasta que se
  -- cargue el link real del sistema externo de puntos/tracking.
  ('club_beneficios', '{
    "activo": false,
    "titulo": "Club de Beneficios Take''s",
    "descripcion": "Únete y acumula beneficios exclusivos en cada visita",
    "link": "",
    "textoBoton": "Unirme al Club"
  }')
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- 3. Storage — reemplaza /public/images/promociones (no funciona en Vercel)
-- ---------------------------------------------------------------------------
-- Bucket público: las imágenes se sirven directo desde la URL pública de
-- Supabase (el navegador las pide directo, no pasan por nuestro servidor).
-- Solo el service_role puede subir/borrar (lo hace la API route del admin,
-- que ignora RLS por diseño — ver comentario del encabezado).
insert into storage.buckets (id, name, public)
values ('promociones', 'promociones', true)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- 4. Login del admin → Supabase Auth
-- ---------------------------------------------------------------------------
-- No hace falta tabla propia: Supabase Auth ya maneja los usuarios en
-- auth.users. El usuario admin se crea desde el dashboard (Authentication →
-- Users → Add user) o por código con la Admin API una vez que tengamos la
-- service_role key — no se puede crear por SQL plano de forma segura
-- (el hash de contraseña lo arma el propio servicio de Auth).

-- ---------------------------------------------------------------------------
-- 5. Programación de promociones (countdown + vigencia por día/hora)
-- ---------------------------------------------------------------------------
-- IMPORTANTE — convención de días: acá `dias_semana` usa 1=lunes … 7=domingo
-- (ISO 8601), a propósito distinta de `horarioSemanal.dias` en
-- site_config → contacto (que usa 0=domingo…6=sábado, la convención de
-- Date.getDay() en JS). Son dos features separadas con orígenes de datos
-- distintos — no mezclar los índices entre una y otra al leerlas en código.
--
-- null en dias_semana = se muestra todos los días (comportamiento actual).
-- null en hora_inicio/hora_fin = disponible todo el día.
alter table public.promociones
  add column if not exists dias_semana integer[] default null;

alter table public.promociones
  add column if not exists hora_inicio time default null;

alter table public.promociones
  add column if not exists hora_fin time default null;

-- ---------------------------------------------------------------------------
-- 6. Catálogo de eventos
-- ---------------------------------------------------------------------------
-- Sin columna `orden`: a diferencia de promociones/galería, el orden natural
-- de un catálogo de eventos es la fecha (próximo primero), no una posición
-- manual — ver lib/eventos/store.ts.
create table if not exists public.eventos (
  id uuid primary key default gen_random_uuid(),
  imagen text not null,
  titulo text not null,
  descripcion text not null,
  fecha date not null,
  hora time,
  ubicacion text,
  precio text,
  link text,
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.eventos enable row level security;

drop trigger if exists set_updated_at on public.eventos;
create trigger set_updated_at
  before update on public.eventos
  for each row execute function public.set_updated_at();

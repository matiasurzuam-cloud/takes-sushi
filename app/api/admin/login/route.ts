import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST /api/admin/login  body: { email, contrasena }
// Autentica contra Supabase Auth (el usuario admin se crea desde el
// dashboard de Supabase: Authentication → Users → Add user).
export async function POST(req: NextRequest) {
  const { email, contrasena } = await req.json()

  if (typeof email !== 'string' || typeof contrasena !== 'string') {
    return NextResponse.json({ error: 'Correo o contraseña incorrectos' }, { status: 401 })
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password: contrasena })

  if (error) {
    return NextResponse.json({ error: 'Correo o contraseña incorrectos' }, { status: 401 })
  }

  return NextResponse.json({ success: true })
}

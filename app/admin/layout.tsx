import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Panel Admin — TAKE'S",
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-muted/40">{children}</div>
}

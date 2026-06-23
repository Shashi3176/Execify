import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard | Execify',
  description: 'Monitor worker pool, analytics, and scheduling performance',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

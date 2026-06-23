import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Submit Code | Execify',
  description: 'Submit code for execution with priority control and real-time status',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

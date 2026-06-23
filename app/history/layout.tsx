import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Submission History | Execify',
  description: 'Browse and filter all past code execution submissions',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Asymmetrisch Zadeldak Calculator',
  description: 'Bereken de afmetingen van een asymmetrisch zadeldak',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  )
}
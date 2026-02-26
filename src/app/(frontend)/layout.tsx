import React from 'react'
import { MainLayout } from '@/shared/layouts/main-layout'
import './globals.css'

export const metadata = {
  description: 'Real-time multiplayer typing race platform.',
  title: 'TypeRacer Tonik',
  icons: { icon: '/favicon.svg' },
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" className="dark">
      <body>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  )
}

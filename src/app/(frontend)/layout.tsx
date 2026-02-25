import React from 'react'
import './globals.css'

export const metadata = {
  description: 'Real-time multiplayer typing race platform.',
  title: 'TypeRacer Tonik',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" className="dark">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}

import { headers as getHeaders } from 'next/headers.js'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import config from '@payload-config'
import { Button } from '@/shared/ui/button'

export default async function HomePage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers })

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 py-20 text-center">
      <div className="flex flex-col gap-3 animate-fade-in-up">
        <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          TypeRacer Tonik
        </h1>
        <p className="text-lg text-muted">Race against others in real-time typing competitions</p>
      </div>
      {user ? (
        <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <Link href="/lobby">
            <Button size="lg">Enter Lobby</Button>
          </Link>
        </div>
      ) : (
        <div className="flex gap-3 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <Link href="/login">
            <Button size="lg">Login</Button>
          </Link>
          <Link href="/register">
            <Button variant="secondary" size="lg">
              Register
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}

import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="flex flex-col items-center gap-6 text-center">
        <h1 className="text-5xl font-bold tracking-tight">TypeRacer Tonik</h1>
        <p className="text-lg text-muted">Real-time multiplayer typing races</p>
        {user ? (
          <p className="text-muted">Welcome back, {user.email}</p>
        ) : (
          <div className="flex gap-3">
            <a
              href="/login"
              className="rounded-lg bg-primary px-6 py-2.5 font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Login
            </a>
            <a
              href="/register"
              className="rounded-lg border border-border px-6 py-2.5 font-medium transition-opacity hover:opacity-80"
            >
              Register
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

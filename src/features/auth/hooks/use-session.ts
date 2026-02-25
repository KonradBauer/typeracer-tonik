'use client'

import { useEffect, useState } from 'react'

interface Session {
  userId: string
  token: string
}

export function useSession(): Session | null {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch('/api/users/me', { credentials: 'include' })
        if (!res.ok) return
        const data = await res.json()
        if (data.user) {
          const tokenCookie = document.cookie
            .split('; ')
            .find((c) => c.startsWith('payload-token='))
          const token = tokenCookie?.split('=')[1] ?? ''
          setSession({ userId: data.user.id, token })
        }
      } catch {
        // Not authenticated
      }
    }
    fetchSession()
  }, [])

  return session
}

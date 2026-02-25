'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export interface RegisterState {
  error: string | null
}

export async function register(_prev: RegisterState, formData: FormData): Promise<RegisterState> {
  const username = formData.get('username') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!username || !email || !password) {
    return { error: 'All fields are required.' }
  }

  if (username.length < 3 || username.length > 24) {
    return { error: 'Username must be between 3 and 24 characters.' }
  }

  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters.' }
  }

  try {
    const payload = await getPayload({ config })

    await payload.create({
      collection: 'users',
      data: {
        email,
        password,
        username,
      },
    })

    const result = await payload.login({
      collection: 'users',
      data: { email, password },
    })

    if (result.token) {
      const cookieStore = await cookies()
      cookieStore.set('payload-token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax',
      })
    }
  } catch {
    return { error: 'Registration failed. Email or username may already be taken.' }
  }

  redirect('/lobby')
}

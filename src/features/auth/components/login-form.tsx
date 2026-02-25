'use client'

import { useActionState } from 'react'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { login } from '@/features/auth/actions/login'

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, { error: null })

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.error && (
        <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{state.error}</p>
      )}
      <Input id="email" name="email" type="email" label="Email" placeholder="you@example.com" required />
      <Input id="password" name="password" type="password" label="Password" placeholder="••••••••" required />
      <Button type="submit" disabled={pending}>
        {pending ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  )
}

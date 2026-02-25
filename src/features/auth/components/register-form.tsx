'use client'

import { useActionState } from 'react'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { register } from '@/features/auth/actions/register'

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(register, { error: null })

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.error && (
        <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{state.error}</p>
      )}
      <Input id="username" name="username" label="Username" placeholder="racer123" required minLength={3} maxLength={24} />
      <Input id="email" name="email" type="email" label="Email" placeholder="you@example.com" required />
      <Input id="password" name="password" type="password" label="Password" placeholder="••••••••" required minLength={6} />
      <Button type="submit" disabled={pending}>
        {pending ? 'Creating account...' : 'Create Account'}
      </Button>
    </form>
  )
}

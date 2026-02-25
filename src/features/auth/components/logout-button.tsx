'use client'

import { logout } from '@/features/auth/actions/logout'

export function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="text-sm text-muted transition-colors hover:text-foreground"
      >
        Logout
      </button>
    </form>
  )
}

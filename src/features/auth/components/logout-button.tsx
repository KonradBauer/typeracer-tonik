'use client'

import { logout } from '@/features/auth/actions/logout'

export function LogoutButton() {
  return (
    <form action={logout}>
      <button type="submit" className="text-muted hover:text-foreground text-sm transition-colors">
        Logout
      </button>
    </form>
  )
}

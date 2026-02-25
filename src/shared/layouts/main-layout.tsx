import { headers as getHeaders } from 'next/headers.js'
import Link from 'next/link'
import { getPayload } from 'payload'
import type { ReactNode } from 'react'

import config from '@payload-config'
import { APP_NAME } from '@/shared/lib/constants'
import { LogoutButton } from '@/features/auth/components/logout-button'
import LogoTonik from '@/assets/logo-tonik.svg'
import TextLogoTonik from '@/assets/text-logo-tonik.svg'

async function getUser() {
  const headers = await getHeaders()
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers })
  return user
}

export async function MainLayout({ children }: { children: ReactNode }) {
  const user = await getUser()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border">
        <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <LogoTonik className="h-6 w-6 text-foreground" />
            <TextLogoTonik className="h-4 text-foreground" />
          </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link href="/lobby" className="text-sm text-muted transition-colors hover:text-foreground">
                  Lobby
                </Link>
                <Link href="/leaderboard" className="text-sm text-muted transition-colors hover:text-foreground">
                  Leaderboard
                </Link>
                <Link
                  href={`/profile/${user.id}`}
                  className="text-sm text-muted transition-colors hover:text-foreground"
                >
                  Profile
                </Link>
                <LogoutButton />
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm text-muted transition-colors hover:text-foreground"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</div>

      <footer className="border-t border-border">
        <div className="mx-auto flex h-12 max-w-5xl items-center justify-center px-4">
          <p className="text-xs text-muted">{APP_NAME}</p>
        </div>
      </footer>
    </div>
  )
}

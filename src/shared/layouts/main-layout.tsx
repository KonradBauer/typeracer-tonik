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
      <header className="border-border border-b">
        <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <LogoTonik className="text-foreground h-6 w-6" />
            <TextLogoTonik className="text-foreground h-4" />
          </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  href="/lobby"
                  className="text-muted hover:text-foreground after:bg-primary relative text-sm transition-colors after:absolute after:bottom-[-2px] after:left-0 after:h-[2px] after:w-0 after:transition-all after:duration-200 hover:after:w-full"
                >
                  Lobby
                </Link>
                <Link
                  href="/leaderboard"
                  className="text-muted hover:text-foreground after:bg-primary relative text-sm transition-colors after:absolute after:bottom-[-2px] after:left-0 after:h-[2px] after:w-0 after:transition-all after:duration-200 hover:after:w-full"
                >
                  Leaderboard
                </Link>
                <Link
                  href={`/profile/${user.id}`}
                  className="text-muted hover:text-foreground after:bg-primary relative text-sm transition-colors after:absolute after:bottom-[-2px] after:left-0 after:h-[2px] after:w-0 after:transition-all after:duration-200 hover:after:w-full"
                >
                  Profile
                </Link>
                <LogoutButton />
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-muted hover:text-foreground text-sm transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-primary text-primary-foreground rounded-lg px-4 py-1.5 text-sm font-medium transition-opacity hover:opacity-90"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</div>

      <footer className="border-border border-t">
        <div className="mx-auto flex h-12 max-w-5xl items-center justify-center px-4">
          <p className="text-muted text-xs">{APP_NAME}</p>
        </div>
      </footer>
    </div>
  )
}

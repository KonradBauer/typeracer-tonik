'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import type { LeaderboardEntry } from '@/features/leaderboard/actions/get-leaderboard'
import { Badge } from '@/shared/ui/badge'

interface LeaderboardTableProps {
  entries: LeaderboardEntry[]
}

type SortKey = 'elo' | 'avgWpm' | 'bestWpm' | 'avgAccuracy' | 'totalRaces'
type SortDir = 'asc' | 'desc'

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: 'elo', label: 'Elo' },
  { key: 'avgWpm', label: 'Avg WPM' },
  { key: 'bestWpm', label: 'Best WPM' },
  { key: 'avgAccuracy', label: 'Accuracy' },
  { key: 'totalRaces', label: 'Races' },
]

const PAGE_SIZE_OPTIONS = [10, 25, 50]

function rankBadgeVariant(rank: number) {
  if (rank === 1) return 'success' as const
  if (rank === 2) return 'warning' as const
  if (rank === 3) return 'danger' as const
  return 'default' as const
}

export function LeaderboardTable({ entries }: LeaderboardTableProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const sortBy = (searchParams.get('sort') as SortKey) || 'elo'
  const sortDir = (searchParams.get('dir') as SortDir) || 'desc'
  const page = Math.max(1, Number(searchParams.get('page')) || 1)
  const pageSize = PAGE_SIZE_OPTIONS.includes(Number(searchParams.get('size')))
    ? Number(searchParams.get('size'))
    : 10

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString())
      for (const [key, value] of Object.entries(updates)) {
        params.set(key, value)
      }
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams],
  )

  const handleSort = useCallback(
    (key: SortKey) => {
      const newDir = sortBy === key && sortDir === 'desc' ? 'asc' : 'desc'
      updateParams({ sort: key, dir: newDir, page: '1' })
    },
    [sortBy, sortDir, updateParams],
  )

  const sorted = useMemo(() => {
    const copy = [...entries]
    copy.sort((a, b) => {
      const mul = sortDir === 'desc' ? -1 : 1
      return (a[sortBy] - b[sortBy]) * mul
    })
    return copy
  }, [entries, sortBy, sortDir])

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const paginated = sorted.slice((safePage - 1) * pageSize, safePage * pageSize)

  if (entries.length === 0) {
    return <p className="text-muted py-8 text-center">No races completed yet.</p>
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="border-border overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-border bg-card border-b text-left">
              <th className="text-muted px-4 py-3 font-medium">#</th>
              <th className="text-muted px-4 py-3 font-medium">Player</th>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className="text-muted hover:text-foreground cursor-pointer px-4 py-3 text-right font-medium transition-colors select-none"
                  onClick={() => handleSort(col.key)}
                >
                  {col.label}
                  {sortBy === col.key && (
                    <span className="ml-1">{sortDir === 'desc' ? '↓' : '↑'}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((entry, i) => {
              const rank = (safePage - 1) * pageSize + i + 1
              return (
                <tr key={entry.id} className="border-border border-b last:border-b-0">
                  <td className="px-4 py-3">
                    <Badge variant={rankBadgeVariant(rank)}>{rank}</Badge>
                  </td>
                  <td className="px-4 py-3 font-medium">{entry.username}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{entry.elo}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{entry.avgWpm}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{entry.bestWpm}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{entry.avgAccuracy}%</td>
                  <td className="px-4 py-3 text-right tabular-nums">{entry.totalRaces}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span className="text-muted">Rows:</span>
          {PAGE_SIZE_OPTIONS.map((size) => (
            <button
              key={size}
              onClick={() => updateParams({ size: String(size), page: '1' })}
              className={`rounded px-2 py-1 transition-colors ${
                pageSize === size ? 'bg-primary text-white' : 'text-muted hover:text-foreground'
              }`}
            >
              {size}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => updateParams({ page: String(safePage - 1) })}
            disabled={safePage <= 1}
            className="text-muted hover:text-foreground rounded px-2 py-1 transition-colors disabled:opacity-30"
          >
            Prev
          </button>
          <span className="text-muted tabular-nums">
            {safePage} / {totalPages}
          </span>
          <button
            onClick={() => updateParams({ page: String(safePage + 1) })}
            disabled={safePage >= totalPages}
            className="text-muted hover:text-foreground rounded px-2 py-1 transition-colors disabled:opacity-30"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

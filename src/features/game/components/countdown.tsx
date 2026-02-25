'use client'

interface CountdownProps {
  seconds: number
}

export function Countdown({ seconds }: CountdownProps) {
  return (
    <div className="flex flex-col items-center gap-2 py-12">
      <p className="text-6xl font-bold tabular-nums">{seconds}</p>
      <p className="text-muted">Get ready...</p>
    </div>
  )
}

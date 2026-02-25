import { cn } from '@/shared/lib/cn'

export interface SpinnerProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeStyles = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
}

export function Spinner({ className, size = 'md' }: SpinnerProps) {
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-muted border-t-primary',
        sizeStyles[size],
        className,
      )}
      role="status"
      aria-label="Loading"
    />
  )
}

'use client'

import { cn } from '@/shared/lib/cn'
import { type InputHTMLAttributes, forwardRef } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-foreground text-sm font-medium">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'border-border bg-card text-foreground placeholder:text-muted focus:border-primary focus:ring-primary/50 rounded-lg border px-3 py-2 text-sm transition-colors outline-none focus:ring-1',
            error && 'border-danger focus:border-danger focus:ring-danger/50',
            className,
          )}
          {...props}
        />
        {error && <p className="text-danger text-xs">{error}</p>}
      </div>
    )
  },
)
Input.displayName = 'Input'

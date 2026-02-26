'use client'

import { cn } from '@/shared/lib/cn'
import { type ButtonHTMLAttributes, forwardRef } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-primary-foreground hover:opacity-90',
  secondary: 'bg-card text-foreground border border-border hover:bg-border/50',
  ghost: 'text-foreground hover:bg-card',
  danger: 'bg-danger text-white hover:opacity-90',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-2.5 text-base',
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'focus-visible:ring-primary/50 inline-flex cursor-pointer items-center justify-center rounded-lg font-medium transition-all duration-150 hover:brightness-110 focus-visible:ring-2 focus-visible:outline-none active:scale-[0.97]',
          variantStyles[variant],
          sizeStyles[size],
          disabled && 'pointer-events-none opacity-50',
          className,
        )}
        disabled={disabled}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

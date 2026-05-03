import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface BadgeProps {
  children: ReactNode
  className?: string
}

/** Small pill-shaped status / availability badge. */
export default function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-zinc-300 bg-zinc-100 px-2.5 py-1 text-xs font-medium dark:border-zinc-700 dark:bg-zinc-900',
        className,
      )}
    >
      {children}
    </span>
  )
}

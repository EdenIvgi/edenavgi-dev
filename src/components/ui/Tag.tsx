import type { ReactNode } from 'react'

/** Small inline tag, typically used for tech-stack labels on cards. */
export default function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
      {children}
    </span>
  )
}

import { useInView } from 'framer-motion'
import { useRef } from 'react'

/** Returns a ref + boolean indicating if the element has scrolled into view (once). */
export function useScrollAnimation<T extends Element = HTMLDivElement>(amount: number = 0.2) {
  const ref = useRef<T>(null)
  const inView = useInView(ref, { once: true, amount })
  return { ref, inView }
}

/** Standard Framer Motion variants used across the site. */
export const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
}

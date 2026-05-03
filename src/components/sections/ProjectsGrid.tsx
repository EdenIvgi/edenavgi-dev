import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import VideoCard from '@/components/ui/VideoCard'
import { projects } from '@/data/projects'
import type { ProjectCategory } from '@/types/project'
import { cn } from '@/utils/cn'

type Filter = 'all' | ProjectCategory

/** Filterable grid of project cards. */
export default function ProjectsGrid() {
  const { t } = useTranslation()
  const [filter, setFilter] = useState<Filter>('all')

  const filtered = useMemo(
    () => (filter === 'all' ? projects : projects.filter((p) => p.category === filter)),
    [filter],
  )

  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: t('projects.filterAll') },
    { key: 'web', label: t('projects.filterWeb') },
    { key: 'mobile', label: t('projects.filterMobile') },
  ]

  return (
    <section id="projects" className="mx-auto max-w-6xl px-6 py-24">
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <h2 className="font-heading text-4xl font-bold md:text-5xl">
          {t('projects.title')}
        </h2>

        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={cn(
                'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
                filter === f.key
                  ? 'border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900'
                  : 'border-zinc-300 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <motion.div layout className="grid gap-8 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {filtered.map((p) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <VideoCard project={p} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}

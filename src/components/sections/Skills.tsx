import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { staggerContainer, fadeUp } from '@/hooks/useScrollAnimation'

const skillGroups: { key: 'frontend' | 'backend' | 'ai' | 'devops'; items: string[] }[] = [
  {
    key: 'frontend',
    items: ['React', 'Vue', 'TypeScript', 'JavaScript (ES6+)', 'HTML5', 'CSS3', 'SCSS', 'Tailwind'],
  },
  {
    key: 'backend',
    items: ['Node.js', 'Express', 'Python', 'PostgreSQL', 'MongoDB', 'REST APIs'],
  },
  {
    key: 'ai',
    items: ['LLM Integration', 'RAG', 'Prompt Engineering', 'Vector Databases'],
  },
  {
    key: 'devops',
    items: ['Docker', 'Playwright', 'Git'],
  },
]

/** Tech-stack grid grouped by category, animated on scroll. Sourced from CV. */
export default function Skills() {
  const { t } = useTranslation()

  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <h2 className="font-heading mb-12 text-4xl font-bold md:text-5xl">{t('skills.title')}</h2>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
        className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
      >
        {skillGroups.map((g) => (
          <motion.div key={g.key} variants={fadeUp}>
            <h3 className="text-primary mb-3 text-sm font-semibold tracking-wider uppercase">
              {t(`skills.${g.key}`)}
            </h3>
            <ul className="space-y-2">
              {g.items.map((s) => (
                <li
                  key={s}
                  className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
                >
                  {s}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

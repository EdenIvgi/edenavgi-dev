import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import Badge from '@/components/ui/Badge'
import { fadeUp } from '@/hooks/useScrollAnimation'

/** About section: bio, availability, education + experience highlights. */
export default function About() {
  const { t } = useTranslation()

  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-24">
      <div className="grid gap-12 md:grid-cols-2 md:items-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
        >
          <Badge>
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            {t('about.available')}
          </Badge>
          <h2 className="font-heading mt-4 mb-6 text-4xl font-bold md:text-5xl">
            {t('about.title')}
          </h2>
          <div className="space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              I'm Eden<br />
              a Fullstack Developer with hands-on, end-to-end experience building web
              applications from scratch in team-based environments. I combine strong frontend
              skills with backend development, focused on practical, user-driven solutions.
            </p>
            <p>
              I actively leverage AI-assisted development tools to improve code quality, accelerate
              iteration, and automate workflows. I bring a proven leadership background, strong
              communication skills, and a responsible, solution-oriented approach to problem-solving.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
              <p className="text-primary text-xs font-semibold tracking-wider uppercase">
                Education
              </p>
              <p className="mt-2 text-sm font-medium">Fullstack Web<br />Coding Academy</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">2024 - 2025</p>
            </div>
            <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
              <p className="text-primary text-xs font-semibold tracking-wider uppercase">
                Experience
              </p>
              <p className="mt-2 text-sm font-medium">Bar Manager · IDF Combat Commander</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Leadership · teams of up to 10
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex justify-center md:justify-end"
        >
          <div className="relative aspect-square w-full max-w-[320px] overflow-hidden rounded-3xl bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 shadow-xl dark:from-blue-900/40 dark:via-purple-900/40 dark:to-pink-900/40">
            <img
              src="/eden-portrait.png"
              alt="Eden Avgi"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

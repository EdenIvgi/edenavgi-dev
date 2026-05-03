import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import Button from '@/components/ui/Button'
import BackgroundSmear from '@/components/layout/BackgroundSmear'

/** Landing hero with staggered text animation and CTA buttons. */
export default function Hero() {
  const { t } = useTranslation()
  const name = t('hero.name')

  return (
    <section
      id="top"
      className="relative flex min-h-screen items-center justify-center px-6"
    >
      <BackgroundSmear />

      {/* Light-mode local tint */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 dark:hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/60 via-white/0 to-white/0"
      />

      <div className="mx-auto max-w-4xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 text-sm font-medium tracking-widest text-zinc-500 uppercase dark:text-zinc-400"
        >
          {t('hero.preTitle')}
        </motion.p>

        <h1 className="font-heading mb-6 text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl">
          <motion.span
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.05, delayChildren: 0.2 } },
            }}
            className="inline-block"
          >
            {name.split('').map((ch, i) => (
              <motion.span
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200 } },
                }}
                className="inline-block"
              >
                {ch === ' ' ? ' ' : ch}
              </motion.span>
            ))}
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mx-auto mb-10 max-w-xl text-lg text-zinc-600 md:text-xl dark:text-zinc-400"
        >
          {t('hero.subtitle')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <a href="#projects">
            <Button variant="primary">{t('hero.viewProjects')}</Button>
          </a>
          <a href="#contact">
            <Button variant="secondary">{t('hero.getInTouch')}</Button>
          </a>
        </motion.div>
      </div>

      <motion.a
        href="#about"
        aria-label="Scroll to next section"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-zinc-400"
      >
        ↓
      </motion.a>
    </section>
  )
}

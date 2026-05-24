import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useDarkMode } from '@/hooks/useDarkMode'
import { cn } from '@/utils/cn'

/** Top navigation: logo, anchors, language + theme toggles. */
export default function Navbar() {
  const { t, i18n } = useTranslation()
  const { isDark, toggle } = useDarkMode()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const switchLang = () => {
    void i18n.changeLanguage(i18n.language.startsWith('he') ? 'en' : 'he')
  }

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all',
        scrolled
          ? 'bg-white/70 backdrop-blur-md dark:bg-zinc-950/70 border-b border-zinc-200/60 dark:border-zinc-800/60'
          : 'bg-transparent',
      )}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="font-heading text-lg font-semibold tracking-tight">
          edenavgi.dev
        </Link>

        <ul className="hidden items-center gap-8 text-sm md:flex">
          <li><a href="#about" className="hover:text-primary transition-colors">{t('nav.about')}</a></li>
          <li><a href="#projects" className="hover:text-primary transition-colors">{t('nav.projects')}</a></li>
          <li><a href="#contact" className="hover:text-primary transition-colors">{t('nav.contact')}</a></li>
        </ul>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={switchLang}
            aria-label="Toggle language"
            className="rounded-md border border-zinc-300 px-2 py-1 text-xs font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            {i18n.language.startsWith('he') ? 'EN' : 'HE'}
          </button>
          <button
            type="button"
            onClick={toggle}
            aria-label="Toggle dark mode"
            className="rounded-md border border-zinc-300 px-2 py-1 text-xs font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            {isDark ? '☀' : '☾'}
          </button>
        </div>
      </nav>
    </motion.header>
  )
}

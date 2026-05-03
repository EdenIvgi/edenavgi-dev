import { useTranslation } from 'react-i18next'

const socials = [
  { href: 'https://github.com/EdenIvgi', label: 'GitHub' },
  { href: 'https://linkedin.com/in/eden-avgi', label: 'LinkedIn' },
  { href: 'mailto:edenavgi@gmail.com', label: 'Email' },
]

/** Minimal footer with copyright, social links + back-to-top. */
export default function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-zinc-600 md:flex-row dark:text-zinc-400">
        <p>© {year} Eden Avgi · {t('footer.builtWith')}</p>
        <ul className="flex items-center gap-5">
          {socials.map((s) => (
            <li key={s.href}>
              <a
                href={s.href}
                target={s.href.startsWith('http') ? '_blank' : undefined}
                rel={s.href.startsWith('http') ? 'noreferrer' : undefined}
                className="hover:text-primary transition-colors"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <a href="#top" className="hover:text-primary transition-colors">
          ↑ {t('footer.backToTop')}
        </a>
      </div>
    </footer>
  )
}

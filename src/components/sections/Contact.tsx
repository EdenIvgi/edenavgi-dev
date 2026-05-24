import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import Button from '@/components/ui/Button'
import { fadeUp } from '@/hooks/useScrollAnimation'

type Status = 'idle' | 'loading' | 'success' | 'error'

const directLinks = [
  { key: 'directEmail', href: 'mailto:edenavgi@gmail.com', label: 'edenavgi@gmail.com' },
  { key: 'directLinkedIn', href: 'https://linkedin.com/in/eden-avgi', label: 'linkedin.com/in/eden-avgi' },
  { key: 'directGitHub', href: 'https://github.com/EdenIvgi', label: 'github.com/EdenIvgi' },
] as const

const CONTACT_EMAIL = 'edenavgi@gmail.com'

/** Contact section. Submits by opening the visitor's mail client pre-filled to CONTACT_EMAIL. */
export default function Contact() {
  const { t } = useTranslation()
  const [status, setStatus] = useState<Status>('idle')

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')
    const form = e.currentTarget
    const data = new FormData(form)
    const name = String(data.get('name') || '').trim()
    const email = String(data.get('email') || '').trim()
    const message = String(data.get('message') || '').trim()

    const subject = `Portfolio message from ${name || 'visitor'}`
    const body = `From: ${name} <${email}>\n\n${message}`
    const href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

    window.location.href = href
    setStatus('success')
    form.reset()
  }

  return (
    <section id="contact" className="mx-auto max-w-3xl px-6 py-24">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
      >
        <h2 className="font-heading mb-4 text-4xl font-bold md:text-5xl">{t('contact.title')}</h2>
        <p className="mb-10 text-zinc-600 dark:text-zinc-400">{t('contact.intro')}</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            required
            type="text"
            name="name"
            placeholder={t('contact.name')}
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm focus:ring-primary focus:outline-none focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900"
          />
          <input
            required
            type="email"
            name="email"
            placeholder={t('contact.email')}
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm focus:ring-primary focus:outline-none focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900"
          />
          <textarea
            required
            name="message"
            rows={5}
            placeholder={t('contact.message')}
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm focus:ring-primary focus:outline-none focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900"
          />
          <Button type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? t('contact.sending') : t('contact.send')}
          </Button>

          {status === 'success' && (
            <p className="text-sm text-emerald-600 dark:text-emerald-400">{t('contact.success')}</p>
          )}
          {status === 'error' && (
            <p className="text-sm text-red-600 dark:text-red-400">{t('contact.error')}</p>
          )}
        </form>

        <div className="mt-12 grid gap-3 border-t border-zinc-200 pt-8 sm:grid-cols-2 dark:border-zinc-800">
          {directLinks.map((link) => (
            <a
              key={link.key}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
              className="group flex items-center justify-between rounded-lg border border-zinc-200 px-4 py-3 text-sm transition-all hover:-translate-y-0.5 hover:border-zinc-400 hover:shadow-sm dark:border-zinc-800 dark:hover:border-zinc-600"
            >
              <span className="text-zinc-500 dark:text-zinc-400">{t(`contact.${link.key}`)}</span>
              <span className="text-primary font-medium">{link.label} →</span>
            </a>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

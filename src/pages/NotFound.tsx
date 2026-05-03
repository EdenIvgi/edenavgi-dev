import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PageWrapper from '@/components/layout/PageWrapper'

/** 404 fallback. */
export default function NotFound() {
  const { t } = useTranslation()
  return (
    <PageWrapper>
      <section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 text-center">
        <h1 className="font-heading mb-4 text-6xl font-bold">404</h1>
        <p className="mb-8 text-zinc-600 dark:text-zinc-400">{t('notFound.title')}</p>
        <Link to="/" className="text-primary underline">{t('notFound.back')}</Link>
      </section>
    </PageWrapper>
  )
}

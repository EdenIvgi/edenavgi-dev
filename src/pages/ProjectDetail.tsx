import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PageWrapper from '@/components/layout/PageWrapper'
import Tag from '@/components/ui/Tag'
import Button from '@/components/ui/Button'
import ProjectShowcase from '@/components/sections/ProjectShowcase'
import { projects } from '@/data/projects'

/** Detail view for a single project. Projects with deviceFrame render media inside a photorealistic device mockup. */
export default function ProjectDetail() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const project = projects.find((p) => p.id === id)

  if (!project) {
    return (
      <PageWrapper>
        <section className="mx-auto max-w-3xl px-6 py-32 text-center">
          <p className="mb-6 text-zinc-600 dark:text-zinc-400">{t('notFound.title')}</p>
          <Link to="/" className="text-primary underline">
            ← {t('notFound.back')}
          </Link>
        </section>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <article className="mx-auto max-w-4xl px-6 pt-32 pb-24">
        <Link
          to="/#projects"
          className="mb-8 inline-block text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          ← {t('projectDetail.backToProjects')}
        </Link>

        <h1 className="font-heading mb-4 text-4xl font-bold md:text-6xl whitespace-pre-line">{project.title}</h1>
        <p className="mb-10 text-lg text-zinc-600 dark:text-zinc-400 whitespace-pre-line">{project.shortDescription}</p>

        {/* Hero device showcase */}
        <div className="mb-16 -mx-6">
          <ProjectShowcase
            tabletScreen={project.showcase?.tabletScreen}
            phoneScreen={project.showcase?.phoneScreen}
            phoneScreen2={project.showcase?.phoneScreen2}
            videoPhone={project.showcase?.videoPhone}
          />
        </div>

        <div className="prose prose-zinc dark:prose-invert mb-10 max-w-none">
          <p className="whitespace-pre-line">{project.fullDescription}</p>
        </div>

        <div className="mb-10">
          <h2 className="font-heading mb-3 text-xl font-semibold">Tech</h2>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((s) => (
              <Tag key={s}>{s}</Tag>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer">
              <Button variant="primary">Live demo →</Button>
            </a>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noreferrer">
              <Button variant="secondary">
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.026 2.747-1.026.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                GitHub
              </Button>
            </a>
          )}
        </div>
      </article>
    </PageWrapper>
  )
}

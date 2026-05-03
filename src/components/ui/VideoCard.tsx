import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Tag from '@/components/ui/Tag'
import type { Project } from '@/types/project'

interface VideoCardProps {
  project: Project
}

/** Project card with logo square next to title, description, tech stack, and view link. */
export default function VideoCard({ project }: VideoCardProps) {
  return (
    <motion.article
      layout
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
      <Link to={`/projects/${project.id}`} className="flex flex-1 flex-col gap-3 p-5">
        {/* ── Title row with logo ──────────────────────────────────────── */}
        <div className="flex items-center gap-3">
          {/* Logo square */}
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-zinc-100 p-2 dark:bg-zinc-800">
            {project.logo ? (
              <img
                src={project.logo}
                alt={`${project.title} logo`}
                className="h-full w-full object-contain"
                loading="lazy"
              />
            ) : (
              <span className="text-sm font-bold text-zinc-400 dark:text-zinc-500">
                {project.title.charAt(0)}
              </span>
            )}
          </div>

          <h3 className="font-heading text-xl font-semibold whitespace-pre-line leading-snug">
            {project.title}
          </h3>
        </div>

        <p className="text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-line">
          {project.shortDescription}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {project.techStack.map((tech) => (
            <Tag key={tech}>{tech}</Tag>
          ))}
        </div>

        <span className="text-primary mt-auto pt-2 inline-block text-sm font-medium">
          View Project →
        </span>
      </Link>
    </motion.article>
  )
}

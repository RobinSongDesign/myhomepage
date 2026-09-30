import { Link } from 'react-router-dom'
import type { ProjectSummary } from '../data/projects'

export default function ProjectCard({ project, tall = false }: { project: ProjectSummary; tall?: boolean }) {
  return (
    <Link
      to={`/projects/${project.category}/${project.slug}`}
      className="group relative overflow-hidden rounded-lg block h-full"
    >
      <img
        src={project.thumbnail}
        alt={project.title}
        loading="lazy"
        className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
          tall ? 'h-full' : 'h-64 sm:h-[30rem]'
        }`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-primary-500/10 dark:from-magenta-500/10 to-primary-500/30 dark:to-magenta-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
        <div className="p-4 sm:p-6 text-white">
          <h3 className="text-lg sm:text-xl font-light mb-1 sm:mb-2">{project.title}</h3>
          <p className="font-light text-xs sm:text-sm">{project.subtitle}</p>
        </div>
      </div>
    </Link>
  )
}

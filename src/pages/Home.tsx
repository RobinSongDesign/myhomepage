import FlipCard from '../components/FlipCard'
import ProjectCard from '../components/ProjectCard'
import ScrollReveal from '../components/ScrollReveal'
import { codeProjects, designProjects } from '../data/projects'

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 个人介绍 */}
      <section id="intro" className="w-full py-40 relative">
        {/* 背景大 Logo —— 仅移动端显示 */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 scale-125 md:hidden pointer-events-none">
          <img src="/images/logo.svg" className="w-full h-full object-contain logo" alt="Background Logo" />
        </div>

        <div className="pt-16 mx-auto relative z-10 max-w-md flex flex-col items-center">
          <FlipCard />
        </div>

        {/* 向下箭头 */}
        <div className="animate-arrow mt-6 py-16 flex justify-center">
          <svg
            className="arrow-svg text-gray-500 dark:text-gray-400"
            viewBox="0 0 60 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="butt"
            width="60"
            height="20"
          >
            <polyline points="5,3 30,10 55,3" />
            <polyline points="5,10 30,17 55,10" />
          </svg>
        </div>
      </section>

      {/* 项目部分 —— Research & Development */}
      <ScrollReveal>
        <section id="CAD" className="mb-16 snap-section">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8 text-gray-900 dark:text-white">
            Research & Development
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-4">
            {codeProjects.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* 项目部分 —— Design */}
      <ScrollReveal delay={0.2}>
        <section id="projects" className="mb-16 snap-section py-0 md:pt-24 md:pb-48">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8 text-gray-900 dark:text-white">Design</h2>
          <div className="grid grid-cols-1 sm:grid-cols-8 md:grid-cols-12 gap-4 h-[30rem]">
            {designProjects.map((p) => (
              <div key={p.slug} className="col-span-1 sm:col-span-4 md:col-span-4 sm:row-span-3">
                <ProjectCard project={p} tall />
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>
    </div>
  )
}

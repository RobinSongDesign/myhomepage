import type { ReactNode } from 'react'

/** 项目页横幅 hero：全屏大图背景 + 居中标题/副标题 + 可选按钮 */
export function ProjectHero({
  image,
  title,
  subtitle,
  children,
}: {
  image: string
  title: string
  subtitle?: string
  children?: ReactNode
}) {
  return (
    <div className="w-full h-[60vh] sm:h-[80vh] md:h-[100vh] mb-8 sm:mb-16 relative overflow-hidden">
      <div className="absolute inset-0">
        <img src={image} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center text-white px-4">
          <h1 className="text-4xl sm:text-6xl font-light mb-4 opacity-90 drop-shadow-lg">{title}</h1>
          {subtitle && <p className="text-xl sm:text-2xl font-light mb-8 opacity-80">{subtitle}</p>}
          {children && <div className="flex justify-center space-x-4 flex-wrap gap-3">{children}</div>}
        </div>
      </div>
    </div>
  )
}

export function HeroButton({
  href,
  icon,
  children,
  download = false,
}: {
  href: string
  icon?: string
  children: ReactNode
  download?: boolean
}) {
  return (
    <a
      href={href}
      download={download || undefined}
      target={download ? undefined : '_blank'}
      rel={download ? undefined : 'noreferrer'}
      className="inline-flex items-center bg-white/20 backdrop-blur-sm border border-white/30 text-white px-4 py-3 rounded-lg hover:bg-white/30 transition-all duration-300 space-x-2"
    >
      {icon && <i className={icon} />}
      <span>{children}</span>
    </a>
  )
}

/** 内容容器 */
export function ProjectBody({ children }: { children: ReactNode }) {
  return <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">{children}</div>
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-12 sm:mt-16">
      <h2 className="text-xl sm:text-2xl font-light mb-4 text-gray-900 dark:text-white">{title}</h2>
      {children}
    </section>
  )
}

export function SubSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium mb-3 text-gray-800 dark:text-gray-200">{title}</h3>
      {children}
    </div>
  )
}

export function P({ children }: { children: ReactNode }) {
  return <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{children}</p>
}

export function Img({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  return (
    <figure className="my-6">
      <img src={src} alt={alt} loading="lazy" className="w-full rounded-lg" />
      {caption && <figcaption className="text-sm text-gray-500 dark:text-gray-400 mt-2">{caption}</figcaption>}
    </figure>
  )
}

export function Grid({ children, cols = 2 }: { children: ReactNode; cols?: 2 | 3 }) {
  const cls = cols === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3'
  return <div className={`grid grid-cols-1 ${cls} gap-4 my-6`}>{children}</div>
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mb-4">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  )
}

export function StatCard({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="bg-white dark:bg-dark-200 rounded-xl p-5 shadow-md border border-gray-100 dark:border-dark-300">
      <div className="text-2xl sm:text-3xl font-light text-primary-500 dark:text-magenta-400">{value}</div>
      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{label}</div>
      {note && <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">{note}</div>}
    </div>
  )
}

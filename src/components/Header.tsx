import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useUi } from '../context/UiContext'
import { codeProjects, designProjects } from '../data/projects'

function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme()
  return (
    <button
      aria-label="Toggle theme"
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-300 transition-colors duration-200"
    >
      {theme === 'dark' ? (
        <i className="fas fa-sun text-gray-300" />
      ) : (
        <i className="fas fa-moon text-gray-600" />
      )}
    </button>
  )
}

function SocialLinks({ small = false }: { small?: boolean }) {
  const { openWeChat } = useUi()
  const size = small ? 'text-xl' : 'text-xl'
  return (
    <div className={small ? 'flex justify-center space-x-6 py-2' : 'flex space-x-2 ml-1'}>
      <a
        href="https://www.linkedin.com/in/qizhen-song-b30993341/"
        target="_blank"
        rel="noreferrer"
        className="text-gray-600 hover:text-primary-500 dark:text-gray-400 dark:hover:text-magenta-400 transition-colors duration-200"
      >
        <i className={`fab fa-linkedin ${size}`} />
      </a>
      <a
        href="https://github.com/RobinSongDesign"
        target="_blank"
        rel="noreferrer"
        className="text-gray-600 hover:text-primary-500 dark:text-gray-400 dark:hover:text-magenta-400 transition-colors duration-200"
      >
        <i className={`fab fa-github ${size}`} />
      </a>
      <button
        onClick={openWeChat}
        className="text-gray-600 hover:text-primary-500 dark:text-gray-400 dark:hover:text-magenta-400 transition-colors duration-200"
      >
        <i className={`fab fa-weixin ${size}`} />
      </button>
    </div>
  )
}

export default function Header() {
  const { pathname } = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [designOpen, setDesignOpen] = useState(false)
  const [codeOpen, setCodeOpen] = useState(false)

  const isActive = (path: string) => (pathname === path ? 'text-primary-500 dark:text-magenta-400 font-medium' : '')

  return (
    <nav className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-sm dark:bg-dark-100/90 border-b border-gray-100 dark:border-dark-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Site Name */}
          <div className="flex items-center">
            <Link to="/" className="w-12 h-12 sm:w-14 sm:h-14 mr-2 flex items-center">
              <img src="/images/logo.svg" alt="Logo" className="w-12 h-12 sm:w-14 sm:h-14 logo" />
            </Link>
            <Link
              to="/"
              className="px-2 sm:px-4 py-2 font-medium hover:text-primary-500 dark:hover:text-magenta-400 hidden sm:block"
            >
              Robin Song
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              aria-label="Menu"
              onClick={() => setMobileOpen((v) => !v)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-300"
            >
              <i className="fas fa-bars" />
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <NavLink to="/" className={`px-3 py-2 hover:text-primary-500 dark:hover:text-magenta-400 ${isActive('/')}`}>
              Home
            </NavLink>

            {/* Design dropdown */}
            <div className="relative group">
              <button className="px-3 py-2 hover:text-primary-500 dark:hover:text-magenta-400">Design</button>
              <div className="absolute hidden group-hover:block bg-white/95 dark:bg-dark-200/95 backdrop-blur-sm shadow-md py-2 min-w-[200px] top-full left-0 rounded-lg">
                {designProjects.map((p) => (
                  <Link
                    key={p.slug}
                    to={`/projects/design/${p.slug}`}
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-dark-300"
                  >
                    {p.title}
                  </Link>
                ))}
              </div>
            </div>

            {/* Code dropdown */}
            <div className="relative group">
              <button className="px-3 py-2 hover:text-primary-500 dark:hover:text-magenta-400">Code</button>
              <div className="absolute hidden group-hover:block bg-white/95 dark:bg-dark-200/95 backdrop-blur-sm shadow-md py-2 min-w-[200px] top-full left-0 rounded-lg">
                {codeProjects.map((p) => (
                  <Link
                    key={p.slug}
                    to={`/projects/code/${p.slug}`}
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-dark-300"
                  >
                    {p.title}
                  </Link>
                ))}
              </div>
            </div>

            <NavLink
              to="/about"
              className={`px-3 py-2 hover:text-primary-500 dark:hover:text-magenta-400 ${isActive('/about')}`}
            >
              About Me
            </NavLink>

            <SocialLinks />
            <ThemeToggleButton />
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white dark:bg-dark-200 mt-2 rounded-lg shadow-lg overflow-hidden">
            <div className="py-2">
              <Link to="/" onClick={() => setMobileOpen(false)} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-dark-300">
                Home
              </Link>

              <button
                onClick={() => setDesignOpen((v) => !v)}
                className="w-full flex justify-between items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-dark-300"
              >
                <span>Design</span>
                <i className={`fas fa-chevron-${designOpen ? 'up' : 'down'} text-sm`} />
              </button>
              {designOpen && (
                <div className="bg-gray-50 dark:bg-dark-300">
                  {designProjects.map((p) => (
                    <Link
                      key={p.slug}
                      to={`/projects/design/${p.slug}`}
                      onClick={() => setMobileOpen(false)}
                      className="block px-6 py-2 hover:bg-gray-100 dark:hover:bg-dark-400"
                    >
                      {p.title}
                    </Link>
                  ))}
                </div>
              )}

              <button
                onClick={() => setCodeOpen((v) => !v)}
                className="w-full flex justify-between items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-dark-300"
              >
                <span>Code</span>
                <i className={`fas fa-chevron-${codeOpen ? 'up' : 'down'} text-sm`} />
              </button>
              {codeOpen && (
                <div className="bg-gray-50 dark:bg-dark-300">
                  {codeProjects.map((p) => (
                    <Link
                      key={p.slug}
                      to={`/projects/code/${p.slug}`}
                      onClick={() => setMobileOpen(false)}
                      className="block px-6 py-2 hover:bg-gray-100 dark:hover:bg-dark-400"
                    >
                      {p.title}
                    </Link>
                  ))}
                </div>
              )}

              <Link to="/about" onClick={() => setMobileOpen(false)} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-dark-300">
                About Me
              </Link>

              <div className="border-t border-gray-100 dark:border-dark-400 my-2" />
              <SocialLinks small />
              <div className="border-t border-gray-100 dark:border-dark-400 my-2" />
              <div className="flex px-4 py-2 justify-center">
                <ThemeToggleButton />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

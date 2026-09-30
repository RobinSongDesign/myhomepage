import { useState } from 'react'

interface OrbitLogo {
  src: string
  alt: string
  size: number
  duration: number
  delay: number
  invertInDark: boolean
}

const orbitLogos: OrbitLogo[] = [
  { src: '/images/rhinoceros.svg', alt: 'Rhino', size: 48, duration: 15, delay: 0, invertInDark: true },
  { src: '/images/csharp.svg', alt: 'C#', size: 36, duration: 20, delay: -5, invertInDark: false },
  { src: '/images/unity.svg', alt: 'Unity', size: 42, duration: 25, delay: -10, invertInDark: true },
  { src: '/images/python.svg', alt: 'Python', size: 32, duration: 18, delay: -8, invertInDark: false },
]

export default function FlipCard() {
  const [clicked, setClicked] = useState(false)

  return (
    <>
      {/* 移动端：简单个人信息卡片 */}
      <div className="md:hidden rounded-2xl bg-white/20 dark:bg-dark-200/30 backdrop-blur-sm shadow-xl overflow-hidden p-8 border border-white/20">
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4">View Better on Desktop</div>
        <div className="flex flex-col items-center text-center">
          <div className="mb-6">
            <img src="/images/logo.svg" className="w-24 h-24 transition-transform logo" alt="Robin Song's Logo" />
          </div>
          <h1 className="text-2xl font-bold mb-3 text-gray-800 dark:text-white">
            I'm <span className="text-primary-500 dark:text-magenta-400">Robin Song</span>
          </h1>
          <p className="text-gray-700 font-medium dark:text-gray-200 mb-6">Computational Designer & Developer</p>
          <a
            href="/files/CV_Song Qizhen.pdf"
            download="CV_Robin_Song"
            className="inline-flex items-center justify-center px-5 py-2 bg-white/70 hover:bg-white/90 dark:bg-dark-300/50 dark:hover:bg-dark-400/60 text-black dark:text-gray-200 backdrop-blur-sm font-medium rounded-full transition-all duration-200"
          >
            <i className="fas fa-download mr-2" />
            Download Resume
          </a>
        </div>
      </div>

      {/* 桌面端：翻转卡片 */}
      <div
        className="flip-card-container mx-auto relative hidden md:block"
        style={{ width: 360, height: 360 }}
        onClick={() => setClicked((v) => !v)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setClicked((v) => !v)
          }
        }}
      >
        {/* 轨道 Logo */}
        <div className="logo-orbit-container">
          {orbitLogos.map((logo) => (
            <img
              key={logo.src}
              src={logo.src}
              alt={logo.alt}
              className={`logo-orbit ${logo.invertInDark ? 'logo' : ''}`}
              style={{
                width: logo.size,
                height: logo.size,
                animation: `orbit ${logo.duration}s linear infinite`,
                animationDelay: `${logo.delay}s`,
              }}
            />
          ))}
        </div>

        <div className={`flip-card ${clicked ? 'clicked' : ''}`}>
          {/* 正面：Logo */}
          <div className="flip-card-front bg-gradient-to-t from-primary-100/20 dark:from-magenta-300/10 backdrop-blur-sm shadow-md">
            <img
              src="/images/logo.svg"
              className="w-2/3 h-2/3 transition-transform duration-500 logo"
              alt="Robin Song's Logo"
            />
          </div>
          {/* 背面：个人信息 */}
          <div className="flip-card-back bg-gray-100 dark:bg-dark-200/30 backdrop-blur-sm shadow-md">
            <div className="flex flex-col items-center text-center">
              <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-800 dark:text-white">
                I'm <span className="text-primary-500 dark:text-magenta-400">Robin Song</span>
              </h1>
              <p className="text-gray-700 font-bold dark:text-gray-200 mb-6">Computational Designer & Developer</p>
              <a
                href="/files/CV_Song Qizhen.pdf"
                download="CV_Robin_Song"
                className="inline-flex items-center justify-center px-6 py-3 bg-white hover:bg-white/70 dark:bg-dark-300/50 dark:hover:bg-dark-400/60 text-black dark:text-gray-200 backdrop-blur-sm font-medium rounded-full transition-all duration-200 hover:scale-105"
              >
                <i className="fas fa-download mr-2" />
                Download Resume
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

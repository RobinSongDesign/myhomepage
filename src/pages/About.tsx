import ScrollReveal from '../components/ScrollReveal'
import { useUi } from '../context/UiContext'

interface Skill {
  icon: string
  name: string
  level: number
  description: string
  wide: boolean
}

const skills: Skill[] = [
  {
    icon: 'fas fa-cube',
    name: 'Rhino & Grasshopper',
    level: 80,
    description: 'Parametric design and algorithmic modeling tool for complex geometry generation and form analysis',
    wide: true,
  },
  { icon: 'fas fa-building', name: 'Revit', level: 30, description: 'Building Information Modeling (BIM)', wide: false },
  { icon: 'fas fa-image', name: 'PS & AI', level: 85, description: 'Image editing and diagram creation', wide: false },
  {
    icon: 'fab fa-microsoft',
    name: 'C#',
    level: 70,
    description: 'Core language for Rhino and Grasshopper plugin development, creating complex design tools and automation workflows',
    wide: false,
  },
  { icon: 'fab fa-python', name: 'Python', level: 50, description: 'Machine Learning and Automated Processes', wide: false },
  {
    icon: 'fab fa-html5',
    name: 'HTML & CSS & JavaScript',
    level: 30,
    description: 'Web structure and styling and functionality',
    wide: true,
  },
  {
    icon: 'fas fa-gamepad',
    name: 'Unity',
    level: 60,
    description: 'Interactive 3D experiences and visualization design',
    wide: false,
  },
  {
    icon: 'fas fa-vr-cardboard',
    name: 'Unreal Engine',
    level: 30,
    description: 'High-quality rendering and real-time visualization and interaction',
    wide: false,
  },
  {
    icon: 'fas fa-puzzle-piece',
    name: 'Rhino & Grasshopper Plugin Development',
    level: 30,
    description:
      'Professional Rhino and Grasshopper plugin development, creating custom tools and components to extend design software capabilities',
    wide: true,
  },
]

const experiences = [
  {
    title: 'Architect',
    company: 'dEEP Architects',
    period: '2023.3 - 2023.7',
    bullets: [
      'Responsible for architectural design for Huairou Villa project, completed architectural floorplan development and elevation/section designs',
      'Responsible for the parametric optimization portion of the project, completed the facade development work for the high-rise office complex in Dingzhou, Hebei.',
    ],
  },
  {
    title: 'Landscape Architect',
    company: 'Shenzhen Meidao Landscape Architecture & Urban Planning & Design Institute',
    period: '2020.7 - 2020.9',
    bullets: [
      'Led the design team in developing user experience and interface designs for multiple products',
      'Utilizing computer vision semantic segmentation technology to rapidly identify building outlines on site, significantly improving design efficiency.',
      'Established and maintained the company design system, ensuring visual and interactive consistency across products',
    ],
  },
]

function SkillCard({ skill }: { skill: Skill }) {
  return (
    <div
      className={`rounded-lg ${skill.wide ? 'col-span-6 sm:col-span-6 aspect-[3/1]' : 'col-span-3 sm:col-span-3 aspect-[3/2]'} group border border-white dark:border-dark-100`}
    >
      <div className="bg-white dark:bg-dark-200 h-full w-full overflow-hidden relative">
        <div className="flex items-center justify-center h-full p-2 sm:p-4">
          <div className="text-center">
            <div className="mb-1 sm:mb-2 text-primary-500 dark:text-magenta-400">
              <i className={`${skill.icon} text-xl sm:text-2xl`} />
            </div>
            <div className="font-medium text-sm sm:text-base">{skill.name}</div>
            <div className="w-full bg-gray-200 dark:bg-dark-300 rounded-full h-1 sm:h-1.5 mt-1 sm:mt-2">
              <div
                className="bg-primary-500 dark:bg-magenta-500 h-1 sm:h-1.5 rounded-full"
                style={{ width: `${skill.level}%` }}
              />
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary-500/95 dark:from-magenta-500/95 to-primary-500/70 dark:to-magenta-500/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2 sm:p-4 flex items-end">
          <div className="text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <p className="text-xs sm:text-sm">{skill.description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function About() {
  const { openWeChat } = useUi()

  return (
    <div className="pt-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <header className="mb-10">
        <h1 className="text-4xl font-light text-gray-900 dark:text-white">About Me</h1>
      </header>

      {/* 个人简介 */}
      <section className="mb-10">
        <div className="grid grid-cols-12 gap-8 md:gap-12">
          <div className="col-span-12 md:col-span-4">
            <div className="aspect-square bg-gray-100 dark:bg-dark-300 overflow-hidden">
              <img src="/images/self.png" alt="Robin Song" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="col-span-12 md:col-span-8">
            <p className="text-lg mb-6 leading-relaxed">
              I am Robin Song. My design interests span architectural design, landscape design, with a particular
              focus on combining algorithms with design and exploring the relationship between form and mechanics.
            </p>
            <h2 className="text-2xl font-light mb-6">Education</h2>
            <div className="mb-6">
              <h3 className="text-xl mb-1">University College London</h3>
              <p className="text-gray-600 dark:text-gray-400">Architectural Computation | Sep 2024 - Sep 2025</p>
            </div>
            <div className="mb-6">
              <h3 className="text-xl mb-1">Beijing Forestry University</h3>
              <p className="text-gray-600 dark:text-gray-400">Major: Landscape Gardening | Sep 2019 - Jun 2023</p>
            </div>
          </div>
        </div>
      </section>

      {/* 技能 */}
      <ScrollReveal>
        <section id="skills" className="mb-16 pt-16">
          <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 md:gap-4">
            {skills.map((s) => (
              <SkillCard key={s.name} skill={s} />
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* 经验 */}
      <ScrollReveal delay={0.1}>
        <section id="experience" className="mb-16 pt-16">
          <div className="space-y-6">
            {experiences.map((exp) => (
              <div
                key={exp.title}
                className="bg-white dark:bg-dark-200 rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex flex-col mb-4">
                  <div className="text-xl font-bold mb-2">{exp.title}</div>
                  <div className="text-primary-600 dark:text-magenta-400 mb-2">{exp.company}</div>
                  <div className="text-gray-500 dark:text-gray-400">{exp.period}</div>
                </div>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
                  {exp.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* 联系 */}
      <ScrollReveal delay={0.15}>
        <section id="contact" className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">Contact Me</h2>
          <div className="bg-white dark:bg-dark-200 rounded-xl shadow-md p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-3">
                <h3 className="text-xl font-bold mb-4">Contact Information</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  If you're interested in my work or want to discuss potential collaboration opportunities, please
                  feel free to contact me.
                </p>
              </div>

              <div className="flex items-start">
                <div className="text-primary-500 dark:text-magenta-400 mr-4">
                  <i className="fas fa-envelope-open-text text-xl" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-gray-200">Email</h4>
                  <p className="text-gray-600 dark:text-gray-400">qizhen.song.24@ucl.ac.uk</p>
                  <p className="text-gray-600 dark:text-gray-400">songqizhen006@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="text-primary-500 dark:text-magenta-400 mr-4">
                  <i className="fas fa-map-marker-alt text-xl" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-gray-200">Location</h4>
                  <p className="text-gray-600 dark:text-gray-400">London, United Kingdom</p>
                  <p className="text-gray-600 dark:text-gray-400">Shenzhen, China</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="text-primary-500 dark:text-magenta-400 mr-4">
                  <i className="fas fa-phone-alt text-xl" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-gray-200">Phone</h4>
                  <p className="text-gray-600 dark:text-gray-400">+44 7726437631</p>
                  <p className="text-gray-600 dark:text-gray-400">+86 185 6583 5262</p>
                </div>
              </div>

              <div className="md:col-span-3 mt-4 pt-4 border-t border-gray-100 dark:border-dark-300">
                <div className="flex flex-wrap items-center justify-center">
                  <div className="flex space-x-6">
                    <a
                      href="https://www.linkedin.com/in/qizhen-song-b30993341/"
                      target="_blank"
                      rel="noreferrer"
                      className="text-gray-400 hover:text-primary-500 dark:text-gray-500 dark:hover:text-magenta-400 transition-colors duration-200"
                    >
                      <i className="fab fa-linkedin text-2xl" />
                    </a>
                    <a
                      href="https://github.com/RobinSongDesign"
                      target="_blank"
                      rel="noreferrer"
                      className="text-gray-400 hover:text-primary-500 dark:text-gray-500 dark:hover:text-magenta-400 transition-colors duration-200"
                    >
                      <i className="fab fa-github text-2xl" />
                    </a>
                    <button
                      onClick={openWeChat}
                      className="text-gray-400 hover:text-primary-500 dark:text-gray-500 dark:hover:text-magenta-400 transition-colors duration-200"
                    >
                      <i className="fab fa-weixin text-2xl" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  )
}

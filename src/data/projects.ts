export interface ProjectSummary {
  slug: string
  title: string
  subtitle: string
  category: 'code' | 'design'
  thumbnail: string
}

export const codeProjects: ProjectSummary[] = [
  {
    slug: 'stable-shape',
    title: 'StableShape',
    subtitle: 'Morphology Generation Grasshopper Plugin Based on Computational Fluid Dynamics',
    category: 'code',
    thumbnail: 'https://pic1.imgdb.cn/item/697161251404c8e205f11a5e.jpg',
  },
  {
    slug: 'seg-predict',
    title: 'Seg & Predict',
    subtitle: 'Integrating Image Segmentation and Machine Learning in London',
    category: 'code',
    thumbnail: 'https://pic1.imgdb.cn/item/697160a71404c8e205f11a33.None',
  },
  {
    slug: 'building-generator',
    title: 'RL-BuildingGenerator',
    subtitle: 'Agent-based Reinforcement Learning to Increase Housing Density in London',
    category: 'code',
    thumbnail: 'https://pic1.imgdb.cn/item/6971607d1404c8e205f11a24.None',
  },
]

export const designProjects: ProjectSummary[] = [
  {
    slug: 'probability',
    title: 'Probability',
    subtitle: 'Collective housing generated using Wave Function Collapse algorithm',
    category: 'design',
    thumbnail: '/images/project/pc/5 (1).png',
  },
  {
    slug: 'still',
    title: 'Still',
    subtitle: "Climber's shelter design on the top of the Polish mountain",
    category: 'design',
    thumbnail: 'https://pic1.imgdb.cn/item/6971603d1404c8e205f11a1f.None',
  },
  {
    slug: 'yokai-hall',
    title: 'Yokai Hall',
    subtitle: 'Exhibition hall of traditional Japanese Yokai culture',
    category: 'design',
    thumbnail: 'https://pic1.imgdb.cn/item/697160cc1404c8e205f11a46.None',
  },
]

export const allProjects = [...codeProjects, ...designProjects]

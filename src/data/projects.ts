import type { ImageMetadata } from 'astro';
import probabilityCover from '../assets/projects/probability/cover.png';
import formForceCover from '../assets/projects/form-force/cover.png';
import { imgdb as img } from './imgdb';

/** A remote URL (images hosted on imgdb) or a local asset that Astro optimizes. */
export type ImageSource = string | ImageMetadata;

export type Category = 'Research & Development' | 'Design';

export interface ProjectLink {
  label: string;
  href: string;
  kind: 'github' | 'download' | 'paper' | 'demo';
}

export interface Fact {
  label: string;
  value: string;
}

export interface Project {
  id: string;
  /** Kept identical to the old hand-written site so existing links keep working. */
  href: string;
  category: Category;
  title: string;
  /** Headline under the title on the project page. */
  subtitle: string;
  /** One line for the index card. */
  summary: string;
  /** Index card image. */
  cover: ImageSource;
  /** Project page lead image, when it differs from the card. */
  hero?: ImageSource;
  /** The "title block" printed under each project heading. */
  facts: Fact[];
  links?: ProjectLink[];
}

/** Order here is the order on the index and in the previous / next pager. */
export const projects: Project[] = [
  {
    id: 'stableshape',
    href: '/projects/code/StableShape.html',
    category: 'Research & Development',
    title: 'StableShape',
    subtitle: 'A morphology-generation plugin for Grasshopper, driven by computational fluid dynamics.',
    summary: 'Morphology-generation Grasshopper plugin based on computational fluid dynamics.',
    cover: img('697161251404c8e205f11a5e', 'jpg'),
    facts: [
      { label: 'Type', value: 'Grasshopper plugin' },
      { label: 'Language', value: 'C#' },
      { label: 'Method', value: 'Stable Fluids (Jos Stam) · particle-spring mesh' },
      { label: 'Release', value: 'v0.9' },
    ],
    links: [
      { label: 'Source', href: 'https://github.com/RobinSongDesign/StableShape', kind: 'github' },
      { label: 'Download v0.9', href: '/files/StableShape%20v0.9.zip', kind: 'download' },
    ],
  },
  {
    id: 'seg-predict',
    href: '/projects/code/Seg.html',
    category: 'Research & Development',
    title: 'Seg & Predict',
    subtitle: 'Optimizing urban perception — integrating image segmentation and machine learning in London.',
    summary: 'Integrating image segmentation and machine learning in London.',
    cover: img('697160a71404c8e205f11a33'),
    facts: [
      { label: 'Type', value: 'Research' },
      { label: 'Team', value: 'Wenshuo Zhang, Lewen Zhang, Robin Song' },
      { label: 'Models', value: 'PSPNet · Random Forest · XGBoost · SAC' },
      { label: 'Platform', value: 'Flask + React' },
    ],
    links: [
      { label: 'Source', href: 'https://github.com/RobinSongDesign/Seg-and-Predict', kind: 'github' },
      { label: 'Live demo', href: 'http://seg.robinsong.top', kind: 'demo' },
      {
        label: 'Paper',
        href: '/files/1.Report_Optimizing%20Urban%20Perception%20Integrating%20Image%20Segmentation_Wenshuo%20Zhang_Lewen%20Zhang_Robin%20Song.pdf',
        kind: 'paper',
      },
    ],
  },
  {
    id: 'rl-building-generator',
    href: '/projects/code/BuildingGenerator.html',
    category: 'Research & Development',
    title: 'RL-Building Generator',
    subtitle: 'Agent-based reinforcement learning to increase housing density in London.',
    summary: 'Agent-based reinforcement learning to increase housing density in London.',
    cover: img('6971607d1404c8e205f11a24'),
    facts: [
      { label: 'Type', value: 'Research' },
      { label: 'Site', value: 'Waltham Forest, London' },
      { label: 'Method', value: 'Multi-agent reinforcement learning (SAC)' },
      { label: 'Training', value: '120,000 steps per run' },
    ],
    links: [
      { label: 'Source', href: 'https://github.com/RobinSongDesign/RL-CityDensifier', kind: 'github' },
      { label: 'Paper', href: '/files/AC_DigitalStudio_WrittenReport_03-27.pdf', kind: 'paper' },
    ],
  },
  {
    id: 'probability',
    href: '/projects/design/probability.html',
    category: 'Design',
    title: 'Probability',
    subtitle: 'A collective residential building generated with the Wave Function Collapse algorithm.',
    summary: 'Collective housing generated using the Wave Function Collapse algorithm.',
    cover: probabilityCover,
    hero: img('697160631404c8e205f11a21'),
    facts: [
      { label: 'Type', value: 'Collective housing' },
      { label: 'Method', value: 'Wave Function Collapse' },
      { label: 'Modules', value: 'Residential · connection · connectors' },
    ],
  },
  {
    id: 'still',
    href: '/projects/design/still.html',
    category: 'Design',
    title: 'Still',
    subtitle: 'A climbers’ shelter on the summit of Jezowa Woda, Poland.',
    summary: 'Climbers’ shelter on top of a Polish mountain.',
    cover: img('6971603d1404c8e205f11a1f'),
    facts: [
      { label: 'Type', value: 'Mountain shelter' },
      { label: 'Site', value: 'Jezowa Woda, Poland' },
      { label: 'Materials', value: 'Cedar · green concrete' },
      { label: 'Structure', value: 'Timber joinery' },
    ],
  },
  {
    id: 'yokai-hall',
    href: '/projects/design/yokai.html',
    category: 'Design',
    title: 'Yokai Hall',
    subtitle: 'Traditional Performing Arts Information Center, Chiyoda, Tokyo.',
    summary: 'Exhibition hall of traditional Japanese Yokai culture.',
    cover: img('697160cc1404c8e205f11a46'),
    facts: [
      { label: 'Type', value: 'Cultural center' },
      { label: 'Site', value: 'Chiyoda, Tokyo' },
      { label: 'Reference', value: 'Le Corbusier · Cubism' },
      { label: 'Materials', value: 'Brushed aluminum · light steel' },
    ],
  },
  {
    id: 'form-force',
    href: '/projects/design/form-force.html',
    category: 'Design',
    title: 'Form and Force',
    subtitle: 'Research and design based on graphic statics.',
    summary: 'Inverting form from designed force diagrams with 3D graphic statics.',
    cover: formForceCover,
    facts: [
      { label: 'Type', value: 'Office · research' },
      { label: 'Method', value: '3D graphic statics' },
      { label: 'Tools', value: 'Grasshopper · Polyframe' },
      { label: 'Renders', value: 'Stable Diffusion-assisted' },
    ],
  },
];

export const categories: { title: Category; blurb: string }[] = [
  { title: 'Research & Development', blurb: 'Tools, simulations and learning systems for design.' },
  { title: 'Design', blurb: 'Architecture — from algorithmic aggregation to built detail.' },
];

export function getProject(id: string): Project {
  const project = projects.find((p) => p.id === id);
  if (!project) throw new Error(`Unknown project "${id}"`);
  return project;
}

/** Two-digit index used across the site, e.g. "03". */
export function projectNumber(project: Project): string {
  return String(projects.indexOf(project) + 1).padStart(2, '0');
}

/** Previous / next with wrap-around, so the pager never dead-ends. */
export function getNeighbours(project: Project): { prev: Project; next: Project } {
  const i = projects.indexOf(project);
  const n = projects.length;
  return { prev: projects[(i - 1 + n) % n], next: projects[(i + 1) % n] };
}

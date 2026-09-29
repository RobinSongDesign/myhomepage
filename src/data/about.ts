import type { ImageMetadata } from 'astro';
import rhino from '../assets/tools/rhinoceros.svg';
import grasshopper from '../assets/tools/grasshopper.svg';
import houdini from '../assets/tools/apps-houdini.svg';
import csharp from '../assets/tools/csharp.svg';
import python from '../assets/tools/python.svg';
import unity from '../assets/tools/unity.svg';
import unreal from '../assets/tools/unreal-engine.svg';

export interface Entry {
  /** Omit when unknown — the row simply shows no date. */
  when?: string;
  title: string;
  org: string;
  place?: string;
  points?: string[];
}

export const education: Entry[] = [
  {
    when: 'Sep 2024 – Sep 2025',
    title: 'MSc Architectural Computation',
    org: 'University College London, Bartlett School of Architecture',
    place: 'London',
  },
  {
    when: 'Sep 2019 – Jun 2023',
    title: 'Bachelor of Landscape Architecture',
    org: 'Beijing Forestry University',
    place: 'Beijing',
  },
];

export const experience: Entry[] = [
  {
    when: 'Current',
    title: 'Design System Analyst',
    org: 'Foster + Partners',
    place: 'London',
  },
  {
    title: 'AI Product Manager',
    org: 'ByteDance',
  },
  {
    when: 'Mar 2024 – Jul 2024',
    title: 'Intern Architect',
    org: 'dEEP Architects',
    place: 'Beijing',
    points: [
      'Architectural design for the Huairou Villa project: floor plan development and elevation and section design.',
      'Parametric optimization and facade development for a high-rise office complex in Dingzhou, Hebei.',
    ],
  },
  {
    when: 'Jul 2020 – Sep 2020',
    title: 'Intern Landscape Architect',
    org: 'Meidao Landscape Architecture & Urban Planning Design Institute',
    place: 'Shenzhen',
    points: [
      'Planning and design development of the Shenzhen Orchidaceae Center.',
      'Used computer-vision semantic segmentation to identify building outlines on site, speeding up design work.',
      'Research and writing for a published paper on prefabricated construction in landscape architecture.',
    ],
  },
];

export const recognition: Entry[] = [
  {
    when: 'Jul 2024',
    title: 'Research group member, Tectonism via AI',
    org: 'Zaha Hadid Architects · Tongji University Digital Futures Workshop',
    place: 'Shanghai',
  },
  {
    when: 'Jun 2023',
    title: 'Outstanding Joint Graduation Design Award',
    org: 'Beijing Forestry University',
  },
  {
    when: '2020 – 2021',
    title: 'Outstanding Student Cadre',
    org: 'Beijing Forestry University',
  },
];

export interface Tool {
  name: string;
  note: string;
  /** Logo from src/assets/tools, or a two-letter monogram when there is none. */
  logo?: ImageMetadata;
  mono?: string;
}

export const toolkit: { group: string; tools: Tool[] }[] = [
  {
    group: 'Computational design',
    tools: [
      { name: 'Rhino & Grasshopper', note: 'Parametric design and algorithmic modeling for complex geometry and form analysis.', logo: rhino },
      { name: 'Plugin development', note: 'Custom Rhino and Grasshopper components that extend design software.', logo: grasshopper },
      { name: 'Houdini', note: 'Procedural 3D modeling.', logo: houdini },
      { name: 'Revit', note: 'Building information modeling (BIM).', mono: 'Rv' },
    ],
  },
  {
    group: 'Code',
    tools: [
      { name: 'C#', note: 'Core language for Rhino and Grasshopper plugins, design tools and automation.', logo: csharp },
      { name: 'Python', note: 'Machine learning and automated processes.', logo: python },
      { name: 'HTML, CSS & JavaScript', note: 'Interactive web platforms, front to back.', mono: 'JS' },
    ],
  },
  {
    group: 'Real-time & visualization',
    tools: [
      { name: 'Unity', note: 'Interactive 3D experiences and visualization.', logo: unity },
      { name: 'Unreal Engine', note: 'High-quality rendering and real-time interaction.', logo: unreal },
      { name: 'Photoshop & Illustrator', note: 'Image editing and diagram making.', mono: 'Ps' },
    ],
  },
];

export const languages = ['Mandarin Chinese (native)', 'English (fluent)', 'Japanese (fluent, JLPT N2)'];

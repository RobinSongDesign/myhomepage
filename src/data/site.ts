/** Everything about the person behind the site, in one place. */
export const site = {
  name: 'Robin Song',
  role: 'Computational Designer & Developer',
  description:
    'Robin Song is a computational designer and developer working where architecture meets code — fluid simulation, machine learning and form-finding for design.',
  currently: 'Design System Analyst, Foster + Partners',
  studied: 'MSc Architectural Computation, UCL',
  basedIn: 'London / Shenzhen',
  email: 'songqizhen006@gmail.com',
  cv: '/files/CV_Song%20Qizhen.pdf',
  socials: {
    linkedin: 'https://www.linkedin.com/in/qizhen-song-b30993341/',
    github: 'https://github.com/RobinSongDesign',
  },
  chat: {
    // Same-origin; nginx proxies /api/ to portfolio-chat.service on the server, which
    // holds the API key and builds the system prompt from public/files/botdata.json.
    endpoint: '/api/chat',
  },
} as const;

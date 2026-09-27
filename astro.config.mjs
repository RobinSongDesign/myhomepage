// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://robinsong.top',
  build: {
    // Emit about.html, projects/code/StableShape.html … so every URL of the
    // previous hand-written site keeps working on a plain static server.
    format: 'file',
  },
  devToolbar: { enabled: false },
});

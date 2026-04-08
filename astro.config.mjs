import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://order-pilot.ai',
  output: 'static',
  adapter: vercel(),
  integrations: [
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});

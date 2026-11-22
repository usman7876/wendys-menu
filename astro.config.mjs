import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Static site — no server, no database. Deploy the `dist/` folder
// to Vercel, Netlify, Cloudflare Pages, or any static host.
export default defineConfig({
  site: 'https://wendys-menu-eight.vercel.app',
  integrations: [sitemap()],
});

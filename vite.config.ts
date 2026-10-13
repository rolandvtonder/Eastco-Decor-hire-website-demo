import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {fileURLToPath} from 'node:url';
import {defineConfig} from 'vite';

/**
 * A real multi-page site: every page is its own HTML file with its own title,
 * description and share card, so it works on any static host (cPanel, Netlify,
 * Vercel…) without rewrite rules. The folder names keep the old site's URLs
 * (/catalogue, /gallery, /contact-us…) alive so existing links and Google
 * results don't break.
 */
const pages = {
  home: 'index.html',
  catalogue: 'catalogue/index.html',
  gallery: 'gallery/index.html',
  about: 'about/index.html',
  contact: 'contact-us/index.html',
  terms: 'terms/index.html',
  privacy: 'privacy/index.html',
  notFound: '404.html',
};

const root = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  // '/' for the real domain; the GitHub Pages demo builds with
  // BASE_PATH=/Eastco-Decor-hire-website-demo/ (see .github/workflows).
  base: process.env.BASE_PATH || '/',
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2020',
    rollupOptions: {
      input: Object.fromEntries(Object.entries(pages).map(([name, file]) => [name, root + file])),
    },
  },
});

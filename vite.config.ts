import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      // Use the manifest we define here; don't inject an extra link tag
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: {
        name: 'Grimoire Forge - Visual TTRPG Document Creator',
        short_name: 'Grimoire Forge',
        description:
          'Create homebrew documents for D&D, Pathfinder, Vampire, Call of Cthulhu and more with a visual editor. No Markdown needed!',
        start_url: '/',
        display: 'standalone',
        background_color: '#1a1a2e',
        theme_color: '#7c3aed',
        orientation: 'any',
        lang: 'it',
        categories: ['games', 'productivity', 'utilities'],
        icons: [
          { src: '/icons/icon-72x72.png', sizes: '72x72', type: 'image/png' },
          { src: '/icons/icon-96x96.png', sizes: '96x96', type: 'image/png' },
          { src: '/icons/icon-128x128.png', sizes: '128x128', type: 'image/png' },
          { src: '/icons/icon-144x144.png', sizes: '144x144', type: 'image/png' },
          { src: '/icons/icon-152x152.png', sizes: '152x152', type: 'image/png' },
          { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-384x384.png', sizes: '384x384', type: 'image/png' },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        shortcuts: [
          {
            name: 'Nuovo documento',
            url: '/?action=new',
            icons: [{ src: '/icons/icon-96x96.png', sizes: '96x96' }],
          },
          {
            name: 'I miei documenti',
            url: '/?action=list',
            icons: [{ src: '/icons/icon-96x96.png', sizes: '96x96' }],
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com/,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts-stylesheets' },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          {
            urlPattern: /\/presets\/.*\.json$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'presets',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 7 },
            },
          },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
  resolve: {
    alias: { '@': '/src' },
  },
});

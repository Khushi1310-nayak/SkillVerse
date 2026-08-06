import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: [
          'skillverse-logo.png',
          'icons/apple-touch-icon.png',
        ],
        manifest: {
          name: 'SkillVerse - Master the Future',
          short_name: 'SkillVerse',
          description: 'Learn programming, DSA, and design with AI-powered courses, quizzes, and career prep.',
          theme_color: '#6968A6',
          background_color: '#0B1220',
          display: 'standalone',
          orientation: 'portrait',
          start_url: '/',
          scope: '/',
          icons: [
            { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
            { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
            { src: '/icons/icon-maskable-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
            { src: '/icons/icon-maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          ],
        },
        workbox: {
          // HashRouter SPA: always fall back to the shell so offline
          // navigation to any #/route still loads the app.
          navigateFallback: '/index.html',
          globPatterns: [
            '**/*.{js,css,html,json,svg,png,jpg,jpeg,woff2}'
          ],
          runtimeCaching: [
            {
              // Static images (course thumbnails, avatars, etc.)
              urlPattern: ({ request }) => request.destination === 'image',
              handler: 'CacheFirst',
              options: {
                cacheName: 'images-cache',
                expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 },
              },
            },
            {
              // Google Fonts / other cross-origin static assets
              urlPattern: ({ url }) => url.origin !== self.location.origin,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'external-assets-cache',
                expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 7 },
              },
            },
            {
              urlPattern: ({ url }) =>
                url.pathname.startsWith('/locales/') &&
                url.pathname.endsWith('.json'),
              handler: 'CacheFirst',
              options: {
                cacheName: 'translation-cache',
                expiration: {
                  maxEntries: 20,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
              },
            },
            {
              // Firestore/Firebase API calls: prefer network, fall back
              // to cache so previously-viewed course data still renders offline.
              urlPattern: ({ url }) => url.hostname.includes('firestore.googleapis.com'),
              handler: 'NetworkFirst',
              options: {
                cacheName: 'firestore-cache',
                networkTimeoutSeconds: 5,
                expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 },
              },
            },
          ],
        },
      }),
    ],
    define: {
      'process.env.API_KEY': JSON.stringify(env.OPENROUTER_API_KEY),
      'process.env.OPENROUTER_API_KEY': JSON.stringify(env.OPENROUTER_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
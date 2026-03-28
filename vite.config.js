import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    process.env.SENTRY_AUTH_TOKEN &&
      sentryVitePlugin({
        org: process.env.SENTRY_ORG,
        project: process.env.SENTRY_PROJECT,
        authToken: process.env.SENTRY_AUTH_TOKEN,
      }),
  ].filter(Boolean),
  server: {
    allowedHosts: true,
    // Configuración para manejar rutas del SPA correctamente
    // Vite sirve index.html automáticamente para rutas que no sean archivos estáticos
    // Esta configuración asegura que funcione correctamente con React Router
    proxy: {
      '/api': {
        target: 'https://service-dev.repeat.la',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
    // Asegurar que el servidor maneje correctamente las rutas del SPA
    // Vite por defecto ya hace esto, pero esta configuración lo hace explícito
    hmr: {
      protocol: 'ws',
      host: 'localhost',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json'],
  },
  build: {
    target: 'es2020',
    sourcemap: 'hidden',
    chunkSizeWarningLimit: 500,
    // manualChunks removed: libs like Radix, recharts, and react-pdf call React
    // at module init time, causing ReferenceErrors when split into separate chunks.
    // React.lazy route splitting provides effective code splitting instead.
  },
  esbuild: {
    pure: ['console.log', 'console.warn'],
  },
  optimizeDeps: {
    include: ['@tanstack/react-query'],
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
})

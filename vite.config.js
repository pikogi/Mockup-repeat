import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: true,
    // Configuración para manejar rutas del SPA correctamente
    // Vite sirve index.html automáticamente para rutas que no sean archivos estáticos
    // Esta configuración asegura que funcione correctamente con React Router
    proxy: {
      '/api': {
        target: 'https://uvlrwbjp35.execute-api.us-east-1.amazonaws.com/dev',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    },
    // Asegurar que el servidor maneje correctamente las rutas del SPA
    // Vite por defecto ya hace esto, pero esta configuración lo hace explícito
    hmr: {
      protocol: 'ws',
      host: 'localhost'
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json']
  },
  build: {
    target: 'es2020',
    sourcemap: 'hidden',
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;

          // React + UI libs in same chunk (Radix uses React.forwardRef at init time)
          if (id.includes('react-dom') || id.includes('react-router-dom') || id.includes('/react/') ||
              id.includes('@radix-ui') || id.includes('lucide-react') || id.includes('/sonner/') ||
              id.includes('/vaul/') || id.includes('/cmdk/') || id.includes('embla-carousel') ||
              id.includes('class-variance-authority') || id.includes('/clsx/') ||
              id.includes('tailwind-merge') || id.includes('react-day-picker') ||
              id.includes('react-resizable-panels') || id.includes('input-otp')) {
            return 'vendor-core';
          }
          if (id.includes('@tanstack/react-query') || id.includes('/zustand/') ||
              id.includes('/zod/') || id.includes('react-hook-form') ||
              id.includes('@hookform') || id.includes('date-fns')) {
            return 'vendor-data';
          }
          if (id.includes('framer-motion')) return 'vendor-motion';
          if (id.includes('recharts')) return 'vendor-charts';
          if (id.includes('/jsqr/') || id.includes('qrcode.react')) return 'vendor-qr';
        },
      },
    },
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
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
  optimizeDeps: {
    include: ['@tanstack/react-query'],
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
}) 
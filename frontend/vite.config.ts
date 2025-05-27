import react from '@vitejs/plugin-react'
import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backendUrl = env.POCKETBASE_URL || 'http://localhost:8090'

  return {
    plugins: [react(), TanStackRouterVite()],
    build: {
      outDir: './dist',
      emptyOutDir: true,
      rollupOptions: {
        output: {
          manualChunks: {
            tanstack: [
              '@tanstack/react-query',
              '@tanstack/react-router'
            ],
            ui: [
              '@radix-ui/react-dialog',
              '@radix-ui/react-dropdown-menu',
              '@radix-ui/react-label',
              '@radix-ui/react-slot',
              'class-variance-authority',
              'clsx',
              'lucide-react'
            ]
          }
        }
      }
    },
    publicDir: './public',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    server: {
      proxy: {
        '/api': {
          target: backendUrl,
          changeOrigin: true
        }
      }
    }
  }
})

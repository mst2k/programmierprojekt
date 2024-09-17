import path from "path"
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        glpkWorker: 'src/lib/glpkWorker.js',
        glpkWorkerConverter: 'src/lib/glpkWorkerConverter.js',
        highsWorker: 'src/lib/highsWorker.js'
      }
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/hooks/**/*'],
      exclude: [
        'src/hooks/**/*.test.{js,ts,jsx,tsx}',
        'src/hooks/**/*.spec.{js,ts,jsx,tsx}',
      ],
    },
  },

  optimizeDeps: {
    exclude: ['highs.wasm'] // oder andere WASM-Dateien
  }
})

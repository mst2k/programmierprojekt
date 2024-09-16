import path from "path"
import { defineConfig } from 'vite'
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
    environment: 'jsdom',  // Stellt das DOM in den Tests zur Verfügung
  },

  optimizeDeps: {
    exclude: ['highs.wasm'] // oder andere WASM-Dateien
  }
})

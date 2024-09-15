import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/programmierprojekt",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        glpk: 'src/lib/glpk.js',
        glpkWorker: 'src/lib/glpkWorker.js',
        glpkWorkerConverter: 'src/lib/glpkWorkerConverter.js',
        highs: 'src/lib/highs.js',
        highsWorker: 'src/lib/highsWorker.js'
      }
    }
  },
  optimizeDeps: {
    exclude: ['highs.wasm'] // oder andere WASM-Dateien
  }
})

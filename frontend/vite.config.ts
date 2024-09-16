import path from "path";
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths'; // Das Plugin importieren

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths() // Das Plugin hier hinzufügen
  ],
  base: "/programmierprojekt",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Deine Alias-Konfiguration beibehalten
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

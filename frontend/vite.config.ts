import path from "path"
import { configDefaults, coverageConfigDefaults, defineConfig } from 'vitest/config';
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
    // browser: {
    //   enabled: true,
    //   name: 'chrome', // Sie können auch 'firefox' oder 'safari' verwenden
    // },
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/hooks/**/*'],
      exclude: [
        ...configDefaults.exclude,
        ...coverageConfigDefaults.exclude,
        'src/hooks/**/*.test.{js,ts,jsx,tsx}',
        'src/hooks/**/*.spec.{js,ts,jsx,tsx}',
        '**/playwright-tests/**',
        '**/playwright/**',
      ],
    },
    exclude: [
      ...configDefaults.exclude,
      'src/hooks/**/*.test.{js,ts,jsx,tsx}',
      'src/hooks/**/*.spec.{js,ts,jsx,tsx}',
      './playwright-tests/*',
    ],
  },

  optimizeDeps: {
    exclude: ['highs.wasm'] // oder andere WASM-Dateien
  }
})

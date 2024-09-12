import path from "path";
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths'; // Das Plugin importieren

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
  }
});

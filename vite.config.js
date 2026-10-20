import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Relative assets work at both a domain root and /repository-name/ on GitHub Pages.
  base: './',
});

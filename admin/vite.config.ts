import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Dedicated Vite configuration for ExamPilot Admin Portal
export default defineConfig({
  root: path.resolve(__dirname, '.'),
  publicDir: path.resolve(__dirname, '../public'),
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src'),
      '@admin': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3001,
    open: false,
    proxy: {
      '/api/ollama': {
        target: 'http://127.0.0.1:11434',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ollama/, ''),
      },
    },
  },
  build: {
    outDir: path.resolve(__dirname, '../dist-admin'),
    emptyOutDir: true,
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion')) return 'admin-motion';
            if (id.includes('lucide-react')) return 'admin-icons';
            return 'admin-vendor';
          }
          if (id.includes('src/data/civilQuestions') || id.includes('src/data/generalStudies')) {
            return 'admin-data-questions';
          }
        },
      },
    },
  },
});

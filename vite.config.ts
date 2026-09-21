// cache-bust: force Vercel rebuild — offline fallback must be included
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
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
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('firebase')) return 'firebase';
            if (id.includes('framer-motion')) return 'motion';
            if (id.includes('lucide-react')) return 'icons';
            if (id.includes('canvas-confetti')) return 'confetti';
            return 'vendor';
          }
          if (id.includes('src/data/civilQuestions') || id.includes('src/data/generalStudies')) return 'data-questions';
          if (id.includes('src/data/topicKnowledge') || id.includes('src/data/foundation') || id.includes('src/data/infrastructure')) return 'data-knowledge';
          if (id.includes('src/services/geminiService') || id.includes('src/services/mcqFactory')) return 'factory';
          if (id.includes('src/pages/MockTestPage') || id.includes('src/pages/McqPractice')) return 'practice';
          if (id.includes('src/pages/SyllabusExplorer') || id.includes('src/pages/Knowledge')) return 'syllabus';
        },
      },
    },
  },
});

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Aliases to simplify imports
      '@': '/src',
    },
  },
  optimizeDeps: {
    include: [
      'firebase/compat/app',
      'firebase/compat/auth',
      'firebase/compat/firestore',
      'firebase/compat/storage',
    ],
  },
  build: {
    rollupOptions: {
      external: ['firebase/compat/app','firebase/compat/storage'],
    },
  },
});


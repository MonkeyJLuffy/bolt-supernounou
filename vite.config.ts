import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    strictPort: true,
    hmr: {
      port: 5173
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: ['lucide-react'],
    exclude: ['pg', 'bcrypt']
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
      exclude: ['pg', 'bcrypt']
    }
  }
});

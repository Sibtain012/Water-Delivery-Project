import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    include: ['lucide-react'],
  },
  base: '/', // Ensure base path is correct for ngrok
  publicDir: 'public', // Ensure public directory is correctly specified
  server: {
    host: '0.0.0.0', // Allow access from any IP (needed for ngrok)
    port: 5173,
    strictPort: true,
    allowedHosts: true, // Allow all hosts (needed for ngrok)
    cors: true, // Enable CORS for ngrok
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    },
    hmr: process.env.DISABLE_HMR === 'true' ? false : {
      port: 5173,
      host: 'localhost', // Force HMR to use localhost when enabled
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          icons: ['lucide-react', 'react-icons'],
        },
      },
    },
  },
});

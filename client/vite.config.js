import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Vite configuration. This proxy sends any unknown request starting with
// /api to the API server defined in the environment. During development
// this allows the React dev server to avoid CORS issues.
export default defineConfig(({ mode }) => {
  // Load environment variables from .env files
  const env = loadEnv(mode, process.cwd(), '');
  const apiBase = env.VITE_API_BASE_URL || 'http://localhost:3001';
  return {
    plugins: [react()],
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: apiBase,
          changeOrigin: true,
          secure: false
        }
      }
    }
  };
});
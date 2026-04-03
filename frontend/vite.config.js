import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // proxy нужен только для локальной разработки (npm run dev)
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
      '/covers': 'http://localhost:5000',
      '/music': 'http://localhost:5000',
    },
  },
});

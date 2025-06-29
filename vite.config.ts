import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    proxy: {
      '/api/jable': {
        target: 'https://jable.tv',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/jable/, ''),
      },
      '/proxy/hls': {
        target: 'https://akuma-trstin.mushroomtrack.com/hls',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/proxy\/hls/, ''),
      },
    },
  },
});

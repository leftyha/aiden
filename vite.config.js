import { defineConfig } from 'vite';

export default defineConfig({
  publicDir: 'imagenes',
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: false,
    cors: true,
    allowedHosts: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    strictPort: false,
    cors: true,
    allowedHosts: true,
  },
  build: {
    assetsDir: 'assets',
  },
});

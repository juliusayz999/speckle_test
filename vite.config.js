import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  base: '/speckle_test/', // ✅ Matches your actual GitHub repo name
  plugins: [solidPlugin()],
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist', // ✅ Ensures Vite outputs files in the right directory
    assetsDir: 'assets', // ✅ Ensures assets (JS, CSS) are correctly placed
    emptyOutDir: true, // ✅ Clears old files before building
    target: 'esnext',
  },
});

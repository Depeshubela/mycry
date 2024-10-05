import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from 'tailwindcss';

export default defineConfig({
  plugins: [react()],
  root: '.',
  // base:'/',
  server: {
    // host:'frontend',
    host:'0.0.0.0',
    port: 5173,
    // strictPort: true,
    hmr:false
    // hmr: {
      // protocol: 'ws',
      // host: "localhost",
      // port:80,
      // path:'ws',
      // clientPort: 5173
    // },
    // watch: {
    //   usePolling: false 
    // },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        entryFileNames: '[name]_[hash].js',
      },
    //   input: {
    //     main:('./index_vite.html'),
    //   },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  css: {
    modules: {
      generateScopedName: '[hash:base64:6]',
    },
    postcss: {
        plugins: [tailwindcss()],
      },
  },
});

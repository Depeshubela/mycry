import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from 'tailwindcss';

export default defineConfig({
  plugins: [react()],
  root: '.', //包含index.html的目錄
  server: {
    host:'0.0.0.0',
    port: 5173,
    hmr:false //生產環境把熱替換關掉
    // hmr: {
    //   host: "localhost",
    // }
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        entryFileNames: '[name]_[hash].js',
      },
    },
  },
  resolve: {
    //路徑名稱用@替代並省略副檔名
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

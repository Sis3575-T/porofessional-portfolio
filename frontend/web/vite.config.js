import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiUrl = env.VITE_API_URL || 'http://localhost:10000';

  return {
    plugins: [
      react(),
    ],
    server: {
      port: 5175,
      host: '0.0.0.0',
      proxy: {
        '/uploads': {
          target: apiUrl,
          changeOrigin: true,
        },
      },
    },
    build: {
      target: 'es2020',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log'],
        },
        mangle: {
          safari10: true,
        },
        format: {
          comments: false,
        },
      },
      cssMinify: 'lightningcss',
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            'three': ['three'],
            'react-three': ['@react-three/fiber', '@react-three/drei'],
            'framer': ['framer-motion'],
            'vendor-utils': ['axios', 'lucide-react', 'react-hot-toast'],
          },
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        },
      },
      chunkSizeWarningLimit: 1000,
      sourcemap: false,
      reportCompressedSize: true,
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom', 'axios', 'react-reconciler', 'react-reconciler/constants'],
    },
  };
});

import {defineConfig} from 'vite';
import {hydrogen} from '@shopify/hydrogen/vite';
import {oxygen} from '@shopify/mini-oxygen/vite';
import {vitePlugin as remix} from '@remix-run/dev';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';

declare module '@remix-run/server-runtime' {
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig({
  plugins: [
    tailwindcss(),
    hydrogen(),
    oxygen(),
    remix({
      presets: [hydrogen.v3preset()],
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_lazyRouteDiscovery: true,
        v3_routeConfig: true,
        v3_singleFetch: true,
      },
    }),
    tsconfigPaths(),
  ],
  build: {
    
    assetsInlineLimit: 0,
    
    cssCodeSplit: true,
    
    modulePreload: {
      polyfill: false
    },
    
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.info', 'console.debug', 'console.warn']
      }
    },
    
    chunkSizeWarningLimit: 1000
  },
  ssr: {
    optimizeDeps: {
      include: [],
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://bellodiamonds.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api/unstable'),
      },
    },
  host: '0.0.0.0', 
  allowedHosts: ['.ngrok-free.app', 'localhost'], 
  hmr: {
    timeout: 30000, 
  },
  warmup: {
    clientFiles: [
      './app/entry.client.tsx',
      './app/root.tsx',
      './app/routes/**/*'
    ]
  }
}
  
  
});
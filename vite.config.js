import path from 'path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: `/d3js_Practice/`,
  server: {
    host: '0.0.0.0',
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // additionalData: `
        //   @import "./src/scss/helpers/_variable.scss";
        //   @import "./src/scss/helpers/_viewport.scss";
        //   @import "./src/scss/components/button.scss";
        // `,
      },
    },
  },
})

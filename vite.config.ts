import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'
import { viteMockServe } from 'vite-plugin-mock'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    vue(),
    visualizer({ open: command === 'serve' }),
    viteMockServe({
      mockPath: 'mock',
      // enable: command === 'serve',
      enable: true,
    }),
  ],
  test: {
    environment: 'jsdom',
    coverage: { provider: 'v8' },
  },
  server: {
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:3000',
    //     changeOrigin: true,
    //   },
    // },
  },
}))

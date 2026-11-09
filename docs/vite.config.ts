import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

/**
 * 文档站点：开发模式直接引用组件库源码（热更新），
 * 主题系统同样来自源码，便于演示运行时换肤
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'sofa-ui': fileURLToPath(new URL('../src/index.ts', import.meta.url)),
      '@sofa/styles': fileURLToPath(new URL('../src/styles', import.meta.url)),
      '@': fileURLToPath(new URL('../src', import.meta.url))
    }
  },
  server: {
    port: 5173,
    open: true
  }
})
import { defineConfig } from 'tsup'

/**
 * 库构建配置：
 * - 同时输出 ESM / CJS / 全局 UMD 产物与类型声明
 * - CSS 命中 sideEffects，由 scripts/copy-css.mjs 负责拷贝到 dist
 */
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs', 'iife'],
  globalName: 'SofaUI',
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: false,
  external: ['react', 'react-dom'],
  legacyOutput: false
})
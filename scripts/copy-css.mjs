import { writeFileSync, mkdirSync, cpSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * 构建脚本：生成静态主题 CSS 并拷贝组件样式到 dist
 * 说明：tokens 以「变量 + color-mix 派生」方式输出，
 * 用户仅需覆盖 --sofa-color-primary 即可全局联动全部衍生色
 */

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const root = join(__dirname, '..')
const srcStyles = join(root, 'src', 'styles')
const dist = join(root, 'dist')
mkdirSync(dist, { recursive: true })

/* ===== 颜色算法（与 src/theme/color.ts 保持一致的等价实现） ===== */

function hexToRgb(hex) {
  let value = hex.replace('#', '').trim()
  if (value.length === 3) {
    value = value.split('').map((c) => c + c).join('')
  }
  const num = parseInt(value, 16)
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 }
}

function rgbToHsl({ r, g, b }) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min
  let h = 0
  let s = 0
  const l = (max + min) / 2
  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1))
    switch (max) {
      case r: h = ((g - b) / delta + (g < b ? 6 : 0)) * 60; break
      case g: h = ((b - r) / delta + 2) * 60; break
      default: h = ((r - g) / delta + 4) * 60
    }
  }
  return { h, s, l }
}

function hslToRgb({ h, s, l }) {
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2
  let r = 0, g = 0, b = 0
  if (h < 60) [r, g, b] = [c, x, 0]
  else if (h < 120) [r, g, b] = [x, c, 0]
  else if (h < 180) [r, g, b] = [0, c, x]
  else if (h < 240) [r, g, b] = [0, x, c]
  else if (h < 300) [r, g, b] = [x, 0, c]
  else [r, g, b] = [c, 0, x]
  return { r: (r + m) * 255, g: (g + m) * 255, b: (b + m) * 255 }
}

function rgbToHex({ r, g, b }) {
  const to = (n) => Math.round(n).toString(16).padStart(2, '0')
  return `#${to(r)}${to(g)}${to(b)}`
}

/** 生成 10 级色阶（1 最浅 → 10 最深） */
function generateColorPalette(color) {
  const base = rgbToHsl(hexToRgb(color))
  const lightSteps = [0.42, 0.33, 0.255, 0.175, 0.095, 0]
  const satDecay = [0.38, 0.3, 0.22, 0.14, 0.07, 0]
  const darkSteps = [0.06, 0.09, 0.145, 0.19]
  const satBoost = [0.05, 0.08, 0.1, 0.12]
  const build = (lightness, saturation) => {
    const l = Math.min(0.96, Math.max(0.06, lightness))
    const s = Math.min(1, Math.max(0.25, saturation))
    return rgbToHex(hslToRgb({ h: base.h, s, l }))
  }
  const palette = lightSteps.map((deltaL, i) => build(base.l + deltaL, base.s - satDecay[i]))
  darkSteps.forEach((deltaL, i) => palette.push(build(base.l - deltaL, Math.min(1, base.s + satBoost[i]))))
  return palette
}

/* ===== 默认令牌生成 ===== */

const DEFAULT_PRIMARY = '#8A2BE2'
const SEMANTIC = { success: '#52C41A', warning: '#FAAD14', error: '#F5222D', info: '#1677FF' }
const NEUTRAL = {
  textPrimary: '#1F2329', textSecondary: '#4E5969', textTertiary: '#86909C',
  textQuaternary: '#C9CDD4', border: '#E5E6EB', borderStrong: '#C9CDD4',
  fill: '#F2F3F5', fillSecondary: '#F7F8FA', bgContainer: '#FFFFFF',
  bgPage: '#F7F8FA', disabled: '#C9CDD4', placeholder: '#A9AEB8'
}

function generateThemeTokens() {
  const primary = DEFAULT_PRIMARY
  const palette = generateColorPalette(primary)
  const semanticTokens = {}
  Object.entries(SEMANTIC).forEach(([key, color]) => {
    const sub = generateColorPalette(color)
    semanticTokens[`--sofa-color-${key}`] = color
    semanticTokens[`--sofa-color-${key}-bg`] = sub[1]
    semanticTokens[`--sofa-color-${key}-border`] = sub[3]
    semanticTokens[`--sofa-color-${key}-text`] = sub[8]
    semanticTokens[`--sofa-color-${key}-hover`] = sub[4]
  })
  return {
    '--sofa-color-primary': primary,
    '--sofa-color-primary-1': palette[0],
    '--sofa-color-primary-2': palette[1],
    '--sofa-color-primary-3': palette[2],
    '--sofa-color-primary-4': palette[3],
    '--sofa-color-primary-5': palette[4],
    '--sofa-color-primary-6': palette[5],
    '--sofa-color-primary-7': palette[6],
    '--sofa-color-primary-8': palette[7],
    '--sofa-color-primary-9': palette[8],
    '--sofa-color-primary-10': palette[9],
    '--sofa-color-primary-hover': palette[3],
    '--sofa-color-primary-active': palette[6],
    '--sofa-color-primary-bg': `color-mix(in srgb, ${primary} 10%, transparent)`,
    '--sofa-color-primary-border': `color-mix(in srgb, ${primary} 50%, transparent)`,
    ...semanticTokens,
    '--sofa-text-primary': NEUTRAL.textPrimary,
    '--sofa-text-secondary': NEUTRAL.textSecondary,
    '--sofa-text-tertiary': NEUTRAL.textTertiary,
    '--sofa-text-quaternary': NEUTRAL.textQuaternary,
    '--sofa-border-color': NEUTRAL.border,
    '--sofa-border-color-strong': NEUTRAL.borderStrong,
    '--sofa-fill-color': NEUTRAL.fill,
    '--sofa-fill-color-secondary': NEUTRAL.fillSecondary,
    '--sofa-bg-container': NEUTRAL.bgContainer,
    '--sofa-bg-page': NEUTRAL.bgPage,
    '--sofa-disabled-color': NEUTRAL.disabled,
    '--sofa-placeholder-color': NEUTRAL.placeholder,
    '--sofa-font-family':
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif",
    '--sofa-font-size-xs': '12px',
    '--sofa-font-size-sm': '14px',
    '--sofa-font-size-md': '16px',
    '--sofa-font-size-lg': '20px',
    '--sofa-radius-xs': '4px',
    '--sofa-radius-sm': '6px',
    '--sofa-radius-md': '10px',
    '--sofa-radius-lg': '16px',
    '--sofa-radius-full': '999px',
    '--sofa-shadow-sm': '0 1px 2px rgba(0, 0, 0, 0.04), 0 2px 8px rgba(0, 0, 0, 0.06)',
    '--sofa-shadow-md': '0 4px 12px rgba(0, 0, 0, 0.08), 0 8px 24px rgba(0, 0, 0, 0.06)',
    '--sofa-shadow-lg': '0 8px 24px rgba(0, 0, 0, 0.10), 0 16px 48px rgba(0, 0, 0, 0.08)',
    '--sofa-transition': 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    '--sofa-motion-ease': 'cubic-bezier(0.4, 0, 0.2, 1)',
    '--sofa-zindex-modal': '1000',
    '--sofa-zindex-message': '1100',
    '--sofa-zindex-popover': '900'
  }
}

/** 生成 :root 下的全部默认令牌 */
function buildTokenCss() {
  const tokens = generateThemeTokens()
  const lines = Object.entries(tokens)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n')
  return `:root {\n${lines}\n}\n`
}

/** 按源码入口顺序合并组件样式，保留相同的层叠顺序。 */
function buildStylesCss() {
  const entry = readFileSync(join(srcStyles, 'index.css'), 'utf-8')
  return Array.from(entry.matchAll(/@import '\.\/([^']+\.css)';/g), ([, file]) => {
    return `/* ===== ${file} ===== */\n${readFileSync(join(srcStyles, file), 'utf-8')}`
  }).join('\n\n')
}

// 写入 theme.css（默认令牌组）
writeFileSync(join(dist, 'theme.css'), buildTokenCss())
// 暗色变量组
writeFileSync(join(dist, 'dark.css'), readFileSync(join(srcStyles, 'dark.css'), 'utf-8'))
// 全量样式
writeFileSync(join(dist, 'styles.css'), buildStylesCss())

// 拷贝组件样式到 dist/css 供按需引入
mkdirSync(join(dist, 'css'), { recursive: true })
cpSync(srcStyles, join(dist, 'css'), { recursive: true })

console.log('✓ 已生成 dist/theme.css、dist/dark.css、dist/styles.css、dist/css/')
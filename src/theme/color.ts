/**
 * 颜色工具集：色值转换、混合、色阶生成
 * 采用「向白/向黑明度推移 + 饱和度渐变」的色板生成思路，
 * 保证任意主色都能得到视觉均匀的 10 级色阶。
 */

export interface RGB {
  r: number
  g: number
  b: number
}

export interface HSL {
  h: number
  s: number
  l: number
}

/** 将十六进制色值（支持 #rgb / #rrggbb）转换为 RGB */
export function hexToRgb(hex: string): RGB {
  let value = hex.replace('#', '').trim()
  if (value.length === 3) {
    value = value
      .split('')
      .map((c) => c + c)
      .join('')
  }
  if (!/^[0-9a-fA-F]{6}$/.test(value)) {
    throw new Error(`非法的十六进制颜色: ${hex}`)
  }
  const num = parseInt(value, 16)
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 }
}

/** RGB 转十六进制 */
export function rgbToHex({ r, g, b }: RGB): string {
  const to = (n: number) => Math.round(n).toString(16).padStart(2, '0')
  return `#${to(r)}${to(g)}${to(b)}`
}

/** RGB 转 HSL */
export function rgbToHsl({ r, g, b }: RGB): HSL {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min
  let h = 0
  let s = 0
  const l = (max + min) / 2
  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1))
    switch (max) {
      case r:
        h = ((g - b) / delta + (g < b ? 6 : 0)) * 60
        break
      case g:
        h = ((b - r) / delta + 2) * 60
        break
      default:
        h = ((r - g) / delta + 4) * 60
    }
  }
  return { h, s, l }
}

/** HSL 转 RGB（s/l 为 0~1 小数） */
export function hslToRgb({ h, s, l }: HSL): RGB {
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2
  let r = 0
  let g = 0
  let b = 0
  if (h < 60) [r, g, b] = [c, x, 0]
  else if (h < 120) [r, g, b] = [x, c, 0]
  else if (h < 180) [r, g, b] = [0, c, x]
  else if (h < 240) [r, g, b] = [0, x, c]
  else if (h < 300) [r, g, b] = [x, 0, c]
  else [r, g, b] = [c, 0, x]
  return { r: (r + m) * 255, g: (g + m) * 255, b: (b + m) * 255 }
}

/** 将颜色混合为带透明度的 rgba 字符串 */
export function toRgba(color: string, alpha: number): string {
  const { r, g, b } = hexToRgb(color)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/**
 * 混合两个颜色：weight 表示 color2 的占比（0~1）
 */
export function mix(color1: string, color2: string, weight: number): string {
  const c1 = hexToRgb(color1)
  const c2 = hexToRgb(color2)
  const t = Math.min(1, Math.max(0, weight))
  return rgbToHex({
    r: c1.r + (c2.r - c1.r) * t,
    g: c1.g + (c2.g - c1.g) * t,
    b: c1.b + (c2.b - c1.b) * t
  })
}

/** 向白色移动（变浅） */
export function lighten(color: string, ratio: number): string {
  return mix(color, '#ffffff', ratio)
}

/** 向黑色移动（变深） */
export function darken(color: string, ratio: number): string {
  return mix(color, '#000000', ratio)
}

interface PaletteOptions {
  /** 色相偏移（度），用于从主色派生语义色 */
  hueShift?: number
}

/**
 * 生成 10 级色阶（1 最浅 → 10 最深）：
 * - 1~5 号：向白推移且降饱和，用作浅背景 / 悬浮态
 * - 6 号：基准色
 * - 7~10 号：向黑推移且提饱和，用作按下态 / 强强调
 */
export function generateColorPalette(color: string, options: PaletteOptions = {}): string[] {
  const base = rgbToHsl(hexToRgb(color))
  const { hueShift = 0 } = options
  const h = (base.h + hueShift + 360) % 360
  // 向白方向的明度步进与饱和度衰减
  const lightSteps = [0.42, 0.33, 0.255, 0.175, 0.095, 0]
  const satDecay = [0.38, 0.3, 0.22, 0.14, 0.07, 0]
  // 向黑方向的明度步进与饱和度提升
  const darkSteps = [0.06, 0.09, 0.145, 0.19]
  const satBoost = [0.05, 0.08, 0.1, 0.12]

  const build = (lightness: number, saturation: number): string => {
    const l = Math.min(0.96, Math.max(0.06, lightness))
    const s = Math.min(1, Math.max(0.25, saturation))
    return rgbToHex(hslToRgb({ h, s, l }))
  }

  const palette = lightSteps.map((deltaL, i) =>
    build(base.l + deltaL, base.s - satDecay[i])
  )
  darkSteps.forEach((deltaL, i) => {
    palette.push(build(base.l - deltaL, Math.min(1, base.s + satBoost[i])))
  })
  return palette
}

/** 校验色值是否合法，非法时回退到默认色 */
export function sanitizeColor(color: string | undefined, fallback: string): string {
  if (!color) return fallback
  try {
    hexToRgb(color)
    return color
  } catch {
    return fallback
  }
}
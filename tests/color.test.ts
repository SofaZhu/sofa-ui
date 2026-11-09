import { describe, expect, it } from 'vitest'
import {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  mix,
  lighten,
  darken,
  generateColorPalette,
  sanitizeColor,
  toRgba
} from '@/theme/color'

describe('颜色转换', () => {
  it('hex 转 rgb', () => {
    expect(hexToRgb('#8A2BE2')).toEqual({ r: 138, g: 43, b: 226 })
  })

  it('支持三位缩写 hex', () => {
    expect(hexToRgb('#fff')).toEqual({ r: 255, g: 255, b: 255 })
  })

  it('rgb 转 hex 并保留精度', () => {
    expect(rgbToHex({ r: 138, g: 43, b: 226 })).toBe('#8a2be2')
  })

  it('rgb 与 hsl 互转不改变颜色', () => {
    const hsl = rgbToHsl(hexToRgb('#8A2BE2'))
    const rgb = hslToRgb(hsl)
    const back = rgbToHex(rgb)
    // 允许 1 以内舍入误差
    expect(Math.abs(parseInt(back.slice(1, 3), 16) - 138)).toBeLessThanOrEqual(1)
  })
})

describe('颜色混合', () => {
  it('mix 按权重混合', () => {
    expect(mix('#000000', '#ffffff', 0.5)).toBe('#808080')
    expect(mix('#000000', '#ffffff', 0)).toBe('#000000')
    expect(mix('#000000', '#ffffff', 1)).toBe('#ffffff')
  })

  it('lighten / darken', () => {
    expect(lighten('#000000', 0.5)).toBe('#808080')
    expect(darken('#ffffff', 0.5)).toBe('#808080')
  })

  it('toRgba', () => {
    expect(toRgba('#8A2BE2', 0.5)).toBe('rgba(138, 43, 226, 0.5)')
  })
})

describe('主色色阶生成（核心能力）', () => {
  it('生成 10 级色阶，第 6 级即主色本身', () => {
    const palette = generateColorPalette('#8A2BE2')
    expect(palette).toHaveLength(10)
    expect(palette[5].toLowerCase()).toBe('#8a2be2')
  })

  it('色阶从浅到深单调递增（按亮度）', () => {
    const palette = generateColorPalette('#8A2BE2')
    const lightness = palette.map((c) => rgbToHsl(hexToRgb(c)).l)
    for (let i = 1; i < lightness.length; i++) {
      expect(lightness[i]).toBeLessThan(lightness[i - 1])
    }
  })

  it('色阶 1 号为浅背景，10 号为深强调色', () => {
    const palette = generateColorPalette('#8A2BE2')
    expect(rgbToHsl(hexToRgb(palette[0])).l).toBeGreaterThan(0.85)
    expect(rgbToHsl(hexToRgb(palette[9])).l).toBeLessThan(0.5)
  })

  it('任意主色都能生成合法色阶（含纯黑 / 纯白边界）', () => {
    ;['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#FFA500'].forEach((c) => {
      const palette = generateColorPalette(c)
      expect(palette).toHaveLength(10)
      palette.forEach((p) => expect(p).toMatch(/^#[0-9a-f]{6}$/i))
    })
  })

  it('色相偏移可派生语义色', () => {
    const shifted = generateColorPalette('#8A2BE2', { hueShift: 100 })[5]
    const baseHue = rgbToHsl(hexToRgb('#8A2BE2')).h
    const shiftedHue = rgbToHsl(hexToRgb(shifted)).h
    // 色相环绕偏移约 100 度
    const diff = (shiftedHue - baseHue + 360) % 360
    expect(diff).toBeGreaterThan(90)
    expect(diff).toBeLessThan(110)
  })
})

describe('颜色校验', () => {
  it('非法色值回退到默认色', () => {
    expect(sanitizeColor('not-a-color', '#8A2BE2')).toBe('#8A2BE2')
    expect(sanitizeColor('#8A2BE2', '#000000')).toBe('#8A2BE2')
    expect(sanitizeColor(undefined, '#000000')).toBe('#000000')
  })
})
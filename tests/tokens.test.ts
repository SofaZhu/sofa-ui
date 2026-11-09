import { describe, expect, it } from 'vitest'
import { generateThemeTokens, DEFAULT_PRIMARY_COLOR } from '@/theme/tokens'

describe('主题令牌生成', () => {
  it('默认主色为 #8A2BE2，且存在 10 级色阶', () => {
    const tokens = generateThemeTokens()
    expect(tokens['--sofa-color-primary']).toBe(DEFAULT_PRIMARY_COLOR)
    for (let i = 1; i <= 10; i++) {
      expect(tokens[`--sofa-color-primary-${i}`]).toBeDefined()
    }
  })

  it('hover 比主色浅，active 比主色深', () => {
    const tokens = generateThemeTokens()
    expect(tokens['--sofa-color-primary-hover']).toBeDefined()
    expect(tokens['--sofa-color-primary-active']).toBeDefined()
  })

  it('覆盖主色后所有派生变量联动变化', () => {
    const tokensA = generateThemeTokens({ primaryColor: '#8A2BE2' })
    const tokensB = generateThemeTokens({ primaryColor: '#1677FF' })
    expect(tokensA['--sofa-color-primary-1']).not.toBe(tokensB['--sofa-color-primary-1'])
    expect(tokensA['--sofa-color-primary-hover']).not.toBe(tokensB['--sofa-color-primary-hover'])
    expect(tokensB['--sofa-color-primary']).toBe('#1677FF')
  })

  it('语义色可独立配置', () => {
    const tokens = generateThemeTokens({ semanticColors: { error: '#FF0000' } })
    expect(tokens['--sofa-color-error']).toBe('#FF0000')
    expect(tokens['--sofa-color-error-bg']).toBeDefined()
    expect(tokens['--sofa-color-success']).toBe('#52C41A')
  })

  it('非法主色自动回退默认', () => {
    const tokens = generateThemeTokens({ primaryColor: 'broken' as string })
    expect(tokens['--sofa-color-primary']).toBe(DEFAULT_PRIMARY_COLOR)
  })

  it('中性色可配置', () => {
    const tokens = generateThemeTokens({ neutralColors: { textPrimary: '#333' } })
    expect(tokens['--sofa-text-primary']).toBe('#333')
  })
})
describe('按钮文字颜色', () => {
  it('根据填充色亮度选择高对比度文字', () => {
    const light = generateThemeTokens({ primaryColor: '#52c41a', semanticColors: { error: '#fff' } })
    const dark = generateThemeTokens({ primaryColor: '#8a2be2', semanticColors: { error: '#000' } }, { dark: true })
    expect(light['--sofa-button-primary-text']).toBe('#000')
    expect(light['--sofa-button-danger-text']).toBe('#000')
    expect(dark['--sofa-button-primary-text']).toBe('#fff')
    expect(dark['--sofa-button-danger-text']).toBe('#fff')
  })
})

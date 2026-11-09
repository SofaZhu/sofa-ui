import {
  generateThemeTokens,
  DEFAULT_PRIMARY_COLOR,
  type ThemeTokenInput
} from './tokens'

export { generateThemeTokens } from './tokens'
export * from './color'
export type { ThemeTokenInput } from './tokens'
export { DEFAULT_PRIMARY_COLOR, DEFAULT_SEMANTIC_COLORS, DEFAULT_NEUTRAL_COLORS } from './tokens'

/**
 * 运行时主题 API：
 * - setPrimaryColor(color)：更换主色，全站色彩联动（由主色派生色阶与状态色）
 * - setDarkMode(boolean)：切换暗色模式
 * - setTheme(input)：一次性应用完整主题配置
 */

const APPLIED_TOKEN_KEYS = new Set<string>()
/** 当前生效的主题配置，暗色切换时基于它重新生成令牌 */
let currentInput: ThemeTokenInput = {}

/** 将主题令牌写入 <html> 内联样式，供运行时动态换肤 */
export function applyThemeTokens(tokens: Record<string, string>): void {
  const el = document.documentElement
  // 清除上一次运行时注入的令牌，避免残留旧值
  APPLIED_TOKEN_KEYS.forEach((key) => el.style.removeProperty(key))
  APPLIED_TOKEN_KEYS.clear()
  Object.entries(tokens).forEach(([key, value]) => {
    el.style.setProperty(key, value)
    APPLIED_TOKEN_KEYS.add(key)
  })
}

/** 设置主色：所有默认色调基于主色重新调配并注入页面 */
export function setPrimaryColor(primaryColor: string): void {
  currentInput = { ...currentInput, primaryColor }
  applyThemeTokens(generateThemeTokens(currentInput, { dark: isDarkMode() }))
}

/** 读取当前暗色模式状态 */
export function isDarkMode(): boolean {
  return document.documentElement.getAttribute('data-theme') === 'dark'
}

/** 切换暗色模式：同步切换 data-theme 属性与内联令牌（内联优先级高于 dark.css） */
export function setDarkMode(dark: boolean): void {
  if (dark) {
    document.documentElement.setAttribute('data-theme', 'dark')
  } else {
    document.documentElement.removeAttribute('data-theme')
  }
  applyThemeTokens(generateThemeTokens(currentInput, { dark }))
}

/** 切换暗色模式（布尔反转用） */
export function toggleDarkMode(): void {
  setDarkMode(!isDarkMode())
}

/** 应用完整主题配置（主色 + 语义色 + 中性色） */
export function setTheme(input: ThemeTokenInput): void {
  currentInput = input
  applyThemeTokens(generateThemeTokens(input, { dark: isDarkMode() }))
}

/** 读取当前页面生效的主题令牌（供诊断与导出使用） */
export function getAppliedTokens(): Record<string, string> {
  const style = getComputedStyle(document.documentElement)
  const tokens: Record<string, string> = {}
  Object.entries(generateThemeTokens({ primaryColor: DEFAULT_PRIMARY_COLOR })).forEach(
    ([key]) => {
      tokens[key] = style.getPropertyValue(key).trim()
    }
  )
  return tokens
}
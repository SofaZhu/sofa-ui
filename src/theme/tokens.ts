import { generateColorPalette, hexToRgb, sanitizeColor } from './color'

/**
 * 主题令牌的常量定义：
 * - 主色默认 #8A2BE2（蓝紫），所有次级色彩均由主色调配生成
 * - 语义色（成功/警告/危险/信息）默认采用国际通用语义色，均可单独配置
 * - 中性色为文字/边框/背景灰度体系
 */

export const DEFAULT_PRIMARY_COLOR = '#8A2BE2'

/** 语义色默认值（可配置） */
export const DEFAULT_SEMANTIC_COLORS = {
  success: '#52C41A',
  warning: '#FAAD14',
  error: '#F5222D',
  info: '#1677FF'
} as const

/** 中性色默认值（可配置） */
export const DEFAULT_NEUTRAL_COLORS = {
  textPrimary: '#1F2329',
  textSecondary: '#4E5969',
  textTertiary: '#86909C',
  textQuaternary: '#C9CDD4',
  border: '#E5E6EB',
  borderStrong: '#C9CDD4',
  fill: '#F2F3F5',
  fillSecondary: '#F7F8FA',
  bgContainer: '#FFFFFF',
  bgPage: '#F7F8FA',
  disabled: '#C9CDD4',
  placeholder: '#A9AEB8'
} as const

export type SemanticColorKey = keyof typeof DEFAULT_SEMANTIC_COLORS
export type NeutralColorKey = keyof typeof DEFAULT_NEUTRAL_COLORS

export interface ThemeTokenInput {
  /** 主色，其余色彩均由它调配 */
  primaryColor?: string
  /** 语义色覆盖 */
  semanticColors?: Partial<Record<SemanticColorKey, string>>
  /** 中性色覆盖 */
  neutralColors?: Partial<Record<NeutralColorKey, string>>
}

/** 按相对亮度选择对比度更高的纯黑或纯白文字。 */
function getButtonTextColor(color: string): string {
  const { r, g, b } = hexToRgb(color)
  const linearize = (channel: number) => {
    const value = channel / 255
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  }
  const luminance = 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b)
  return (luminance + 0.05) / 0.05 >= 1.05 / (luminance + 0.05) ? '#000' : '#fff'
}

/**
 * 由主色与可配置项生成完整 CSS 变量表
 *
 * 生成的变量包含：
 * - --sofa-color-primary-1 ~ 10：十级色阶
 * - --sofa-color-primary-hover / active：悬浮与按下态
 * - 语义色及其浅背景、边框、文字变体
 * - 中性色与字体、圆角、阴影等组件级令牌
 */
export function generateThemeTokens(
  input: ThemeTokenInput = {},
  options: { dark?: boolean } = {}
): Record<string, string> {
  const dark = options.dark ?? false
  const primary = sanitizeColor(input.primaryColor, DEFAULT_PRIMARY_COLOR)
  const semantic = {
    ...DEFAULT_SEMANTIC_COLORS,
    ...(input.semanticColors ?? {})
  }
  const neutral = {
    ...DEFAULT_NEUTRAL_COLORS,
    ...(input.neutralColors ?? {}),
    // 暗色模式：覆盖中性色与主色浅阶（与 dark.css 保持一致）
    ...(dark
      ? {
          textPrimary: '#E6E8EB',
          textSecondary: '#B7BCC4',
          textTertiary: '#8A919C',
          textQuaternary: '#6B7280',
          border: '#3A3F4B',
          borderStrong: '#4A5160',
          fill: '#2A2E38',
          fillSecondary: '#23262F',
          bgContainer: '#1D2028',
          bgPage: '#16181F',
          disabled: '#4A5160',
          placeholder: '#6B7280'
        }
      : {})
  }
  // 由主色生成十级色阶，hover 取 6 号（深一档），active 取 7 号（更深）
  const palette = generateColorPalette(primary)
  const semanticTokens: Record<string, string> = {}
  ;(Object.keys(semantic) as SemanticColorKey[]).forEach((key) => {
    const color = semantic[key]
    semanticTokens[`--sofa-color-${key}`] = color
    semanticTokens[`--sofa-color-${key}-bg`] = generateColorPalette(color)[1]
    semanticTokens[`--sofa-color-${key}-border`] = generateColorPalette(color)[3]
    semanticTokens[`--sofa-color-${key}-text`] = generateColorPalette(color)[8]
    semanticTokens[`--sofa-color-${key}-hover`] = generateColorPalette(color)[6]
  })

  return {
    '--sofa-color-primary': primary,
    '--sofa-button-primary-text': getButtonTextColor(primary),
    '--sofa-button-danger-text': getButtonTextColor(sanitizeColor(semantic.error, DEFAULT_SEMANTIC_COLORS.error)),
    // 浅阶色阶：暗色模式下反转（深底浅字）
    '--sofa-color-primary-1': dark ? `color-mix(in srgb, ${primary} 16%, #1D2028)` : palette[0],
    '--sofa-color-primary-2': dark ? `color-mix(in srgb, ${primary} 26%, #1D2028)` : palette[1],
    '--sofa-color-primary-3': dark ? `color-mix(in srgb, ${primary} 38%, #1D2028)` : palette[2],
    '--sofa-color-primary-4': dark ? `color-mix(in srgb, ${primary} 52%, #1D2028)` : palette[3],
    '--sofa-color-primary-5': dark ? `color-mix(in srgb, ${primary} 68%, #1D2028)` : palette[4],
    '--sofa-color-primary-6': palette[5],
    '--sofa-color-primary-7': palette[6],
    '--sofa-color-primary-8': palette[7],
    '--sofa-color-primary-9': palette[8],
    '--sofa-color-primary-10': palette[9],
    '--sofa-color-primary-hover': palette[6],
    '--sofa-color-primary-active': palette[7],
    '--sofa-color-primary-bg': `color-mix(in srgb, ${primary} 10%, transparent)`,
    '--sofa-color-primary-border': `color-mix(in srgb, ${primary} 50%, transparent)`,
    ...semanticTokens,
    '--sofa-text-primary': neutral.textPrimary,
    '--sofa-text-secondary': neutral.textSecondary,
    '--sofa-text-tertiary': neutral.textTertiary,
    '--sofa-text-quaternary': neutral.textQuaternary,
    '--sofa-border-color': neutral.border,
    '--sofa-border-color-strong': neutral.borderStrong,
    '--sofa-fill-color': neutral.fill,
    '--sofa-fill-color-secondary': neutral.fillSecondary,
    '--sofa-bg-container': neutral.bgContainer,
    '--sofa-bg-page': neutral.bgPage,
    '--sofa-disabled-color': neutral.disabled,
    '--sofa-placeholder-color': neutral.placeholder,
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
    '--sofa-shadow-sm': dark
      ? '0 1px 2px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.4)'
      : '0 1px 2px rgba(0, 0, 0, 0.04), 0 2px 8px rgba(0, 0, 0, 0.06)',
    '--sofa-shadow-md': dark
      ? '0 4px 12px rgba(0, 0, 0, 0.5), 0 8px 24px rgba(0, 0, 0, 0.4)'
      : '0 4px 12px rgba(0, 0, 0, 0.08), 0 8px 24px rgba(0, 0, 0, 0.06)',
    '--sofa-shadow-lg': dark
      ? '0 8px 24px rgba(0, 0, 0, 0.55), 0 16px 48px rgba(0, 0, 0, 0.45)'
      : '0 8px 24px rgba(0, 0, 0, 0.10), 0 16px 48px rgba(0, 0, 0, 0.08)',
    '--sofa-transition': 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    '--sofa-motion-ease': 'cubic-bezier(0.4, 0, 0.2, 1)',
    '--sofa-zindex-modal': '1000',
    '--sofa-zindex-message': '1100',
    '--sofa-zindex-popover': '900'
  }
}
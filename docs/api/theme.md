# 主题与设计令牌

[返回 API 索引](README.md) · [源码](../../src/theme)

浏览器换肤使用 setTheme、setPrimaryColor 或 setDarkMode。服务端可调用 generateThemeTokens 获取令牌对象，再在自己的渲染流程中写入样式。

## 使用示例

```tsx
import { generateThemeTokens, setTheme, setDarkMode } from 'sofa-ui'

export function Example() {
  return (
    <button onClick={() => {
      const theme = { primaryColor: '#1677FF' }
      console.log(generateThemeTokens(theme))
      setTheme(theme)
      setDarkMode(true)
    }}>应用暗色主题</button>
  )
}
```

## 运行时 API

### `setPrimaryColor`

设置主色：所有默认色调基于主色重新调配并注入页面

```ts
setPrimaryColor(primaryColor: string): void
```

### `setDarkMode`

切换暗色模式：同步切换 data-theme 属性与内联令牌（内联优先级高于 dark.css）

```ts
setDarkMode(dark: boolean): void
```

### `isDarkMode`

读取当前暗色模式状态

```ts
isDarkMode(): boolean
```

### `toggleDarkMode`

切换暗色模式（布尔反转用）

```ts
toggleDarkMode(): void
```

### `setTheme`

应用完整主题配置（主色 + 语义色 + 中性色）

```ts
setTheme(input: ThemeTokenInput): void
```

### `getAppliedTokens`

读取当前页面生效的主题令牌（供诊断与导出使用）

```ts
getAppliedTokens(): Record<string, string>
```

### `applyThemeTokens`

将主题令牌写入 <html> 内联样式，供运行时动态换肤

```ts
applyThemeTokens(tokens: Record<string, string>): void
```

### `generateThemeTokens`

由主色与可配置项生成完整 CSS 变量表 生成的变量包含： - --sofa-color-primary-1 ~ 10：十级色阶 - --sofa-color-primary-hover / active：悬浮与按下态 - 语义色及其浅背景、边框、文字变体 - 中性色与字体、圆角、阴影等组件级令牌

```ts
generateThemeTokens(input?: ThemeTokenInput, options?: { dark?: boolean; }): Record<string, string>
```

### `generateColorPalette`

生成 10 级色阶（1 最浅 → 10 最深）： - 1~5 号：向白推移且降饱和，用作浅背景 / 悬浮态 - 6 号：基准色 - 7~10 号：向黑推移且提饱和，用作按下态 / 强强调

```ts
generateColorPalette(color: string, options?: PaletteOptions): string[]
```

### `DEFAULT_PRIMARY_COLOR`

```ts
DEFAULT_PRIMARY_COLOR: "#8A2BE2"
```

### `DEFAULT_SEMANTIC_COLORS`

```ts
DEFAULT_SEMANTIC_COLORS: { readonly success: "#52C41A"; readonly warning: "#FAAD14"; readonly error: "#F5222D"; readonly info: "#1677FF"; }
```

### `DEFAULT_NEUTRAL_COLORS`

```ts
DEFAULT_NEUTRAL_COLORS: { readonly textPrimary: "#1F2329"; readonly textSecondary: "#4E5969"; readonly textTertiary: "#86909C"; readonly textQuaternary: "#C9CDD4"; readonly border: "#E5E6EB"; readonly borderStrong: "#C9CDD4"; readonly fill: "#F2F3F5"; readonly fillSecondary: "#F7F8FA"; readonly bgContainer: "#FFFFFF"; readonly bgPage: "#F7F8FA"; readonly disabled: "#C9CDD4"; readonly placeholder: "#A9AEB8"; }
```

## 公开类型

### `ThemeTokenInput`

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `primaryColor` | `string` | 否 | `'#8A2BE2'` | 主色，其余色彩均由它调配 |
| `semanticColors` | `Partial<Record<SemanticColorKey, string>>` | 否 | — | 语义色覆盖 |
| `neutralColors` | `Partial<Record<NeutralColorKey, string>>` | 否 | — | 中性色覆盖 |

### `SemanticColorKey`

```ts
type SemanticColorKey = keyof typeof DEFAULT_SEMANTIC_COLORS
```

### `NeutralColorKey`

```ts
type NeutralColorKey = keyof typeof DEFAULT_NEUTRAL_COLORS
```

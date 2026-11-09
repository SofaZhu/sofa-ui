# Icon 图标

[返回 API 索引](README.md) · [源码](../../src/components/icon)

使用 IconType 内置图标名。图标默认对辅助技术隐藏，纯图标按钮应在按钮上提供 aria-label。

## 使用示例

```tsx
import { Icon } from 'sofa-ui'

export function Example() {
  return (
    <Icon type="check-circle" size={20} />
  )
}
```

## 运行时 API

### `Icon`

```ts
Icon(props: IconProps): React.JSX.Element
```

## 公开类型

### `IconProps`

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `type` | `IconType` | 是 | — | 类型 |
| `size` | `number \| string` | 否 | `16` | 尺寸 |
| `color` | `string` | 否 | — | 颜色 |
| `spin` | `boolean` | 否 | `false` | — |
| `className` | `string` | 否 | — | 附加类名 |
| `style` | `React.CSSProperties` | 否 | — | 内联样式 |
| `onClick` | `(e: React.MouseEvent<SVGSVGElement>) => void` | 否 | — | 点击回调 |

### `IconType`

内置图标集合：24x24 viewBox 描边风格 SVG，继承 currentColor。

```ts
type IconType =
  | 'check' | 'close' | 'info' | 'warning' | 'error' | 'loading'
  | 'search' | 'chevron-down' | 'chevron-up' | 'chevron-right' | 'chevron-left'
  | 'star' | 'star-filled' | 'plus' | 'minus' | 'user' | 'home' | 'settings'
  | 'edit' | 'trash' | 'email' | 'calendar'
  | 'check-circle' | 'error-circle' | 'warning-triangle' | 'info-circle' | 'close-circle'
  | 'eye' | 'eye-off' | 'refresh' | 'upload' | 'download' | 'file'
  | 'arrow-right' | 'arrow-left' | 'arrow-up' | 'arrow-down' | 'more' | 'clock' | 'bell'
  | 'filter' | 'copy' | 'menu' | 'link'
```

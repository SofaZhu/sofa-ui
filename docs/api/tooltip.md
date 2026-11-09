# Tooltip 文字提示

[返回 API 索引](README.md) · [源码](../../src/components/tooltip)

默认悬停触发，也可以用键盘聚焦触发。浮层贴近视口边缘时会自动翻转，文本适合简短说明。

## 使用示例

```tsx
import { Button, Tooltip } from 'sofa-ui'

export function Example() {
  return (
    <Tooltip title="将内容复制到剪贴板" placement="top">
      <Button>复制</Button>
    </Tooltip>
  )
}
```

## 运行时 API

### `Tooltip`

```ts
Tooltip(props: TooltipProps & RefAttributes<HTMLSpanElement>): React.ReactNode
```

## 公开类型

### `TooltipProps`

Tooltip 文字提示：hover 显示轻量气泡，含箭头与 12 方向定位

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `title` | `React.ReactNode` | 是 | — | 提示内容 |
| `placement` | `PopPlacement` | 否 | `'top'` | 气泡方向 |
| `trigger` | `PopTrigger` | 否 | `'hover'` | 触发方式 |
| `open` | `boolean` | 否 | — | 受控打开 |
| `defaultOpen` | `boolean` | 否 | `false` | 默认打开 |
| `onOpenChange` | `(open: boolean) => void` | 否 | — | 打开变化回调 |
| `disabled` | `boolean` | 否 | `false` | 禁用 |
| `children` | `React.ReactNode` | 否 | — | 包裹内容 |
| `className` | `string` | 否 | — | 自定义类名 |
| `popupClassName` | `string` | 否 | — | 气泡类名 |
| `popupStyle` | `React.CSSProperties` | 否 | — | 气泡样式 |
| `offset` | `number` | 否 | `8` | 间距 |

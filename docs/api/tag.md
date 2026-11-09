# Tag 标签

[返回 API 索引](README.md) · [源码](../../src/components/tag)

可关闭标签通过 closable 启用关闭操作。可勾选标签通过 checkable 管理选中状态。

## 使用示例

```tsx
import { Tag } from 'sofa-ui'

export function Example() {
  return (
    <Tag color="primary" closable onClose={() => console.log('关闭标签')}>进行中</Tag>
  )
}
```

## 运行时 API

### `Tag`

```ts
Tag(props: TagProps & RefAttributes<HTMLSpanElement>): React.ReactNode
```

## 公开类型

### `TagProps`

继承 `Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'>`。

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `color` | `TagColor \| string` | 否 | `'primary'` | 标签颜色：预设语义色或任意十六进制色值 |
| `closable` | `boolean` | 否 | `false` | 是否可关闭 |
| `onClose` | `(e: React.MouseEvent<HTMLSpanElement>) => void` | 否 | — | 关闭时的回调 |
| `closeIcon` | `React.ReactNode` | 否 | — | 关闭图标的替换内容 |
| `bordered` | `boolean` | 否 | `true` | 是否显示边框 |
| `size` | `'small' \| 'default' \| 'large'` | 否 | `'default'` | 标签尺寸 |
| `checkable` | `boolean` | 否 | `false` | 可勾选模式 |
| `checked` | `boolean` | 否 | `false` | 选中状态 |
| `onCheckedChange` | `(checked: boolean) => void` | 否 | — | 选中状态变化回调 |
| `onClick` | `(e: React.MouseEvent<HTMLSpanElement>) => void` | 否 | — | 点击回调 |

### `TagColor`

Tag 标签 支持预设语义色、自定义颜色与暗色模式下的自动适配

```ts
type TagColor = 'primary' | 'success' | 'warning' | 'error' | 'info'
```

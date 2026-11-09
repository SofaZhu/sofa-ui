# Space 间距

[返回 API 索引](README.md) · [源码](../../src/components/space)

size 接受档位、像素值或 [水平, 垂直] 元组。wrap 允许换行，split 会插入相邻子项之间。

## 使用示例

```tsx
import { Button, Divider, Space } from 'sofa-ui'

export function Example() {
  return (
    <Space size={[16, 8]} wrap split={<Divider vertical />}>
      <Button>保存</Button>
      <Button>预览</Button>
    </Space>
  )
}
```

## 运行时 API

### `Space`

```ts
Space(props: SpaceProps & RefAttributes<HTMLDivElement>): React.ReactNode
```

## 公开类型

### `SpaceProps`

继承 `Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>`。

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `direction` | `SpaceDirection` | 否 | `'horizontal'` | 排列方向 |
| `size` | `SpaceSize \| [SpaceSize, SpaceSize]` | 否 | `'small'` | 间距：数值、预设或 [横向, 纵向] |
| `wrap` | `boolean` | 否 | `false` | 是否换行 |
| `align` | `'start' \| 'end' \| 'center' \| 'baseline' \| 'stretch'` | 否 | `'center'` | 对齐方式 |
| `split` | `React.ReactNode` | 否 | — | 元素间的分隔节点 |
| `children` | `React.ReactNode` | 否 | — | 子内容 |

### `SpaceSize`

Space 间距容器：为子元素提供统一的水平 / 垂直间距； size 预设（small/middle/large），支持数组横向纵向分别设值

```ts
type SpaceSize = number | string | 'small' | 'middle' | 'large'
```

### `SpaceDirection`

```ts
type SpaceDirection = 'horizontal' | 'vertical'
```

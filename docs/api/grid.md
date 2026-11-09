# Row / Col 栅格

[返回 API 索引](README.md) · [源码](../../src/components/grid)

一行以 24 份为基准。Row 的 gutter 元组按水平、垂直顺序传入；Col 可为不同断点设置列宽。

## 使用示例

```tsx
import { Row, Col } from 'sofa-ui'

export function Example() {
  return (
    <Row gutter={[16, 8]}>
      <Col xs={24} md={12}>左栏</Col>
      <Col xs={24} md={12}>右栏</Col>
    </Row>
  )
}
```

## 运行时 API

### `Row`

```ts
Row(props: RowProps & RefAttributes<HTMLDivElement>): React.ReactNode
```

### `Col`

```ts
Col(props: ColProps & RefAttributes<HTMLDivElement>): React.ReactNode
```

## 公开类型

### `RowProps`

继承 `Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>`。

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `gutter` | `Gutter` | 否 | `0` | 栅格间距 |
| `justify` | `'start' \| 'end' \| 'center' \| 'space-around' \| 'space-between' \| 'space-evenly'` | 否 | `'start'` | 水平对齐 |
| `align` | `'top' \| 'middle' \| 'bottom' \| 'stretch'` | 否 | `'top'` | 垂直对齐 |
| `wrap` | `boolean` | 否 | `true` | 是否自动换行 |
| `children` | `React.ReactNode` | 否 | — | 子内容 |

### `Gutter`

响应式栅格配置：断点 → 间距

```ts
type Gutter = GutterValue | [GutterValue, GutterValue] | Partial<Record<Breakpoint, GutterValue>>
```

### `GutterValue`

Row 栅格行：24 列栅格体系

```ts
type GutterValue = number | string | 'small' | 'middle' | 'large'
```

### `Breakpoint`

```ts
type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
```

### `ColProps`

继承 `Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>`。

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `span` | `ColSpan` | 否 | — | 栅格占位数（1~24，或 auto） |
| `offset` | `number` | 否 | `0` | 向右偏移的栅格数 |
| `order` | `number` | 否 | — | 排序（越小越靠前） |
| `pull` | `number` | 否 | — | 左侧推入栅格数 |
| `push` | `number` | 否 | — | 右侧推出栅格数 |
| `xs` | `ColSpan \| { span?: ColSpan; offset?: number }` | 否 | — | 响应式：xs 及以上 |
| `sm` | `ColSpan \| { span?: ColSpan; offset?: number }` | 否 | — | — |
| `md` | `ColSpan \| { span?: ColSpan; offset?: number }` | 否 | — | — |
| `lg` | `ColSpan \| { span?: ColSpan; offset?: number }` | 否 | — | — |
| `xl` | `ColSpan \| { span?: ColSpan; offset?: number }` | 否 | — | — |
| `xxl` | `ColSpan \| { span?: ColSpan; offset?: number }` | 否 | — | — |
| `hidden` | `boolean` | 否 | `false` | 是否隐藏 |
| `children` | `React.ReactNode` | 否 | — | 子内容 |

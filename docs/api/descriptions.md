# Descriptions 描述列表

[返回 API 索引](README.md) · [源码](../../src/components/descriptions)

用 items 描述标签和内容。span 用于指定某项占用的列数。

## 使用示例

```tsx
import { Descriptions } from 'sofa-ui'

export function Example() {
  return (
    <Descriptions title="订单详情" bordered items={[{ key: 'status', label: '状态', children: '已发货' }]} />
  )
}
```

## 运行时 API

### `Descriptions`

```ts
Descriptions(props: DescriptionsProps): React.JSX.Element
```

## 公开类型

### `DescriptionsItem`

Descriptions 描述列表： 用网格展示键值对信息，支持边框、分栏、标题与垂直布局

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `key` | `string` | 是 | — | 唯一键 |
| `label` | `React.ReactNode` | 是 | — | 字段名 |
| `children` | `React.ReactNode` | 是 | — | 字段值 |
| `span` | `number` | 否 | — | 占据的列数 |

### `DescriptionsProps`

继承 `Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>`。

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `items` | `DescriptionsItem[]` | 是 | — | 条目列表 |
| `bordered` | `boolean` | 否 | `false` | 显示边框 |
| `column` | `number` | 否 | `3` | 每行列数 |
| `size` | `'default' \| 'middle' \| 'small'` | 否 | `'default'` | 尺寸 |
| `title` | `React.ReactNode` | 否 | — | 列表标题 |
| `layout` | `'horizontal' \| 'vertical'` | 否 | `'horizontal'` | 布局：label 同行或上置 |

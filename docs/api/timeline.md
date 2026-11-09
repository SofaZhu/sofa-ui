# Timeline 时间轴

[返回 API 索引](README.md) · [源码](../../src/components/timeline)

items 按输入顺序渲染，可用 reverse 倒序。单项 position 可以覆盖整体对齐方式。

## 使用示例

```tsx
import { Timeline } from 'sofa-ui'

export function Example() {
  return (
    <Timeline items={[
      { label: '09:00', children: '任务创建', color: 'green' },
      { label: '10:00', children: '等待处理', pending: true }
    ]} />
  )
}
```

## 运行时 API

### `Timeline`

```ts
Timeline(props: TimelineProps): React.JSX.Element
```

## 公开类型

### `TimelineItem`

Timeline 时间轴： 垂直展示时间序列，支持左右/交错对齐、自定义节点颜色与 图形、pending 虚线和标签

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `children` | `React.ReactNode` | 否 | — | 条目内容 |
| `color` | `string \| 'green' \| 'red' \| 'gray' \| 'primary'` | 否 | — | 节点颜色：语义色或任意色值 |
| `dot` | `React.ReactNode` | 否 | — | 自定义节点图形 |
| `position` | `'left' \| 'right' \| 'alternate'` | 否 | — | 单条对齐方式（覆盖容器 mode） |
| `pending` | `boolean` | 否 | — | 是否为 pending 尾项（虚线节点） |
| `label` | `React.ReactNode` | 否 | — | 标签（时间等说明文字） |

### `TimelineProps`

继承 `Omit<React.HTMLAttributes<HTMLUListElement>, 'children'>`。

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `items` | `TimelineItem[]` | 是 | — | 条目列表 |
| `mode` | `'left' \| 'right' \| 'alternate'` | 否 | `'left'` | 整体对齐模式 |
| `reverse` | `boolean` | 否 | `false` | 是否倒序展示 |
| `pending` | `boolean` | 否 | `false` | 是否为每条条目启用 pending 样式 |

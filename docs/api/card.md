# Card 卡片

[返回 API 索引](README.md) · [源码](../../src/components/card)

title 和 extra 共同构成头部，children 放置卡片正文。

## 使用示例

```tsx
import { Card } from 'sofa-ui'

export function Example() {
  return (
    <Card title="项目概览" extra={<a href="#details">查看详情</a>} hoverable>最新动态</Card>
  )
}
```

## 运行时 API

### `Card`

```ts
Card(props: CardProps & RefAttributes<HTMLDivElement>): React.ReactNode
```

## 公开类型

### `CardProps`

Card 卡片： 标题 + 操作区 + 封面 + 悬浮效果

继承 `Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>`。

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `title` | `React.ReactNode` | 否 | — | 卡片标题 |
| `extra` | `React.ReactNode` | 否 | — | 右上角操作区 |
| `cover` | `React.ReactNode` | 否 | — | 封面图 |
| `footer` | `React.ReactNode` | 否 | — | 底部内容 |
| `bordered` | `boolean` | 否 | `true` | 显示边框 |
| `hoverable` | `boolean` | 否 | `false` | 悬浮时阴影加深 |
| `bodyStyle` | `React.CSSProperties` | 否 | — | 内容区域自定义样式 |

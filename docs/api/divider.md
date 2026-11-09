# Divider 分割线

[返回 API 索引](README.md) · [源码](../../src/components/divider)

带标题的横线在标题左右留空。vertical 用于行内分隔，标题和对齐选项用于水平形态。

## 使用示例

```tsx
import { Divider } from 'sofa-ui'

export function Example() {
  return (
    <>
      <Divider orientation="left">个人资料</Divider>
      <span>选项一</span><Divider vertical /><span>选项二</span>
    </>
  )
}
```

## 运行时 API

### `Divider`

```ts
Divider(props: DividerProps & RefAttributes<HTMLDivElement>): React.ReactNode
```

## 公开类型

### `DividerProps`

Divider 分割线：水平 / 垂直两种方向，支持带标题与对齐方式

继承 `Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>`。

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `vertical` | `boolean` | 否 | `false` | 垂直分割线 |
| `dashed` | `boolean` | 否 | `false` | 虚线 |
| `orientation` | `'left' \| 'center' \| 'right'` | 否 | `'center'` | 标题位置 |
| `children` | `React.ReactNode` | 否 | — | 标题（或任意内容） |

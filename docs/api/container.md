# Container 容器

[返回 API 索引](README.md) · [源码](../../src/components/container)

默认居中并限制最大宽度。fluid 使容器占满可用宽度，gutter 设置左右留白。

## 使用示例

```tsx
import { Container } from 'sofa-ui'

export function Example() {
  return (
    <Container maxWidth={1080} gutter={16}>受限宽度的内容</Container>
  )
}
```

## 运行时 API

### `Container`

```ts
Container(props: ContainerProps): React.JSX.Element
```

## 公开类型

### `ContainerProps`

Container 宽屏容器：限定最大宽度并水平居中，可选内边距与全宽模式

继承 `React.HTMLAttributes<HTMLDivElement>`。

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `maxWidth` | `number \| string` | 否 | `'1200px'` | 最大宽度：数字按像素处理，字符串原样传入 |
| `fluid` | `boolean` | 否 | `false` | 全宽模式，忽略 maxWidth |
| `gutter` | `number \| string` | 否 | `16` | 内边距：数字按像素，字符串原样传入 |
| `centered` | `boolean` | 否 | `true` | 水平居中 |

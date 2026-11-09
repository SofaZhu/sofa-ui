# Anchor 锚点

[返回 API 索引](README.md) · [源码](../../src/components/anchor)

使用 AnchorLink 声明导航项，href 应指向页面中存在的 id。固定页头可通过 scrollOffset 预留空间。

## 使用示例

```tsx
import { Anchor, AnchorLink } from 'sofa-ui'

export function Example() {
  return (
    <>
      <Anchor scrollOffset={64}>
        <AnchorLink href="#intro" title="简介" />
        <AnchorLink href="#usage" title="用法" />
      </Anchor>
      <section id="intro">简介内容</section>
      <section id="usage">用法内容</section>
    </>
  )
}
```

## 运行时 API

### `Anchor`

```ts
Anchor(props: AnchorProps): React.JSX.Element
```

### `AnchorLink`

```ts
AnchorLink(props: AnchorLinkProps): React.JSX.Element
```

## 公开类型

### `AnchorProps`

继承 `Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>`。

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `target` | `HTMLElement \| (() => HTMLElement \| null)` | 否 | — | 滚动容器（默认 window） |
| `offsetTop` | `number` | 否 | `0` | 监听偏移量（滚动到距顶部该距离时触发高亮） |
| `scrollOffset` | `number` | 否 | `0` | 点击滚动时预留的偏移 |
| `onChange` | `(currentId: string) => void` | 否 | — | 当前高亮 id 变化回调 |
| `sticky` | `boolean` | 否 | `true` | 是否固定（position: sticky） |

### `AnchorLinkProps`

Anchor 锚点：监听滚动位置高亮当前区块，点击平滑滚动到目标

继承 `Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick' | 'title'>`。

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `href` | `string` | 是 | — | 锚点标识（页面中对应元素的 id） |
| `title` | `React.ReactNode` | 是 | — | 链接文案 |
| `children` | `React.ReactNode` | 否 | — | 子链接 |
| `onClick` | `React.MouseEventHandler<HTMLAnchorElement>` | 否 | — | 点击链接回调 |

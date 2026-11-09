# BackTop 回到顶部

[返回 API 索引](README.md) · [源码](../../src/components/back-top)

默认监听窗口滚动。传入 target 时，需要让目标元素本身可以滚动。

## 使用示例

```tsx
import { BackTop } from 'sofa-ui'

export function Example() {
  return (
    <BackTop visibilityHeight={320} aria-label="回到顶部" />
  )
}
```

## 运行时 API

### `BackTop`

```ts
BackTop(props: BackTopProps): React.JSX.Element
```

## 公开类型

### `BackTopProps`

BackTop 回到顶部：页面滚动后显示按钮，点击平滑回到顶部

继承 `React.HTMLAttributes<HTMLDivElement>`。

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `target` | `HTMLElement \| (() => HTMLElement \| null)` | 否 | — | 滚动容器（默认 window） |
| `visibilityHeight` | `number` | 否 | `400` | 显示按钮的滚动高度阈值 |
| `smooth` | `boolean` | 否 | `true` | 是否平滑滚动 |

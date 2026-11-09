# Empty 空状态

[返回 API 索引](README.md) · [源码](../../src/components/empty)

用于没有内容时的反馈。通过 image 换图，子节点可放重试等后续操作。

## 使用示例

```tsx
import { Empty } from 'sofa-ui'

export function Example() {
  return (
    <Empty description="暂无订单" />
  )
}
```

## 运行时 API

### `Empty`

```ts
Empty(props: EmptyProps): React.JSX.Element
```

## 公开类型

### `EmptyProps`

Empty 空状态：无数据时的占位提示

继承 `React.HTMLAttributes<HTMLDivElement>`。

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `description` | `React.ReactNode` | 否 | `'暂无数据'` | 描述文案 |
| `image` | `React.ReactNode` | 否 | — | 自定义插图 |
| `children` | `React.ReactNode` | 否 | — | 底部操作区 |

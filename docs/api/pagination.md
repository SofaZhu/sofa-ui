# Pagination 分页

[返回 API 索引](README.md) · [源码](../../src/components/pagination)

pageSize 与 defaultPageSize 分别用于受控和非受控条数。onChange 同时返回页码和条数，切换条数时会限制页码范围。

## 使用示例

```tsx
import { Pagination } from 'sofa-ui'

export function Example() {
  return (
    <Pagination total={93} defaultPageSize={10} showSizeChanger showQuickJumper onChange={console.log} />
  )
}
```

## 运行时 API

### `Pagination`

```ts
Pagination(props: PaginationProps): React.JSX.Element
```

## 公开类型

### `PaginationProps`

Pagination 分页器： 页码 + 快速跳转 + 每页条数切换

继承 `Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>`。

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `total` | `number` | 是 | — | 总条数 |
| `current` | `number` | 否 | — | 受控当前页 |
| `defaultCurrent` | `number` | 否 | `1` | 默认页码 |
| `pageSize` | `number` | 否 | — | 每页条数 |
| `defaultPageSize` | `number` | 否 | `10` | 非受控模式下的初始每页条数 |
| `onChange` | `(page: number, pageSize: number) => void` | 否 | — | 页码变化回调 |
| `onPageSizeChange` | `(size: number) => void` | 否 | — | 每页条数变化回调 |
| `pageSizeOptions` | `number[]` | 否 | `[10, 20, 50, 100]` | 每页条数选项 |
| `showSizeChanger` | `boolean` | 否 | `false` | 是否显示每页条数选择器 |
| `showQuickJumper` | `boolean` | 否 | `false` | 是否显示快速跳转 |
| `showTotal` | `(total: number, range: [number, number]) => React.ReactNode` | 否 | — | 是否显示总条数 |
| `disabled` | `boolean` | 否 | `false` | 是否禁用 |

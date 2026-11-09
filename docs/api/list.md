# List 列表

[返回 API 索引](README.md) · [源码](../../src/components/list)

List 从 dataSource 推断条目类型。renderItem 接收当前数据和索引，可用 ListItem 统一布局。

## 使用示例

```tsx
import { List, ListItem } from 'sofa-ui'

export function Example() {
  return (
    <List
      dataSource={[{ id: 'a', title: '第一条' }]}
      renderItem={(item) => <ListItem key={item.id}>{item.title}</ListItem>}
    />
  )
}
```

## 运行时 API

### `List`

```ts
List<T>(props: ListProps<T>): React.JSX.Element
```

### `ListItem`

```ts
ListItem(props: ListItemProps): React.JSX.Element
```

## 公开类型

### `ListItemProps`

继承 `React.HTMLAttributes<HTMLDivElement>`。

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `actions` | `React.ReactNode[]` | 否 | — | 右侧操作区 |
| `extra` | `React.ReactNode` | 否 | — | 右侧附加内容（最右） |

### `ListProps<T>`

List 列表： 通用数据列表，支持加载态（Spin 遮罩）、空态（Empty）、 边框分隔与头部底部插槽；List.Item 提供右侧操作区与附加内容

继承 `Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>`。

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `dataSource` | `T[]` | 是 | — | 数据源 |
| `renderItem` | `(item: T, index: number) => React.ReactNode` | 是 | — | 渲染单项，返回 ReactNode（可返回 List.Item） |
| `loading` | `boolean` | 否 | `false` | 加载中状态（覆盖层） |
| `size` | `'default' \| 'small' \| 'large'` | 否 | `'default'` | 尺寸 |
| `bordered` | `boolean` | 否 | `false` | 显示边框 |
| `header` | `React.ReactNode` | 否 | — | 头部插槽 |
| `footer` | `React.ReactNode` | 否 | — | 底部插槽 |
| `split` | `boolean` | 否 | `true` | 是否显示项之间的分隔线 |

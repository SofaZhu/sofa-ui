# Table 表格

[返回 API 索引](README.md) · [源码](../../src/components/table)

为数据设置稳定的 rowKey。columns 声明列及渲染逻辑，分页、选择和展开可分别配置。

## 使用示例

```tsx
import { Table } from 'sofa-ui'

export function Example() {
  return (
    <Table
      dataSource={[{ key: 'row-1', name: '示例' }]}
      columns={[{ key: 'name', title: '名称', dataIndex: 'name' }]}
    />
  )
}
```

## 运行时 API

### `Table`

```ts
Table<T extends TableRecord>(props: TableProps<T>): React.JSX.Element
```

## 公开类型

### `TableProps<T extends TableRecord = TableRecord>`

继承 `Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'children'>`。

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `columns` | `TableColumn<T>[]` | 是 | — | 列定义 |
| `dataSource` | `T[]` | 是 | — | 数据源 |
| `pagination` | `false \| TablePaginationConfig` | 否 | — | 分页配置，false 关闭分页 |
| `loading` | `boolean` | 否 | `false` | 加载态（遮罩） |
| `rowSelection` | `TableRowSelection<T>` | 否 | — | 行选择配置 |
| `onRow` | `(record: T, index: number) => React.HTMLAttributes<HTMLTableRowElement>` | 否 | — | 行属性透传（含行事件） |
| `expandable` | `TableExpandable<T>` | 否 | — | 展开行配置 |
| `scroll` | `{ x?: number \| string; y?: number \| string }` | 否 | — | 滚动区域：x 横向溢出，y 纵向滚动（表头 sticky） |
| `size` | `'small' \| 'middle' \| 'large'` | 否 | `'middle'` | 表格尺寸 |
| `bordered` | `boolean` | 否 | `false` | 是否显示边框 |
| `emptyText` | `React.ReactNode` | 否 | — | 空数据文案 |
| `onChange` | `( pagination: { current: number; pageSize: number }, sorter: TableSorter \| null, filters: Record<string, Array<string \| number>> ) => void` | 否 | — | 分页 / 排序 / 筛选变化回调 |

### `TableColumn<T extends TableRecord = TableRecord>`

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `key` | `string` | 是 | — | 唯一键 |
| `title` | `React.ReactNode` | 是 | — | 列头标题 |
| `dataIndex` | `string` | 否 | — | 数据字段路径（支持 a.b 点路径） |
| `width` | `number \| string` | 否 | — | 列宽 |
| `align` | `'left' \| 'center' \| 'right'` | 否 | — | 单元格对齐方式 |
| `fixed` | `'left' \| 'right'` | 否 | — | 固定列方向 |
| `sorter` | `(a: T, b: T) => number` | 否 | — | 排序比较函数（提供后可排序） |
| `sortOrder` | `SortOrder` | 否 | — | 该列初始排序方向 |
| `filters` | `Array<{ text: React.ReactNode; value: string \| number }>` | 否 | — | 筛选选项 |
| `filterMultiple` | `boolean` | 否 | — | 筛选是否多选（默认 true，false 时为单选） |
| `render` | `(value: unknown, record: T, index: number) => React.ReactNode` | 否 | — | 自定义单元格渲染 |

### `TableRecord`

```ts
interface TableRecord {
  key: string
  [rest: string]: unknown
}
```

### `TableExpandable<T extends TableRecord = TableRecord>`

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `expandedRowKeys` | `string[]` | 否 | — | 受控展开键 |
| `defaultExpandedRowKeys` | `string[]` | 否 | — | 默认展开键 |
| `onExpand` | `(expanded: boolean, record: T) => void` | 否 | — | 展开状态变化回调 |
| `renderExpandedRow` | `(record: T) => React.ReactNode` | 否 | — | 展开行内容渲染 |

### `TablePaginationConfig`

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `pageSize` | `number` | 否 | — | 每页条数 |
| `current` | `number` | 否 | — | 受控当前页 |
| `total` | `number` | 否 | — | 总条数（不传时取数据长度） |
| `onChange` | `(page: number, pageSize: number) => void` | 否 | — | 页码变化回调 |

### `TableRowSelection<T extends TableRecord = TableRecord>`

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `selectedRowKeys` | `string[]` | 否 | — | 受控选中键 |
| `defaultSelectedRowKeys` | `string[]` | 否 | — | 默认选中键 |
| `onChange` | `(selectedRowKeys: string[], selectedRows: T[]) => void` | 否 | — | 选中变化回调（键 + 行数据） |
| `type` | `'checkbox' \| 'radio'` | 否 | — | 选择模式：复选框 / 单选 |
| `getCheckboxProps` | `(record: T) => { disabled?: boolean }` | 否 | — | 单行选择属性（如禁用） |

### `TableSorter`

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `field` | `string` | 是 | — | 排序字段（列 key） |
| `order` | `SortOrder` | 是 | — | 排序方向 |

### `SortOrder`

Table 表格： 列定义渲染 + 表头排序循环 + 筛选浮层 + 本地分页 + 行选择（全选/半选/单选） + 展开行 + 固定表头/固定列 + 加载态 + onRow 透传

```ts
type SortOrder = 'ascend' | 'descend'
```

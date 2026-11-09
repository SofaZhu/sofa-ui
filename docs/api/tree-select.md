# TreeSelect 树选择

[返回 API 索引](README.md) · [源码](../../src/components/tree-select)

treeData 使用与 Tree 相同的节点结构。多选时传入键数组，单选时传入单个键。

## 使用示例

```tsx
import { TreeSelect } from 'sofa-ui'

export function Example() {
  return (
    <TreeSelect treeData={[{ key: 'root', title: '团队', children: [{ key: 'design', title: '设计组' }] }]} />
  )
}
```

## 运行时 API

### `TreeSelect`

```ts
TreeSelect(props: TreeSelectProps): React.JSX.Element
```

## 公开类型

### `TreeSelectProps`

TreeSelect 树选择：下拉面板内嵌树形结构 单选（点击节点选中）+ 多选（树复选框）

继承 `Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'value' | 'defaultValue'>`。

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `treeData` | `TreeNode[]` | 是 | — | 树数据 |
| `value` | `string \| string[]` | 否 | — | 受控值（单选为 key，多选为 key 数组） |
| `defaultValue` | `string \| string[]` | 否 | — | 默认值 |
| `onChange` | `(value: string \| string[] \| undefined, label?: React.ReactNode) => void` | 否 | — | 值变化回调（label 为选中节点文案列表） |
| `multiple` | `boolean` | 否 | `false` | 多选模式（树复选框） |
| `searchable` | `boolean` | 否 | `false` | 是否可搜索（按标签过滤树） |
| `clearable` | `boolean` | 否 | `false` | 是否可清空 |
| `disabled` | `boolean` | 否 | `false` | 是否禁用 |
| `placeholder` | `string` | 否 | `'请选择'` | 占位文案 |
| `size` | `'small' \| 'default' \| 'large'` | 否 | `'default'` | 尺寸 |
| `placement` | `PopPlacement` | 否 | `'bottom'` | 弹层方向 |
| `showLine` | `boolean` | 否 | `false` | 是否展示连线 |
| `emptyText` | `React.ReactNode` | 否 | — | 空数据展示 |

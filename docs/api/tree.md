# Tree 树

[返回 API 索引](README.md) · [源码](../../src/components/tree)

为每个节点提供唯一 key。展开、选中和勾选分别由对应键数组控制。

## 使用示例

```tsx
import { Tree } from 'sofa-ui'

export function Example() {
  return (
    <Tree treeData={[{ key: 'root', title: '团队', children: [{ key: 'design', title: '设计组' }] }]} />
  )
}
```

## 运行时 API

### `Tree`

```ts
Tree(props: TreeProps): React.JSX.Element
```

## 公开类型

### `TreeProps`

继承 `Omit<
    React.HTMLAttributes<HTMLDivElement>,
    | 'onChange'
    | 'onSelect'
    | 'onDragStart'
    | 'onDragEnter'
    | 'onDragOver'
    | 'onDragLeave'
    | 'onDrop'
    | 'onDragEnd'
  >`。

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `treeData` | `TreeNode[]` | 是 | — | 树数据（label/title 兼容） |
| `defaultExpandAll` | `boolean` | 否 | `false` | 默认展开全部 |
| `expandedKeys` | `string[]` | 否 | — | 受控展开键 |
| `defaultExpandedKeys` | `string[]` | 否 | — | 默认展开键 |
| `onExpand` | `(expandedKeys: string[], info: { node: TreeNode; expanded: boolean }) => void` | 否 | — | 展开变化回调 |
| `selectedKeys` | `string[]` | 否 | — | 受控选中键 |
| `defaultSelectedKeys` | `string[]` | 否 | — | 默认选中键 |
| `onSelect` | `(selectedKeys: string[], info: TreeSelectInfo) => void` | 否 | — | 选中变化回调 |
| `multiple` | `boolean` | 否 | `false` | 多选模式（Ctrl/⌘ 追加选择） |
| `checkable` | `boolean` | 否 | `false` | 是否显示复选框 |
| `checkedKeys` | `string[]` | 否 | — | 受控勾选键（只含全选节点） |
| `defaultCheckedKeys` | `string[]` | 否 | — | 默认勾选键 |
| `onCheck` | `(checkedKeys: string[], info: TreeCheckInfo) => void` | 否 | — | 勾选变化回调 |
| `showLine` | `boolean` | 否 | `false` | 是否显示连线样式 |
| `loadData` | `(node: TreeNode) => Promise<void>` | 否 | — | 懒加载：展开时调用，完成后写入 children |
| `draggable` | `boolean` | 否 | `false` | 是否可拖拽 |
| `onDragStart` | `(e: React.DragEvent<HTMLDivElement>, node: TreeNode) => void` | 否 | — | — |
| `onDragEnter` | `(e: React.DragEvent<HTMLDivElement>, node: TreeNode) => void` | 否 | — | — |
| `onDragOver` | `(e: React.DragEvent<HTMLDivElement>, node: TreeNode) => void` | 否 | — | — |
| `onDragLeave` | `(e: React.DragEvent<HTMLDivElement>, node: TreeNode) => void` | 否 | — | — |
| `onDrop` | `(info: TreeDropInfo) => void` | 否 | — | 拖放完成回调（含位置计算信息） |
| `onDragEnd` | `(e: React.DragEvent<HTMLDivElement>, node: TreeNode) => void` | 否 | — | — |

### `TreeNode`

Tree 树形控件： 展开受控 + 选择受控 + 复选半选联动（checkedKeys 只含全选节点） + 懒加载 + 拖拽事件透传 + 连线样式 + 键盘导航 节点模型统一为 label / title 兼容

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `key` | `string` | 是 | — | 节点唯一键 |
| `label` | `React.ReactNode` | 否 | — | 节点标签（优先使用），兼容 title |
| `title` | `React.ReactNode` | 否 | — | 兼容字段：未提供 label 时回退 |
| `children` | `TreeNode[]` | 否 | — | 子节点 |
| `disabled` | `boolean` | 否 | — | 是否禁用（不可选中/勾选/展开） |
| `selectable` | `boolean` | 否 | — | 是否可选中 |
| `checkable` | `boolean` | 否 | — | 是否可勾选（checkable 模式下逐节点开关） |
| `icon` | `React.ReactNode` | 否 | — | 节点前缀图标 |
| `isLeaf` | `boolean` | 否 | — | 是否叶子节点（懒加载时生效） |

### `TreeSelectInfo`

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `node` | `TreeNode` | 是 | — | — |
| `selected` | `boolean` | 是 | — | — |
| `event` | `React.MouseEvent<HTMLSpanElement> \| React.KeyboardEvent<HTMLDivElement>` | 否 | — | 触发的事件（键盘触发时可能为空） |

### `TreeCheckInfo`

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `checked` | `boolean` | 是 | — | 选中状态 |
| `node` | `TreeNode` | 是 | — | — |
| `halfCheckedKeys` | `string[]` | 是 | — | 半选节点键集合（不计入 checkedKeys） |
| `event` | `React.MouseEvent<HTMLSpanElement> \| React.KeyboardEvent<HTMLDivElement>` | 否 | — | 触发的事件（键盘触发时可能为空） |

### `TreeDropInfo`

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `node` | `TreeNode` | 是 | — | 拖放目标节点 |
| `dragNode` | `TreeNode` | 是 | — | 被拖拽的节点 |
| `dropPosition` | `TreeDropPosition` | 是 | — | -1 上方间隙 / 0 内部 / 1 下方间隙 |
| `dropToGap` | `boolean` | 是 | — | 是否落入间隙（非内部） |
| `event` | `React.DragEvent<HTMLDivElement>` | 是 | — | 原生拖放事件 |

### `TreeDropPosition`

```ts
type TreeDropPosition = -1 | 0 | 1
```

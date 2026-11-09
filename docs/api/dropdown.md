# Dropdown 下拉菜单

[返回 API 索引](README.md) · [源码](../../src/components/dropdown)

通过 menu.items 配置菜单，children 是触发节点。子菜单由菜单项的 children 数组组成。

## 使用示例

```tsx
import { Button, Dropdown } from 'sofa-ui'

export function Example() {
  return (
    <Dropdown trigger="click" menu={{ items: [{ key: 'edit', label: '编辑' }], onSelect: console.log }}>
      <Button>更多操作</Button>
    </Dropdown>
  )
}
```

## 运行时 API

### `Dropdown`

```ts
Dropdown(props: DropdownProps): React.JSX.Element
```

## 公开类型

### `DropdownProps`

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `children` | `React.ReactNode` | 是 | — | 触发元素 |
| `menu` | `DropdownMenuProps` | 是 | — | 菜单配置 |
| `trigger` | `PopTrigger` | 否 | `'click'` | 触发方式 |
| `placement` | `PopPlacement` | 否 | `'bottomLeft'` | 显示位置 |
| `open` | `boolean` | 否 | — | 打开状态（受控） |
| `defaultOpen` | `boolean` | 否 | — | 默认打开状态 |
| `onOpenChange` | `(open: boolean) => void` | 否 | — | 打开状态变化回调 |
| `disabled` | `boolean` | 否 | `false` | 禁用状态 |

### `DropdownMenuProps`

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `items` | `DropdownMenuItem[]` | 是 | — | 条目列表 |
| `onSelect` | `(key: string) => void` | 否 | — | 选择回调 |

### `DropdownMenuItem`

Dropdown 下拉菜单： - 支持 hover / click 触发 - menu 配置式（items 数组）或 children 自定义菜单

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `key` | `string` | 是 | — | 唯一键 |
| `label` | `React.ReactNode` | 是 | — | 显示标签 |
| `icon` | `React.ReactNode` | 否 | — | 图标节点 |
| `disabled` | `boolean` | 否 | — | 禁用状态 |
| `danger` | `boolean` | 否 | — | — |
| `children` | `DropdownMenuItem[]` | 否 | — | 子内容 |

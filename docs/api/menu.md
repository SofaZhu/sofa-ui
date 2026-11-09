# Menu 菜单

[返回 API 索引](README.md) · [源码](../../src/components/menu)

通过 MenuItem、SubMenu 和 MenuItemGroup 组合菜单。选择项由 itemKey 标识，子菜单由 subKey 标识。

## 使用示例

```tsx
import { Menu, MenuItem, SubMenu } from 'sofa-ui'

export function Example() {
  return (
    <Menu defaultSelectedKey="profile">
      <SubMenu subKey="settings" title="设置" defaultOpen>
        <MenuItem itemKey="profile">个人资料</MenuItem>
      </SubMenu>
    </Menu>
  )
}
```

## 运行时 API

### `Menu`

```ts
Menu(props: MenuProps): React.JSX.Element
```

### `MenuItem`

```ts
MenuItem(props: MenuItemProps): React.JSX.Element | null
```

### `SubMenu`

```ts
SubMenu(props: SubMenuProps): React.JSX.Element
```

### `MenuItemGroup`

```ts
MenuItemGroup(props: MenuItemGroupProps): React.JSX.Element
```

## 公开类型

### `MenuProps`

继承 `Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'>`。

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `selectedKey` | `string` | 否 | — | 选中项 key |
| `defaultSelectedKey` | `string` | 否 | — | 默认选中 |
| `openKeys` | `string[]` | 否 | — | 展开的 submenu key 列表（inline） |
| `defaultOpenKeys` | `string[]` | 否 | `[]` | 默认展开 |
| `horizontal` | `boolean` | 否 | `false` | 横向模式 |
| `onSelect` | `(key: string) => void` | 否 | — | 选中回调 |
| `onOpenChange` | `(keys: string[]) => void` | 否 | — | 打开状态变化回调 |

### `MenuItemProps`

Menu 导航菜单： - inline 垂直展开 / horizontal 横向 - MenuItem 叶子项 / SubMenu 子菜单（inline 展开，horizontal 悬浮展开） - MenuItemGroup 分组 说明：React 会剥离 `key` prop，Menu 在渲染时通过 cloneElement 将子元素 的 React key 注入 itemKey / subKey 作为组件标识。

继承 `Omit<React.HTMLAttributes<HTMLDivElement>, 'key'>`。

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `itemKey` | `string` | 否 | — | 唯一标识（也可通过 React key 传入） |
| `disabled` | `boolean` | 否 | `false` | 是否禁用 |
| `icon` | `React.ReactNode` | 否 | — | 图标 |

### `SubMenuProps`

继承 `Omit<React.HTMLAttributes<HTMLDivElement>, 'key' | 'title'>`。

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `subKey` | `string` | 否 | — | — |
| `title` | `React.ReactNode` | 是 | — | 标题 |
| `icon` | `React.ReactNode` | 否 | — | 图标节点 |
| `defaultOpen` | `boolean` | 否 | `false` | inline 模式下默认展开 |
| `disabled` | `boolean` | 否 | `false` | 禁用状态 |

### `MenuItemGroupProps`

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `title` | `React.ReactNode` | 是 | — | 标题 |
| `children` | `React.ReactNode` | 否 | — | 子内容 |

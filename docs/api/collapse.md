# Collapse 折叠面板

[返回 API 索引](README.md) · [源码](../../src/components/collapse)

手风琴模式只展开一项。通过 activeKey 管理受控展开状态。

## 使用示例

```tsx
import { Collapse } from 'sofa-ui'

export function Example() {
  return (
    <Collapse items={[{ key: 'help', label: '常见问题', children: '答案内容' }]} />
  )
}
```

## 运行时 API

### `Collapse`

```ts
Collapse(props: CollapseProps): React.JSX.Element
```

## 公开类型

### `CollapseItem`

Collapse 折叠面板： 多面板展开/收起，支持手风琴、无边框幽灵风格、 点击区域自定义与纯 CSS 展开动画（grid-template-rows 0fr→1fr）

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `key` | `string` | 是 | — | 唯一键 |
| `label` | `React.ReactNode` | 是 | — | 标题 |
| `children` | `React.ReactNode` | 否 | — | 内容区 |
| `disabled` | `boolean` | 否 | — | 是否禁用 |

### `CollapseProps`

继承 `Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>`。

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `items` | `CollapseItem[]` | 是 | — | 面板项 |
| `activeKey` | `string \| string[]` | 否 | — | 受控展开键（手风琴为字符串，多开为字符串数组） |
| `defaultActiveKey` | `string \| string[]` | 否 | — | 默认展开键 |
| `onChange` | `(key: string \| string[]) => void` | 否 | — | 展开变化回调 |
| `accordion` | `boolean` | 否 | `false` | 手风琴模式：同时只展开一个 |
| `bordered` | `boolean` | 否 | `true` | 显示边框 |
| `ghost` | `boolean` | 否 | `false` | 幽灵风格：无边框无背景 |
| `collapsible` | `'header' \| 'icon' \| 'disabled'` | 否 | `'header'` | 可折叠区域：整行 / 仅箭头 / 不可折叠（始终展开） |

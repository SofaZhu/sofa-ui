# Tabs 标签页

[返回 API 索引](README.md) · [源码](../../src/components/tabs)

每项需要稳定的 key。使用 activeKey 控制当前页，关闭回调由调用方更新 items。

## 使用示例

```tsx
import { Tabs } from 'sofa-ui'

export function Example() {
  return (
    <Tabs defaultActiveKey="intro" items={[
      { key: 'intro', label: '简介', children: '简介内容' },
      { key: 'api', label: '接口', children: '接口内容' }
    ]} />
  )
}
```

## 运行时 API

### `Tabs`

```ts
Tabs(props: TabsProps): React.JSX.Element
```

## 公开类型

### `TabsProps`

继承 `Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>`。

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `items` | `TabItem[]` | 是 | — | 标签项 |
| `activeKey` | `string` | 否 | — | 受控激活键 |
| `defaultActiveKey` | `string` | 否 | — | 默认激活键 |
| `onChange` | `(key: string) => void` | 否 | — | 切换回调 |
| `onClose` | `(key: string) => void` | 否 | — | 关闭回调 |
| `type` | `'line' \| 'card'` | 否 | `'line'` | 风格：line（下划线）/ card（卡片） |
| `centered` | `boolean` | 否 | `false` | 标签居中 |
| `keepAlive` | `boolean` | 否 | `false` | 是否保持已渲染内容不销毁 |
| `lazy` | `boolean` | 否 | `true` | 是否懒渲染（首次激活才渲染内容） |

### `TabItem`

Tabs 标签页： 支持 line / card 两种风格、可关闭、居中布局

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `key` | `string` | 是 | — | 唯一键 |
| `label` | `React.ReactNode` | 是 | — | 标签文字 |
| `disabled` | `boolean` | 否 | — | 是否禁用 |
| `closable` | `boolean` | 否 | — | 是否可关闭 |
| `children` | `React.ReactNode` | 否 | — | 标签内容 |
| `icon` | `React.ReactNode` | 否 | — | 图标 |

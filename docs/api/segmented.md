# Segmented 分段选择

[返回 API 索引](README.md) · [源码](../../src/components/segmented)

选项可以是字符串、数字或带图标、禁用状态的对象。同一时刻只选中一项。

## 使用示例

```tsx
import { Segmented } from 'sofa-ui'

export function Example() {
  return (
    <Segmented options={['日', '周', '月']} defaultValue="周" />
  )
}
```

## 运行时 API

### `Segmented`

```ts
Segmented(props: SegmentedProps): React.JSX.Element
```

## 公开类型

### `SegmentedProps`

继承 `Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'>`。

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `options` | `Array<SegmentedOption \| string \| number>` | 是 | — | 选项：字符串或对象数组 |
| `value` | `string \| number` | 否 | — | 受控选中值 |
| `defaultValue` | `string \| number` | 否 | — | 默认选中值 |
| `onChange` | `(value: string \| number) => void` | 否 | — | 变化回调 |
| `block` | `boolean` | 否 | `false` | 全宽自适应 |
| `size` | `'small' \| 'default' \| 'large'` | 否 | `'default'` | 尺寸 |
| `disabled` | `boolean` | 否 | `false` | 禁用整体 |

### `SegmentedOption`

Segmented 分段控制器：互斥选项切换，选中高亮过渡，方向键移动焦点

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `value` | `string \| number` | 是 | — | 选项值 |
| `label` | `React.ReactNode` | 否 | — | 显示文本 |
| `icon` | `React.ReactNode` | 否 | — | 图标 |
| `disabled` | `boolean` | 否 | — | 禁用 |

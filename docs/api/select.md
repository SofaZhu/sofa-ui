# Select 选择器

[返回 API 索引](README.md) · [源码](../../src/components/select)

单选使用字符串或数字，多选使用数组。可搜索内容基于选项标签；清空时单选返回 undefined，多选返回空数组。 当前实现使用 value 配合 onChange 初始化并更新受控选择。类型中保留的 defaultValue 尚未生效。

## 使用示例

```tsx
import { Select } from 'sofa-ui'

export function Example() {
  return (
    <Select
      searchable
      clearable
      value="react"
      options={[{ value: 'react', label: 'React' }, { value: 'vue', label: 'Vue' }]}
      onChange={console.log}
    />
  )
}
```

## 运行时 API

### `Select`

```ts
Select(props: SelectProps): React.JSX.Element
```

## 公开类型

### `SelectProps`

继承 `Omit<
    React.HTMLAttributes<HTMLDivElement>,
    'onChange' | 'children' | 'value' | 'size' | 'defaultValue'
  >`。

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `options` | `SelectOption[]` | 否 | `[]` | 下拉选项 |
| `value` | `SelectValue` | 否 | — | 受控值 |
| `defaultValue` | `SelectValue` | 否 | — | 默认值 |
| `onChange` | `(value: SelectValue) => void` | 否 | — | 值变化回调 |
| `multiple` | `boolean` | 否 | `false` | 多选模式 |
| `searchable` | `boolean` | 否 | `false` | 是否可搜索 |
| `clearable` | `boolean` | 否 | `false` | 是否可清空 |
| `disabled` | `boolean` | 否 | `false` | 是否禁用 |
| `loading` | `boolean` | 否 | `false` | 是否处于加载状态 |
| `placeholder` | `string` | 否 | `'请选择'` | 占位文案 |
| `size` | `'small' \| 'default' \| 'large'` | 否 | `'default'` | 尺寸 |
| `placement` | `PopPlacement` | 否 | `'bottom'` | 下拉弹层方向 |
| `emptyText` | `React.ReactNode` | 否 | — | 空数据展示 |
| `children` | `React.ReactNode` | 否 | — | 自定义下拉内容（替代 options 渲染） |

### `SelectOption`

Select 选择器： 支持单选 / 多选 / 可搜索 / 可清空 / 自定义下拉内容

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `label` | `React.ReactNode` | 是 | — | 显示标签 |
| `value` | `string \| number` | 是 | — | 值 |
| `disabled` | `boolean` | 否 | — | 禁用状态 |

### `SelectValue`

```ts
type SelectValue = string | number | Array<string | number> | undefined
```

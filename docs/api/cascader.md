# Cascader 级联选择

[返回 API 索引](README.md) · [源码](../../src/components/cascader)

选中值是从根到叶子的 value 数组。清空时，onChange 收到 undefined 和空数组。搜索不会返回禁用分支。

## 使用示例

```tsx
import { Cascader } from 'sofa-ui'

export function Example() {
  return (
    <Cascader
      searchable
      clearable
      options={[{ value: 'zhejiang', label: '浙江', children: [{ value: 'hangzhou', label: '杭州' }] }]}
      onChange={(path, nodes) => console.log(path, nodes)}
    />
  )
}
```

## 运行时 API

### `Cascader`

```ts
Cascader(props: CascaderProps): React.JSX.Element
```

## 公开类型

### `CascaderProps`

继承 `Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'value' | 'defaultValue'>`。

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `options` | `CascaderOption[]` | 是 | — | 级联数据 |
| `value` | `Array<string \| number>` | 否 | — | 受控值（各级 value 数组） |
| `defaultValue` | `Array<string \| number>` | 否 | — | 默认值 |
| `onChange` | `(path: Array<string \| number> \| undefined, selectedOptions: CascaderOption[]) => void` | 否 | — | 值变化回调（path 为各级 value，selectedOptions 为对应节点） |
| `searchable` | `boolean` | 否 | `false` | 是否可搜索 |
| `clearable` | `boolean` | 否 | `false` | 是否可清空 |
| `disabled` | `boolean` | 否 | `false` | 是否禁用 |
| `placeholder` | `string` | 否 | `'请选择'` | 占位文案 |
| `placement` | `PopPlacement` | 否 | `'bottom'` | 弹层方向 |
| `size` | `'small' \| 'default' \| 'large'` | 否 | `'default'` | 尺寸 |
| `emptyText` | `React.ReactNode` | 否 | — | 空数据文案 |

### `CascaderOption`

Cascader 级联选择：多级联动列面板，支持面包屑回退与键盘操作

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `value` | `string \| number` | 是 | — | 值 |
| `label` | `React.ReactNode` | 是 | — | 显示标签 |
| `children` | `CascaderOption[]` | 否 | — | 子内容 |
| `disabled` | `boolean` | 否 | — | 禁用状态 |

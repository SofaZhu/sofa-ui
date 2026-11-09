# Checkbox 复选框

[返回 API 索引](README.md) · [源码](../../src/components/checkbox)

单个复选框用 checked 控制。CheckboxGroup 用 value 数组控制选中集合。

## 使用示例

```tsx
import { Checkbox, CheckboxGroup } from 'sofa-ui'

export function Example() {
  return (
    <>
      <Checkbox defaultChecked>同意条款</Checkbox>
      <CheckboxGroup
        defaultValue={['email']}
        options={[{ value: 'email', label: '邮件' }, { value: 'sms', label: '短信' }]}
      />
    </>
  )
}
```

## 运行时 API

### `Checkbox`

```ts
Checkbox(props: CheckboxProps): React.JSX.Element
```

### `CheckboxGroup`

```ts
CheckboxGroup(props: CheckboxGroupProps): React.JSX.Element
```

## 公开类型

### `CheckboxProps`

Checkbox 复选框（含 Group 分组）：支持半选状态与禁用

继承 `Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange' | 'value' | 'size'>`。

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `checked` | `boolean` | 否 | — | 是否选中（受控） |
| `defaultChecked` | `boolean` | 否 | `false` | 默认选中 |
| `indeterminate` | `boolean` | 否 | `false` | 半选状态 |
| `disabled` | `boolean` | 否 | `false` | 是否禁用 |
| `size` | `'small' \| 'default' \| 'large'` | 否 | `'default'` | 尺寸 |
| `value` | `string \| number` | 否 | — | 值（Group 模式回传用） |
| `onChange` | `(checked: boolean, value?: string \| number) => void` | 否 | — | 选中变化回调 |
| `children` | `React.ReactNode` | 否 | — | 子内容 |

### `CheckboxGroupProps`

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `options` | `Array<{ label: React.ReactNode; value: string \| number; disabled?: boolean }>` | 否 | `[]` | 选项列表 |
| `value` | `Array<string \| number>` | 否 | — | 受控值 |
| `defaultValue` | `Array<string \| number>` | 否 | `[]` | 默认值 |
| `onChange` | `(value: Array<string \| number>) => void` | 否 | — | 变化回调 |
| `disabled` | `boolean` | 否 | `false` | 全部禁用 |
| `direction` | `'horizontal' \| 'vertical'` | 否 | `'horizontal'` | 排列方向 |
| `showSelectAll` | `boolean` | 否 | `true` | 显示全选 |
| `className` | `string` | 否 | — | 附加类名 |
| `style` | `React.CSSProperties` | 否 | — | 内联样式 |

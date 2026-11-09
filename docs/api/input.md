# Input / Textarea 输入框

[返回 API 索引](README.md) · [源码](../../src/components/input)

Input 的 ref 指向原生 input，Textarea 的 ref 指向原生 textarea。Textarea 通过 autosize 约束自动高度。

## 使用示例

```tsx
import { Input, Textarea } from 'sofa-ui'

export function Example() {
  return (
    <>
      <Input aria-label="名称" allowClear maxLength={20} showCount />
      <Textarea aria-label="备注" autosize={{ minRows: 2, maxRows: 5 }} />
    </>
  )
}
```

## 运行时 API

### `Input`

```ts
Input(props: InputProps & RefAttributes<HTMLInputElement>): React.ReactNode
```

### `Textarea`

```ts
Textarea(props: TextareaProps & RefAttributes<HTMLTextAreaElement>): React.ReactNode
```

## 公开类型

### `InputProps`

继承 `Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'>`。

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `size` | `InputSize` | 否 | `'default'` | 输入框尺寸 |
| `prefix` | `React.ReactNode` | 否 | — | 前缀插槽 |
| `suffix` | `React.ReactNode` | 否 | — | 后缀插槽 |
| `allowClear` | `boolean` | 否 | `false` | 显示清空按钮（有内容时） |
| `showCount` | `boolean` | 否 | `false` | 是否显示字数统计 |
| `disabled` | `boolean` | 否 | `false` | 禁用状态 |
| `status` | `'error' \| 'warning'` | 否 | — | 状态样式 |
| `value` | `string` | 否 | — | 值 |
| `defaultValue` | `string` | 否 | `''` | 初始化值 |
| `onChange` | `(e: React.ChangeEvent<HTMLInputElement>) => void` | 否 | — | 变化回调 |

### `InputSize`

Input 输入框：支持前后缀插槽、一键清空、字数统计； 支持 prefix/suffix/size 等形态

```ts
type InputSize = 'small' | 'default' | 'large'
```

### `TextareaProps`

Textarea 文本域： 支持自动高度（autosize）与字数统计

继承 `Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'defaultValue'>`。

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `autosize` | `boolean \| { minRows?: number; maxRows?: number }` | 否 | `false` | 是否根据内容自动调整高度 |
| `showCount` | `boolean` | 否 | `false` | 是否显示字数统计 |
| `value` | `string` | 否 | — | 值 |
| `defaultValue` | `string` | 否 | `''` | 初始化值 |

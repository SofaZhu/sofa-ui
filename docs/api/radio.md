# Radio 单选框

[返回 API 索引](README.md) · [源码](../../src/components/radio)

size 作用于按钮形态的 RadioGroup。组内用 value 管理受控选中项，单个 Radio 使用 checked。

## 使用示例

```tsx
import { Radio, RadioGroup } from 'sofa-ui'

export function Example() {
  return (
    <>
      <Radio defaultChecked>默认选中</Radio>
      <RadioGroup
        optionType="button"
        size="large"
        defaultValue="day"
        options={[{ value: 'day', label: '日' }, { value: 'week', label: '周' }]}
      />
    </>
  )
}
```

## 运行时 API

### `Radio`

```ts
Radio(props: RadioProps): React.JSX.Element
```

### `RadioGroup`

```ts
RadioGroup(props: RadioGroupProps): React.JSX.Element
```

## 公开类型

### `RadioProps`

Radio 单选框（含 Group 分组与按钮形态）

继承 `Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'>`。

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `checked` | `boolean` | 否 | — | 是否选中 |
| `defaultChecked` | `boolean` | 否 | `false` | 默认选中 |
| `value` | `string \| number` | 否 | — | 值（Group 模式回传用） |
| `onChange` | `(checked: boolean, value?: string \| number) => void` | 否 | — | 变化回调 |
| `children` | `React.ReactNode` | 否 | — | 子内容 |

### `RadioGroupProps`

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `options` | `Array<{ label: React.ReactNode; value: string \| number; disabled?: boolean }>` | 否 | `[]` | 选项列表 |
| `value` | `string \| number` | 否 | — | 受控值 |
| `defaultValue` | `string \| number` | 否 | — | 默认值 |
| `onChange` | `(value: string \| number) => void` | 否 | — | 变化回调 |
| `disabled` | `boolean` | 否 | `false` | 全部禁用 |
| `optionType` | `'default' \| 'button'` | 否 | `'default'` | 按钮形态 |
| `size` | `'small' \| 'default' \| 'large'` | 否 | `'default'` | 尺寸（按钮形态） |
| `direction` | `'horizontal' \| 'vertical'` | 否 | `'horizontal'` | 排列方向 |
| `className` | `string` | 否 | — | 附加类名 |
| `style` | `React.CSSProperties` | 否 | — | 内联样式 |

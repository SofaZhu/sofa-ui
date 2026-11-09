# TimePicker 时间选择器

[返回 API 索引](README.md) · [源码](../../src/components/time-picker)

value 和 onChange 使用 Date，本地时分秒用于展示。各列步长应传入大于 0 的整数。

## 使用示例

```tsx
import { TimePicker } from 'sofa-ui'

export function Example() {
  return (
    <TimePicker format="HH:mm" minuteStep={15} onChange={console.log} />
  )
}
```

## 运行时 API

### `TimePicker`

```ts
TimePicker(props: TimePickerProps): React.JSX.Element
```

## 公开类型

### `TimePickerProps`

TimePicker 时间选择器： 时分秒三列滚动面板，支持步长与 12 小时制

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `value` | `Date \| null` | 否 | — | 受控时间（日期部分忽略，仅取时分秒） |
| `defaultValue` | `Date \| null` | 否 | — | 默认时间 |
| `onChange` | `(date: Date \| null) => void` | 否 | — | 变化回调 |
| `format` | `string` | 否 | `'HH:mm:ss'` | 展示格式，支持 HH/mm/ss 占位 |
| `hourStep` | `number` | 否 | — | 小时步长 |
| `minuteStep` | `number` | 否 | — | 分钟步长 |
| `secondStep` | `number` | 否 | — | 秒步长 |
| `use12Hours` | `boolean` | 否 | `false` | 12 小时制（AM/PM） |
| `disabled` | `boolean` | 否 | `false` | 禁用 |
| `placeholder` | `string` | 否 | `'请选择时间'` | 占位文案 |
| `onOpenChange` | `(open: boolean) => void` | 否 | — | 面板开合变化回调 |
| `className` | `string` | 否 | — | 附加类名 |
| `style` | `React.CSSProperties` | 否 | — | 内联样式 |

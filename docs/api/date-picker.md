# DatePicker 日期选择器

[返回 API 索引](README.md) · [源码](../../src/components/date-picker)

使用 Date 传入本地日期，清空时回调 null。format 支持 YYYY、MM 和 DD。

## 使用示例

```tsx
import { DatePicker } from 'sofa-ui'

export function Example() {
  return (
    <DatePicker allowClear format="YYYY/MM/DD" minDate={new Date(2026, 0, 1)} onChange={console.log} />
  )
}
```

## 运行时 API

### `DatePicker`

```ts
DatePicker(props: DatePickerProps): React.JSX.Element
```

## 公开类型

### `DatePickerProps`

DatePicker 日期选择器： 日历面板 + 输入框展示，支持格式、禁用范围、清空与键盘导航

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `value` | `Date \| null` | 否 | — | 受控选中日期 |
| `defaultValue` | `Date \| null` | 否 | — | 默认选中日期 |
| `onChange` | `(date: Date \| null) => void` | 否 | — | 选中变化回调 |
| `placeholder` | `string` | 否 | `'请选择日期'` | 占位文案 |
| `disabled` | `boolean` | 否 | `false` | 禁用 |
| `allowClear` | `boolean` | 否 | `false` | 显示清空按钮 |
| `format` | `string` | 否 | `'YYYY-MM-DD'` | 展示格式，支持 YYYY/MM/DD 组合 |
| `minDate` | `Date` | 否 | — | 最小可选日期（含当天） |
| `maxDate` | `Date` | 否 | — | 最大可选日期（含当天） |
| `onOpenChange` | `(open: boolean) => void` | 否 | — | 面板开合变化回调 |
| `className` | `string` | 否 | — | 附加类名 |
| `style` | `React.CSSProperties` | 否 | — | 内联样式 |

# Calendar 日历

[返回 API 索引](README.md) · [源码](../../src/components/calendar)

value 控制选中日期，mode 控制月或年面板。defaultValue 和 defaultMode 只用于初始化。

## 使用示例

```tsx
import { Calendar } from 'sofa-ui'

export function Example() {
  return (
    <Calendar defaultValue={new Date(2026, 10, 9)} fullscreen={false} onChange={console.log} />
  )
}
```

## 运行时 API

### `Calendar`

```ts
Calendar(props: CalendarProps): React.JSX.Element
```

## 公开类型

### `CalendarMode`

Calendar 日历： 月/年双面板 + 日期/月份单元格自定义渲染 + 禁用日期 + 选中回传 周起始为周一，每周 7 列、共 6 周

```ts
type CalendarMode = 'month' | 'year'
```

### `CalendarProps`

继承 `Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'onSelect'>`。

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `value` | `Date` | 否 | — | 受控选中日期 |
| `defaultValue` | `Date` | 否 | — | 默认选中日期 |
| `onChange` | `(date: Date) => void` | 否 | — | 选中变化回调 |
| `fullscreen` | `boolean` | 否 | `true` | 全屏大日历（默认 true），false 为紧凑卡片 |
| `dateCellRender` | `(date: Date) => React.ReactNode` | 否 | — | 日期单元格自定义渲染 |
| `monthCellRender` | `(date: Date) => React.ReactNode` | 否 | — | 年份面板的月份单元格自定义渲染 |
| `disabledDate` | `(date: Date) => boolean` | 否 | — | 禁用日期判断 |
| `onSelect` | `(date: Date) => void` | 否 | — | 点击单元格回调 |
| `mode` | `CalendarMode` | 否 | — | 受控面板模式 |
| `defaultMode` | `CalendarMode` | 否 | `'month'` | 默认面板模式 |
| `onPanelChange` | `(mode: CalendarMode, value: Date) => void` | 否 | — | 面板模式变化回调 |

# Slider 滑块

[返回 API 索引](README.md) · [源码](../../src/components/slider)

单值模式使用数字，range 模式使用两个数值。step 控制可选步长。

## 使用示例

```tsx
import { Slider } from 'sofa-ui'

export function Example() {
  return (
    <Slider range defaultValue={[20, 80]} min={0} max={100} step={5} />
  )
}
```

## 运行时 API

### `Slider`

```ts
Slider(props: SliderProps): React.JSX.Element
```

## 公开类型

### `SliderProps`

Slider 滑块：单值 / 范围双模式，支持步进与刻度

继承 `Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'value'>`。

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `value` | `number \| [number, number]` | 否 | — | 受控值（范围模式为 [min, max]） |
| `defaultValue` | `number \| [number, number]` | 否 | — | 默认值 |
| `min` | `number` | 否 | `0` | 最小值 |
| `max` | `number` | 否 | `100` | 最大值 |
| `step` | `number` | 否 | `1` | 步长 |
| `range` | `boolean` | 否 | `false` | 范围模式 |
| `disabled` | `boolean` | 否 | `false` | 禁用 |
| `showTooltip` | `boolean` | 否 | `true` | 是否显示数值气泡 |
| `marks` | `Record<number, React.ReactNode>` | 否 | — | 刻度标记：{ 位置: 文案 } |
| `onChange` | `(value: number \| [number, number]) => void` | 否 | — | 变化回调（拖动中） |
| `onChangeAfter` | `(value: number \| [number, number]) => void` | 否 | — | 拖动结束回调 |

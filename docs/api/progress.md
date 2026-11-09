# Progress 进度条

[返回 API 索引](README.md) · [源码](../../src/components/progress)

percentage 使用 0 到 100 的数值。通过 type 选择直线、圆环或仪表盘。

## 使用示例

```tsx
import { Progress } from 'sofa-ui'

export function Example() {
  return (
    <Progress type="circle" percentage={75} />
  )
}
```

## 运行时 API

### `Progress`

```ts
Progress(props: ProgressProps): React.JSX.Element
```

## 公开类型

### `ProgressProps`

继承 `Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>`。

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `percentage` | `number` | 否 | `0` | 百分比（0~100） |
| `type` | `'line' \| 'circle' \| 'dashboard'` | 否 | `'line'` | 形态：line 直线 / circle 环形 / dashboard 仪表盘 |
| `status` | `ProgressStatus` | 否 | `'normal'` | 状态 |
| `strokeColor` | `string` | 否 | — | 自定义颜色（十六进制色值或渐变） |
| `strokeWidth` | `number` | 否 | — | 进度条宽度 |
| `showText` | `boolean` | 否 | `true` | 是否显示数值文字 |
| `format` | `(percent: number) => React.ReactNode` | 否 | — | 数值文字模板 |
| `striped` | `boolean` | 否 | `false` | 是否展示为条纹 |
| `animated` | `boolean` | 否 | `false` | 是否有动画 |
| `size` | `number` | 否 | `120` | 圆环直径 |

### `ProgressStatus`

Progress 进度条： 直线 / 环形两种形态，支持状态色与自定义颜色

```ts
type ProgressStatus = 'normal' | 'success' | 'exception' | 'warning'
```

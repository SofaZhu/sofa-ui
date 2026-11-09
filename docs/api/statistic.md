# Statistic 数值展示

[返回 API 索引](README.md) · [源码](../../src/components/statistic)

precision 控制小数位数。formatStatisticValue 可在组件外格式化显示值。

## 使用示例

```tsx
import { Statistic } from 'sofa-ui'

export function Example() {
  return (
    <Statistic title="账户余额" value={1842.75} precision={2} prefix="¥" />
  )
}
```

## 运行时 API

### `Statistic`

```ts
Statistic(props: StatisticProps): React.JSX.Element
```

### `formatStatisticValue`

输出格式化后的数值文本

```ts
formatStatisticValue(value: string | number, options?: { precision?: number; groupSeparator?: string; formatter?: (v: number | string) => string; }): string
```

## 公开类型

### `StatisticProps`

Statistic 统计数值： 纯展示类数字组件，支持精度、千分位、前后缀、 自定义格式化与加载态

继承 `Omit<React.HTMLAttributes<HTMLDivElement>, 'title' | 'prefix'>`。

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `title` | `React.ReactNode` | 否 | — | 标题 |
| `value` | `number \| string` | 是 | — | 数值或字符串 |
| `precision` | `number` | 否 | — | 小数位精度 |
| `prefix` | `React.ReactNode` | 否 | — | 数值前缀 |
| `suffix` | `React.ReactNode` | 否 | — | 数值后缀 |
| `groupSeparator` | `string` | 否 | `','` | 千分位分隔符（默认逗号） |
| `loading` | `boolean` | 否 | `false` | 加载中（替换数值为加载指示） |
| `formatter` | `(value: number \| string) => string` | 否 | — | 自定义格式化，优先级最高 |
| `color` | `'default' \| 'success' \| 'warning' \| 'error'` | 否 | `'default'` | 数值语义色 |

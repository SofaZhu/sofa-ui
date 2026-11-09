# Rate 评分

[返回 API 索引](README.md) · [源码](../../src/components/rate)

allowHalf 开启半星。value 用于受控评分，defaultValue 用于初始化。

## 使用示例

```tsx
import { Rate } from 'sofa-ui'

export function Example() {
  return (
    <Rate allowHalf defaultValue={3.5} onChange={console.log} />
  )
}
```

## 运行时 API

### `Rate`

```ts
Rate(props: RateProps): React.JSX.Element
```

## 公开类型

### `RateProps`

Rate 评分：支持半星、禁用与自定义字符

继承 `Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>`。

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `value` | `number` | 否 | — | 受控评分值 |
| `defaultValue` | `number` | 否 | `0` | 默认值 |
| `count` | `number` | 否 | `5` | 总星数 |
| `allowHalf` | `boolean` | 否 | `false` | 是否允许半星 |
| `allowClear` | `boolean` | 否 | `true` | 是否可清除（再次点击同分值归零） |
| `disabled` | `boolean` | 否 | `false` | 禁用 |
| `onChange` | `(score: number) => void` | 否 | — | 变化回调 |
| `character` | `React.ReactNode` | 否 | `null` | 自定义评分字符 |
| `size` | `number` | 否 | `24` | 字符大小 |

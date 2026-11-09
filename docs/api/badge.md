# Badge 徽标

[返回 API 索引](README.md) · [源码](../../src/components/badge)

数值徽标可以搭配子元素使用。通过 overflowCount 控制超过阈值时的显示。

## 使用示例

```tsx
import { Badge } from 'sofa-ui'

export function Example() {
  return (
    <Badge count={8}><span>未读消息</span></Badge>
  )
}
```

## 运行时 API

### `Badge`

```ts
Badge(props: BadgeProps & RefAttributes<HTMLSpanElement>): React.ReactNode
```

## 公开类型

### `BadgeProps`

继承 `Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'>`。

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `count` | `React.ReactNode` | 否 | — | 显示的数字内容 |
| `overflowCount` | `number` | 否 | `99` | 数字超出 overflowCount 时显示为 「overflowCount+」 |
| `showZero` | `boolean` | 否 | `false` | 数值为 0 时是否显示 |
| `dot` | `boolean` | 否 | `false` | 小圆点模式 |
| `status` | `BadgeStatus` | 否 | — | 状态点模式（与 dot 互斥，dot 优先） |
| `color` | `string` | 否 | — | 自定义角标颜色（十六进制色值） |
| `offset` | `[number, number]` | 否 | — | 角标偏移量 |
| `children` | `React.ReactNode` | 否 | — | 内容（角标所依附的节点） |
| `title` | `string` | 否 | — | 用户鼠标悬停时角标的文字提示 |

### `BadgeStatus`

Badge 徽标：数字角标 / 状态点 / 自定义内容三种形态

```ts
type BadgeStatus = 'success' | 'warning' | 'error' | 'info' | 'primary' | 'default'
```

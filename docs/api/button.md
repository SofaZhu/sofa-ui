# Button 按钮

[返回 API 索引](README.md) · [源码](../../src/components/button)

表单提交使用 htmlType=submit。loading 和 disabled 都会阻止按钮点击。

## 使用示例

```tsx
import { Button } from 'sofa-ui'

export function Example() {
  return (
    <Button type="primary" onClick={() => console.log('保存')}>保存</Button>
  )
}
```

## 运行时 API

### `Button`

```ts
Button(props: ButtonProps & RefAttributes<HTMLButtonElement>): React.ReactNode
```

## 公开类型

### `ButtonProps`

继承 `Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'color'>`。

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `type` | `ButtonType` | 否 | `'default'` | 按钮类型，决定视觉层级 |
| `size` | `ButtonSize` | 否 | `'default'` | 尺寸 |
| `danger` | `boolean` | 否 | `false` | 危险按钮，使用红色语义色 |
| `ghost` | `boolean` | 否 | `false` | 幽灵按钮：透明背景 + 描边 |
| `round` | `boolean` | 否 | `false` | 圆角胶囊形态 |
| `circle` | `boolean` | 否 | `false` | 圆形按钮 |
| `block` | `boolean` | 否 | `false` | 撑满父容器宽度 |
| `loading` | `boolean` | 否 | `false` | 加载中状态 |
| `disabled` | `boolean` | 否 | `false` | 禁用状态 |
| `icon` | `React.ReactNode` | 否 | — | 前缀图标（Icon 组件或任意 ReactNode） |
| `htmlType` | `'button' \| 'submit' \| 'reset'` | 否 | `'button'` | 原生 type |
| `wave` | `boolean` | 否 | `true` | 点击时的波纹效果 |

### `ButtonType`

Button 按钮 五种类型（primary/default/dashed/text/link）， 尺寸阶梯（large/default/small）与圆角形态（round/circle）

```ts
type ButtonType = 'primary' | 'default' | 'dashed' | 'text' | 'link'
```

### `ButtonSize`

```ts
type ButtonSize = 'small' | 'default' | 'large'
```

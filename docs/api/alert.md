# Alert 警告提示

[返回 API 索引](README.md) · [源码](../../src/components/alert)

启用 closable 后可以关闭提示。使用 type 区分不同语义状态，使用 description 补充细节。

## 使用示例

```tsx
import { Alert } from 'sofa-ui'

export function Example() {
  return (
    <Alert type="warning" title="即将维护" description="请提前保存进度。" closable />
  )
}
```

## 运行时 API

### `Alert`

```ts
Alert(props: AlertProps): React.JSX.Element | null
```

## 公开类型

### `AlertProps`

继承 `Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>`。

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `title` | `React.ReactNode` | 否 | — | 标题 |
| `description` | `React.ReactNode` | 否 | — | 描述内容 |
| `type` | `AlertType` | 否 | `'info'` | 语义类型 |
| `showIcon` | `boolean` | 否 | `false` | 显示图标 |
| `closable` | `boolean` | 否 | `false` | 可关闭 |
| `closeIcon` | `React.ReactNode` | 否 | — | 自定义关闭图标 |
| `onClose` | `(e: React.MouseEvent) => void` | 否 | — | 关闭回调 |
| `center` | `boolean` | 否 | `false` | 内容居中 |
| `banner` | `boolean` | 否 | `false` | 通栏模式（去掉圆角） |

### `AlertType`

Alert 警告提示： 四种语义类型 + 标题/描述 + 可关闭 + 居中展示

```ts
type AlertType = 'success' | 'info' | 'warning' | 'error'
```

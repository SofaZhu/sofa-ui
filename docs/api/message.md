# message 全局消息

[返回 API 索引](README.md) · [源码](../../src/components/message)

在浏览器中调用。展示方法返回关闭函数，可直接调用或交给 message.close。duration 使用毫秒，0 表示不自动关闭。

## 使用示例

```tsx
import { Button, message } from 'sofa-ui'

export function Example() {
  return (
    <Button onClick={() => message.success('保存成功')}>保存</Button>
  )
}
```

## 运行时 API

### `message`

```ts
message.success(content: React.ReactNode, options?: MessageOptions): () => void
message.error(content: React.ReactNode, options?: MessageOptions): () => void
message.warning(content: React.ReactNode, options?: MessageOptions): () => void
message.info(content: React.ReactNode, options?: MessageOptions): () => void
message.loading(content: React.ReactNode, options?: MessageOptions): () => void
message.close(closeFn: () => void): void
```

## 公开类型

### `MessageOptions`

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `duration` | `number` | 否 | `3000` | 展示时长（毫秒），0 为不自动关闭 |
| `icon` | `React.ReactNode` | 否 | — | 自定义图标 |
| `onClose` | `() => void` | 否 | — | 关闭回调 |
| `position` | `'top' \| 'topLeft' \| 'topRight' \| 'bottom'` | 否 | `'top'` | 位置 |
| `closable` | `boolean` | 否 | — | 可关闭 |

### `MessageType`

Message 全局消息提示： 命令式调用 message.success / error / warning / info / loading 单例容器挂载到 body，支持自动关闭与手动关闭

```ts
type MessageType = 'success' | 'error' | 'warning' | 'info' | 'loading'
```

# notification 通知

[返回 API 索引](README.md) · [源码](../../src/components/notification)

在浏览器中调用。duration 使用毫秒，0 表示常驻。同一位置独立堆叠，destroy 清空全部通知。

## 使用示例

```tsx
import { Button, notification } from 'sofa-ui'

export function Example() {
  return (
    <Button onClick={() => notification.info({ title: '更新完成', description: '可以继续编辑。', placement: 'bottomRight' })}>
      查看通知
    </Button>
  )
}
```

## 运行时 API

### `notification`

```ts
notification.success(options: NotificationOptions): void
notification.error(options: NotificationOptions): void
notification.warning(options: NotificationOptions): void
notification.info(options: NotificationOptions): void
notification.destroy(): void
```

## 公开类型

### `NotificationOptions`

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `title` | `React.ReactNode` | 是 | — | 标题 |
| `description` | `React.ReactNode` | 否 | — | 描述 |
| `duration` | `number` | 否 | `4500` | 展示时长（毫秒），0 为不自动关闭 |
| `icon` | `React.ReactNode` | 否 | — | 自定义图标 |
| `onClose` | `() => void` | 否 | — | 关闭回调 |
| `placement` | `'topRight' \| 'topLeft' \| 'bottomRight' \| 'bottomLeft'` | 否 | `'topRight'` | 定位 |
| `closable` | `boolean` | 否 | `true` | 显示关闭按钮 |
| `footer` | `React.ReactNode` | 否 | — | 底部操作区 |

### `NotificationType`

Notification 通知提醒： 右上角滑入的通知卡片，支持标题 + 描述 + 自定义图标，可手动 / 自动关闭

```ts
type NotificationType = 'success' | 'error' | 'warning' | 'info'
```

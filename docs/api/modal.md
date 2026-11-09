# Modal 对话框

[返回 API 索引](README.md) · [源码](../../src/components/modal)

声明式 Modal 由 open 控制。confirm 可在事件处理中调用并自行挂载确认框。

## 使用示例

```tsx
import { useState } from 'react'
import { Button, Modal, confirm } from 'sofa-ui'

export function Example() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>打开详情</Button>
      <Modal open={open} title="详情" onCancel={() => setOpen(false)} onOk={() => setOpen(false)}>
        正文内容
      </Modal>
      <Button danger onClick={() => confirm({ title: '删除草稿？', onOk: () => console.log('删除') })}>
        删除
      </Button>
    </>
  )
}
```

## 运行时 API

### `Modal`

```ts
Modal(props: ModalProps): React.ReactPortal | null
```

### `confirm`

```ts
confirm(options: ConfirmOptions): void
```

## 公开类型

### `ModalProps`

Modal 对话框： 支持遮罩、键盘关闭、确定按钮加载态、自定义富文本标题与底部 同时提供命令式 confirm 方法

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `open` | `boolean` | 否 | — | 打开状态 |
| `defaultOpen` | `boolean` | 否 | `false` | 默认打开 |
| `onOpenChange` | `(open: boolean) => void` | 否 | — | 打开 / 关闭回调 |
| `title` | `React.ReactNode` | 否 | — | 标题 |
| `header` | `React.ReactNode` | 否 | — | 富文本页头（替代 title） |
| `children` | `React.ReactNode` | 否 | — | 内容 |
| `footer` | `React.ReactNode \| null` | 否 | — | 自定义底部 |
| `okText` | `string` | 否 | `'确定'` | 确认按钮文字 |
| `cancelText` | `string` | 否 | `'取消'` | 取消按钮文字 |
| `onOk` | `() => void \| Promise<void>` | 否 | — | 确认回调（返回 Promise 时可等待后关闭） |
| `onCancel` | `() => void` | 否 | — | 取消 / 关闭回调 |
| `confirmLoading` | `boolean` | 否 | `false` | 确认按钮加载态 |
| `width` | `number \| string` | 否 | `520` | 宽度 |
| `maskClosable` | `boolean` | 否 | `true` | 点击遮罩关闭 |
| `closable` | `boolean` | 否 | `true` | 显示关闭按钮 |
| `lockScroll` | `boolean` | 否 | `true` | 打开时是否锁定页面滚动 |
| `className` | `string` | 否 | — | 对话框类名 |
| `style` | `React.CSSProperties` | 否 | — | 对话框样式 |
| `destroyOnClose` | `boolean` | 否 | `false` | 关闭后销毁内容 |

### `ConfirmOptions`

Modal.confirm 命令式确认框（复用 Modal 渲染到 body）

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `title` | `React.ReactNode` | 否 | — | 标题 |
| `content` | `React.ReactNode` | 否 | — | — |
| `okText` | `string` | 否 | — | — |
| `cancelText` | `string` | 否 | — | — |
| `onOk` | `() => void \| Promise<void>` | 否 | — | — |
| `onCancel` | `() => void` | 否 | — | — |
| `type` | `'confirm' \| 'warning' \| 'error' \| 'info'` | 否 | — | 类型 |
| `width` | `number` | 否 | — | 宽度 |

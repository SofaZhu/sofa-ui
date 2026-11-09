# Popover / Popconfirm 气泡卡片

[返回 API 索引](README.md) · [源码](../../src/components/popover)

Popover 可承载自定义内容。Popconfirm 提供确认和取消动作，可用 onConfirm 与 onCancel 处理。 当前实现会在点击外部时关闭点击触发的气泡，clickOutsideClosable 尚未生效。

## 使用示例

```tsx
import { Button, Popover, Popconfirm } from 'sofa-ui'

export function Example() {
  return (
    <>
      <Popover title="说明" content="这里可以放置交互内容"><Button>查看说明</Button></Popover>
      <Popconfirm title="确定删除？" danger onConfirm={() => console.log('删除')}>
        <Button danger>删除</Button>
      </Popconfirm>
    </>
  )
}
```

## 运行时 API

### `Popover`

```ts
Popover(props: PopoverProps): React.JSX.Element
```

### `Popconfirm`

```ts
Popconfirm(props: PopconfirmProps): React.JSX.Element
```

## 公开类型

### `PopoverProps`

Popover 气泡卡片：带标题与内容区域，click 触发，可承载交互内容

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `title` | `React.ReactNode` | 否 | — | 标题 |
| `content` | `React.ReactNode` | 是 | — | 内容 |
| `placement` | `PopPlacement` | 否 | `'top'` | 气泡方向 |
| `trigger` | `PopTrigger` | 否 | `'click'` | 触发方式 |
| `open` | `boolean` | 否 | — | 受控打开 |
| `defaultOpen` | `boolean` | 否 | `false` | 默认打开 |
| `onOpenChange` | `(open: boolean) => void` | 否 | — | 打开变化回调 |
| `disabled` | `boolean` | 否 | `false` | 禁用 |
| `children` | `React.ReactNode` | 否 | — | 包裹内容 |
| `className` | `string` | 否 | — | 附加类名 |
| `popupClassName` | `string` | 否 | — | — |
| `popupStyle` | `React.CSSProperties` | 否 | — | — |
| `clickOutsideClosable` | `boolean` | 否 | — | 点击外部是否关闭 |
| `offset` | `number` | 否 | `8` | 与锚点的距离（像素） |

### `PopconfirmProps`

继承 `Omit<PopoverProps, 'content' | 'title'>`。

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `title` | `React.ReactNode` | 是 | — | 确认提示文案 |
| `description` | `React.ReactNode` | 否 | — | 描述内容（可选） |
| `okText` | `string` | 否 | `'确定'` | 确认按钮文字 |
| `cancelText` | `string` | 否 | `'取消'` | 取消按钮文字 |
| `onConfirm` | `(e: React.MouseEvent) => void` | 否 | — | 确认回调 |
| `onCancel` | `(e: React.MouseEvent) => void` | 否 | — | 取消回调 |
| `okLoading` | `boolean` | 否 | `false` | 确认按钮加载态 |
| `danger` | `boolean` | 否 | `false` | 危险确认（按钮为红色） |

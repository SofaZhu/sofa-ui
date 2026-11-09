# 浮层定位类型

[返回 API 索引](README.md) · [源码](../../src/hooks/usePop.ts)

Tooltip、Popover、Dropdown 等浮层共用这些类型。具体组件支持的触发模式以对应组件 API 为准。

## 使用示例

```tsx
import { Tooltip, type PopPlacement, type PopTrigger } from 'sofa-ui'

export function Example() {
  const placement: PopPlacement = 'bottomRight'
  const trigger: PopTrigger = 'focus'

  return <Tooltip title="操作说明" placement={placement} trigger={trigger}><button>帮助</button></Tooltip>
}
```

## 公开类型

### `PopPlacement`

弹层定位 hook，服务 Tooltip / Popover / Popconfirm / Select 下拉等浮层组件： - 支持 12 个方向（四方位 + 八个斜向） - 打开时测量锚点与浮层尺寸，贴近视口边缘时自动翻转 - 支持 hover（含进出延时）/ click / focus 三种触发方式 - 点击外部、ESC 关闭

```ts
type PopPlacement =
  | 'top'
  | 'topLeft'
  | 'topRight'
  | 'bottom'
  | 'bottomLeft'
  | 'bottomRight'
  | 'left'
  | 'leftTop'
  | 'leftBottom'
  | 'right'
  | 'rightTop'
  | 'rightBottom'
```

### `PopTrigger`

```ts
type PopTrigger = 'hover' | 'click' | 'focus'
```

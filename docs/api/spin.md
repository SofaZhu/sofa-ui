# Spin 加载中

[返回 API 索引](README.md) · [源码](../../src/components/spin)

可单独显示加载指示器，也可包裹内容，通过 spinning 控制加载状态。

## 使用示例

```tsx
import { Spin } from 'sofa-ui'

export function Example() {
  return (
    <Spin spinning tip="正在加载"><div>列表区域</div></Spin>
  )
}
```

## 运行时 API

### `Spin`

```ts
Spin(props: SpinProps): React.JSX.Element | null
```

## 公开类型

### `SpinProps`

Spin 加载中： 容器包裹时显示遮罩加载层，可全屏使用

继承 `Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>`。

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `spinning` | `boolean` | 否 | `true` | 是否加载中 |
| `size` | `'small' \| 'default' \| 'large'` | 否 | `'default'` | 尺寸 |
| `tip` | `React.ReactNode` | 否 | — | 加载文案 |
| `fullscreen` | `boolean` | 否 | `false` | 是否展示为全屏遮罩（挂载到 body） |
| `children` | `React.ReactNode` | 否 | — | 子内容 |

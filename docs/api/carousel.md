# Carousel 走马灯

[返回 API 索引](README.md) · [源码](../../src/components/carousel)

每个直接子节点对应一张幻灯片。可用 autoplay 自动轮播，或通过 onChange 读取索引变化。

## 使用示例

```tsx
import { Carousel } from 'sofa-ui'

export function Example() {
  return (
    <Carousel autoplay>
      <div>第一张</div>
      <div>第二张</div>
    </Carousel>
  )
}
```

## 运行时 API

### `Carousel`

```ts
Carousel(props: CarouselProps): React.JSX.Element
```

## 公开类型

### `CarouselProps`

Carousel 走马灯： 自动播放（悬停暂停）+ 指示点 + 左右箭头 + 滚动/淡入淡出效果 + 无限循环 + 键盘切换

继承 `Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'children'>`。

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `autoplay` | `boolean` | 否 | `false` | 是否自动播放 |
| `interval` | `number` | 否 | `3000` | 自动播放间隔（毫秒） |
| `dots` | `boolean \| { position?: 'top' \| 'bottom' }` | 否 | `true` | 指示点配置：false 隐藏，或 { position: 'top' \| 'bottom' } |
| `arrows` | `boolean` | 否 | `true` | 是否显示左右箭头 |
| `effect` | `'scroll' \| 'fade'` | 否 | `'scroll'` | 切换效果：scroll 横向滑动 / fade 淡入淡出 |
| `infinite` | `boolean` | 否 | `false` | 是否无限循环 |
| `onChange` | `(current: number) => void` | 否 | — | 当前项变化回调（从 0 计） |
| `children` | `React.ReactNode` | 否 | — | 幻灯片内容（每个子元素一张） |

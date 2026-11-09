# Image 图片

[返回 API 索引](README.md) · [源码](../../src/components/image)

preview 启用点击预览。alt 用于说明图片内容，图片加载失败时可提供回退图。

## 使用示例

```tsx
import { Image } from 'sofa-ui'

export function Example() {
  return (
    <Image src="/images/cover.jpg" alt="封面" preview width={240} />
  )
}
```

## 运行时 API

### `Image`

```ts
Image(props: ImageProps): React.JSX.Element
```

## 公开类型

### `ImageProps`

继承 `Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'onClick' | 'onError'>`。

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `src` | `string` | 是 | — | 图片地址 |
| `preview` | `boolean` | 否 | `true` | 是否可点击预览（默认 true） |
| `fallback` | `React.ReactNode` | 否 | — | 加载失败占位内容 |
| `placeholder` | `React.ReactNode` | 否 | — | 加载中占位内容 |
| `previewSrc` | `string` | 否 | — | 预览使用的大图地址（默认与 src 相同） |
| `onPreviewOpen` | `() => void` | 否 | — | 预览打开回调 |
| `onPreviewClose` | `() => void` | 否 | — | 预览关闭回调 |

### `ImageStatus`

Image 图片： 点击全屏预览（缩放 0.5~3 倍 / 旋转 90°）/ 加载占位 / 失败回退 / 独立预览图源 预览层固定定位 + 遮罩，ESC 或点击遮罩关闭

```ts
type ImageStatus = 'loading' | 'loaded' | 'error'
```

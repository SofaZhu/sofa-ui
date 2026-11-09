# QRCode 二维码

[返回 API 索引](README.md) · [源码](../../src/components/qrcode)

encodeQR 返回模块矩阵和版本，可用于自定义渲染。qrToDataURL 在浏览器中通过 Canvas 生成图片。

## 使用示例

```tsx
import { QRCode } from 'sofa-ui'

export function Example() {
  return (
    <QRCode value="https://example.com" level="M" size={128} />
  )
}
```

## 运行时 API

### `QRCode`

```ts
QRCode(props: QRCodeProps): React.JSX.Element
```

### `qrToDataURL`

生成 dataURL（供导出图片用）

```ts
qrToDataURL(value: string, options?: QRCodeImageOptions): string
```

### `encodeQR`

编码二维码，返回布尔矩阵（true=暗）与版本

```ts
encodeQR(text: string, level?: QRCodeLevel): { modules: boolean[][]; version: number; }
```

## 公开类型

### `QRCodeProps`

继承 `React.HTMLAttributes<HTMLDivElement>`。

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `value` | `string` | 是 | — | 编码内容 |
| `size` | `number` | 否 | `128` | 尺寸（px） |
| `color` | `string` | 否 | `'#000000'` | 前景色 |
| `bgColor` | `string` | 否 | `'#ffffff'` | 背景色 |
| `level` | `QRCodeLevel` | 否 | `'M'` | 容错级别 |
| `errorLevel` | `QRCodeLevel` | 否 | — | 容错级别别名 |
| `icon` | `React.ReactNode` | 否 | — | 中心图标（不影响解码的装饰） |
| `iconSize` | `number` | 否 | — | 中心图标尺寸 |
| `muted` | `never` | 否 | — | — |

### `QRCodeLevel`

QRCode 组件：canvas 自绘二维码 - 完整实现 QR 编码（GF(256) 里德-所罗门纠错、掩码优化、格式/版本信息） - 支持版本 1~10、字节模式（UTF-8）、容错级别 L/M/Q/H

```ts
type QRCodeLevel = 'L' | 'M' | 'Q' | 'H'
```

### `QRCodeImageOptions`

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `size` | `number` | 否 | — | 尺寸 |
| `color` | `string` | 否 | — | 颜色 |
| `bgColor` | `string` | 否 | — | — |
| `level` | `QRCodeLevel` | 否 | — | — |

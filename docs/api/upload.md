# Upload 上传

[返回 API 索引](README.md) · [源码](../../src/components/upload)

使用 action 指定上传地址。省略时只回传本地文件列表，不发送请求。beforeUpload 可拒绝文件，或异步返回替换文件。

## 使用示例

```tsx
import { Upload } from 'sofa-ui'

export function Example() {
  return (
    <Upload multiple accept="image/*" onChange={console.log} />
  )
}
```

## 运行时 API

### `Upload`

```ts
Upload(props: UploadProps): React.JSX.Element
```

## 公开类型

### `UploadProps`

继承 `Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'onError' | 'onProgress'>`。

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `fileList` | `UploadFile[]` | 否 | — | 受控文件列表 |
| `defaultFileList` | `UploadFile[]` | 否 | — | 默认文件列表 |
| `onChange` | `(fileList: UploadFile[], file: UploadFile) => void` | 否 | — | 列表变化回调（每次增删或状态变化触发） |
| `action` | `string` | 否 | — | 上传地址（为空时仅本地回传，不发请求） |
| `headers` | `Record<string, string>` | 否 | — | 上传请求头 |
| `onProgress` | `(percent: number, file: UploadFile) => void` | 否 | — | 上传进度回调 |
| `onSuccess` | `(file: UploadFile) => void` | 否 | — | 上传成功回调 |
| `onError` | `(file: UploadFile) => void` | 否 | — | 上传失败回调 |
| `beforeUpload` | `(file: File) => boolean \| Promise<File \| boolean>` | 否 | — | 上传前钩子：返回 false 拒绝，返回 File 替换原文件，支持 Promise |
| `accept` | `string` | 否 | — | 允许的文件类型 |
| `multiple` | `boolean` | 否 | `false` | 多选 |
| `maxCount` | `number` | 否 | — | 最大文件数，超出拒绝并提示 |
| `disabled` | `boolean` | 否 | `false` | 禁用 |
| `listType` | `'text' \| 'picture'` | 否 | `'text'` | 列表形态：text 文本 / picture 缩略图 |
| `drag` | `boolean` | 否 | `false` | 拖拽上传模式 |
| `onRemove` | `(file: UploadFile) => void` | 否 | — | 移除文件回调 |
| `children` | `React.ReactNode` | 否 | — | 自定义触发区内容 |
| `className` | `string` | 否 | — | 附加类名 |
| `style` | `React.CSSProperties` | 否 | — | 内联样式 |

### `UploadFile`

Upload 文件上传： 受控文件列表、multipart 上传、进度、拖拽、缩略图、限数与失败重试

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `uid` | `string` | 是 | — | 唯一标识 |
| `name` | `string` | 是 | — | 文件名 |
| `size` | `number` | 否 | — | 文件大小（字节） |
| `status` | `'uploading' \| 'done' \| 'error'` | 否 | — | 上传状态 |
| `percent` | `number` | 否 | — | 上传进度（0-100） |
| `url` | `string` | 否 | — | 文件地址（如服务端返回） |

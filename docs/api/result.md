# Result 结果页

[返回 API 索引](README.md) · [源码](../../src/components/result)

使用 status 选择语义或错误码。extra 适合放返回、重试等操作。

## 使用示例

```tsx
import { Button, Result } from 'sofa-ui'

export function Example() {
  return (
    <Result status="success" title="操作成功" subTitle="内容已保存" extra={<Button>返回</Button>} />
  )
}
```

## 运行时 API

### `Result`

```ts
Result(props: ResultProps): React.JSX.Element
```

## 公开类型

### `ResultProps`

继承 `Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>`。

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `status` | `ResultStatus` | 否 | `'info'` | 状态（默认 info） |
| `title` | `React.ReactNode` | 否 | — | 标题 |
| `subTitle` | `React.ReactNode` | 否 | — | 副标题 |
| `icon` | `React.ReactNode` | 否 | — | 自定义图标（覆盖默认图标） |
| `extra` | `React.ReactNode` | 否 | — | 底部操作区 |

### `ResultStatus`

Result 结果页： 用于操作反馈与异常场景（成功/错误/警告/信息及 404/403/500）， 支持自定义图标与底部操作区

```ts
type ResultStatus = 'success' | 'error' | 'info' | 'warning' | '404' | '403' | '500'
```

# Breadcrumb 面包屑

[返回 API 索引](README.md) · [源码](../../src/components/breadcrumb)

最后一项代表当前位置，即使配置了 href，也会以当前页文本呈现。

## 使用示例

```tsx
import { Breadcrumb } from 'sofa-ui'

export function Example() {
  return (
    <Breadcrumb items={[{ title: '首页', href: '/' }, { title: '组件' }]} />
  )
}
```

## 运行时 API

### `Breadcrumb`

```ts
Breadcrumb(props: BreadcrumbProps & RefAttributes<HTMLElement>): React.ReactNode
```

## 公开类型

### `BreadcrumbProps`

继承 `Omit<React.HTMLAttributes<HTMLElement>, 'children'>`。

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `items` | `BreadcrumbItem[]` | 否 | `[]` | 面包屑层级 |
| `separator` | `React.ReactNode` | 否 | `'/'` | 自定义分隔符 |
| `children` | `React.ReactNode` | 否 | — | 子节点方式（替代 items） |

### `BreadcrumbItem`

Breadcrumb 面包屑：层级导航，支持自定义分隔符

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `title` | `React.ReactNode` | 是 | — | 文字或自定义内容 |
| `href` | `string` | 否 | — | 链接 |
| `icon` | `React.ReactNode` | 否 | — | 图标 |

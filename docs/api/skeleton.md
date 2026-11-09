# Skeleton 骨架屏

[返回 API 索引](README.md) · [源码](../../src/components/skeleton)

按需开启头像、标题、段落和图片骨架。loading 结束后展示 children。

## 使用示例

```tsx
import { Skeleton } from 'sofa-ui'

export function Example() {
  return (
    <Skeleton active loading avatar paragraph={{ rows: 3 }}><article>加载完毕</article></Skeleton>
  )
}
```

## 运行时 API

### `Skeleton`

```ts
Skeleton(props: SkeletonProps): React.JSX.Element
```

## 公开类型

### `SkeletonAvatarProps`

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `size` | `number \| 'small' \| 'default' \| 'large'` | 否 | — | 头像尺寸 |
| `shape` | `'circle' \| 'square'` | 否 | — | 头像形状 |

### `SkeletonImageProps`

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `size` | `number \| 'small' \| 'default' \| 'large'` | 否 | — | 图片占位尺寸 |
| `shape` | `'circle' \| 'square'` | 否 | — | 图片形状 |

### `SkeletonParagraphProps`

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `rows` | `number` | 否 | — | 段落行数 |
| `width` | `number \| string \| Array<number \| string>` | 否 | — | 段落宽度：单值或逐行宽度数组 |

### `SkeletonProps`

继承 `Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>`。

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `loading` | `boolean` | 否 | `true` | false 时渲染 children 替代骨架 |
| `active` | `boolean` | 否 | `false` | 开启流光动画 |
| `title` | `boolean \| SkeletonTitleProps` | 否 | `true` | 标题占位：布尔或配置对象 |
| `paragraph` | `boolean \| SkeletonParagraphProps` | 否 | `{ rows: 3 }` | 段落占位：布尔或配置对象 |
| `avatar` | `boolean \| SkeletonAvatarProps` | 否 | `false` | 头像占位：布尔或配置对象 |
| `image` | `boolean \| SkeletonImageProps` | 否 | `false` | 图片占位：布尔或配置对象 |
| `children` | `React.ReactNode` | 否 | — | 子内容（loading 为 false 时展示） |

### `SkeletonTitleProps`

Skeleton 骨架屏： 加载占位组件，支持标题、段落、头像、图片占位与流光动画； loading 为 false 时直接渲染子内容

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `width` | `number \| string` | 否 | — | 标题宽度 |

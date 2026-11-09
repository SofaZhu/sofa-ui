# Avatar 头像

[返回 API 索引](README.md) · [源码](../../src/components/avatar)

加载失败时优先显示 fallback，其次使用 icon 或文字。Avatar.Group 与 AvatarGroup 指向同一分组组件。

## 使用示例

```tsx
import { Avatar, AvatarGroup } from 'sofa-ui'

export function Example() {
  return (
    <AvatarGroup maxCount={2}>
      <Avatar>林</Avatar>
      <Avatar>陈</Avatar>
      <Avatar>李</Avatar>
    </AvatarGroup>
  )
}
```

## 运行时 API

### `Avatar`

```ts
Avatar(props: AvatarProps): React.JSX.Element
Avatar.Group(props: AvatarGroupProps): React.JSX.Element
```

### `AvatarGroup`

```ts
AvatarGroup(props: AvatarGroupProps): React.JSX.Element
```

## 公开类型

### `AvatarProps`

继承 `Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'>`。

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `size` | `AvatarSize` | 否 | `'default'` | 尺寸：数字像素或预设档位 |
| `shape` | `'circle' \| 'square'` | 否 | `'circle'` | 形状 |
| `src` | `string` | 否 | — | 图片地址 |
| `srcSet` | `string` | 否 | — | 图片 srcSet |
| `icon` | `React.ReactNode` | 否 | — | 图标（无图片或加载失败时展示） |
| `children` | `React.ReactNode` | 否 | — | 文字内容（字符串时缩略为前 2 字） |
| `alt` | `string` | 否 | `''` | 图片 alt |
| `fallback` | `React.ReactNode` | 否 | — | 加载失败回退内容（优先于 icon/children） |

### `AvatarGroupProps`

继承 `Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>`。

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `maxCount` | `number` | 否 | `5` | 最大显示数量，超出折叠为 +N |
| `size` | `AvatarSize` | 否 | — | 默认尺寸（子头像未指定时生效） |
| `shape` | `'circle' \| 'square'` | 否 | — | 默认形状（子头像未指定时生效） |
| `children` | `React.ReactNode` | 否 | — | 子内容 |

### `AvatarSize`

Avatar 头像： 尺寸/形状 + 图片加载失败回退 + 文字缩略 + 图标 Avatar.Group 横向叠放，超出 maxCount 折叠为 +N

```ts
type AvatarSize = number | 'small' | 'default' | 'large'
```

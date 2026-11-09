# Layout 布局

[返回 API 索引](README.md) · [源码](../../src/components/layout)

Layout 可以直接渲染，也保留 Layout.Header、Layout.Sider、Layout.Content、Layout.Footer。直接子级含侧栏时自动切换横向布局。

## 使用示例

```tsx
import { Layout, LayoutHeader, LayoutSider, LayoutContent, LayoutFooter } from 'sofa-ui'

export function Example() {
  return (
    <Layout>
      <LayoutHeader>页眉</LayoutHeader>
      <Layout hasSider>
        <LayoutSider collapsible>侧栏</LayoutSider>
        <LayoutContent>正文</LayoutContent>
      </Layout>
      <LayoutFooter>页脚</LayoutFooter>
    </Layout>
  )
}
```

## 运行时 API

### `Layout`

```ts
Layout(props: LayoutProps): React.JSX.Element
Layout.Header(props: React.HTMLAttributes<HTMLElement>): React.JSX.Element
Layout.Sider(props: SiderProps): React.JSX.Element
Layout.Content(props: React.HTMLAttributes<HTMLElement>): React.JSX.Element
Layout.Footer(props: React.HTMLAttributes<HTMLElement>): React.JSX.Element
```

### `LayoutHeader`

```ts
LayoutHeader(props: React.HTMLAttributes<HTMLElement>): React.JSX.Element
```

### `LayoutFooter`

```ts
LayoutFooter(props: React.HTMLAttributes<HTMLElement>): React.JSX.Element
```

### `LayoutContent`

```ts
LayoutContent(props: React.HTMLAttributes<HTMLElement>): React.JSX.Element
```

### `LayoutSider`

```ts
LayoutSider(props: SiderProps): React.JSX.Element
```

## 公开类型

### `LayoutProps`

Layout 布局容器：Header / Sider / Content / Footer 组合骨架 - Sider 支持折叠（手动按钮触发或断点自动收合）

继承 `React.HTMLAttributes<HTMLDivElement>`。

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `hasSider` | `boolean` | 否 | `false` | 是否包含侧边栏（有 Sider 时横向排布） |

### `SiderProps`

继承 `React.HTMLAttributes<HTMLDivElement>`。

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `width` | `number \| string` | 否 | `200` | 宽度（展开态） |
| `collapsedWidth` | `number \| string` | 否 | `64` | 折叠宽度 |
| `collapsed` | `boolean` | 否 | — | 受控折叠 |
| `defaultCollapsed` | `boolean` | 否 | `false` | 默认折叠 |
| `onCollapse` | `(collapsed: boolean) => void` | 否 | — | 折叠变化回调 |
| `breakpoint` | `'lg' \| 'md' \| 'sm' \| 'xs'` | 否 | — | 断点：窗口窄于断点宽度时自动折叠（'lg'=992, 'md'=768, 'sm'=576, 'xs'=480） |
| `collapsible` | `boolean` | 否 | `false` | 显示折叠触发器 |
| `trigger` | `'bottom' \| 'top'` | 否 | `'bottom'` | 触发器位置 |
| `triggerContent` | `React.ReactNode` | 否 | — | 触发器自定义内容 |
| `theme` | `'light' \| 'dark'` | 否 | `'light'` | 主题 |
| `zeroWidthTriggerStyle` | `boolean` | 否 | — | 零宽折叠时仍保留触发表面 |
| `children` | `React.ReactNode` | 否 | — | 子内容 |

### `SiderRenderProps`

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `children` | `React.ReactNode` | 否 | — | 渲染内容 |

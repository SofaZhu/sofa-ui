# Typography 排版

[返回 API 索引](README.md) · [源码](../../src/components/typography)

Typography 对象提供 Title、Text 和 Paragraph。复制按钮在浏览器中使用剪贴板 API。

## 使用示例

```tsx
import { Title, Text, Paragraph } from 'sofa-ui'

export function Example() {
  return (
    <>
      <Title level={2}>产品说明</Title>
      <Text copyable>可复制的内容</Text>
      <Paragraph ellipsis={{ rows: 2, expandable: true }}>较长的正文内容</Paragraph>
    </>
  )
}
```

## 运行时 API

### `Typography`

```ts
Typography.Title(props: TitleProps): React.JSX.Element
Typography.Text(props: TextProps, deprecatedLegacyContext?: any): React.ReactNode
Typography.Paragraph(props: ParagraphProps): React.JSX.Element
```

### `Text`

```ts
Text(props: TextProps, deprecatedLegacyContext?: any): React.ReactNode
```

### `Title`

```ts
Title(props: TitleProps): React.JSX.Element
```

### `Paragraph`

```ts
Paragraph(props: ParagraphProps): React.JSX.Element
```

## 公开类型

### `TypographyType`

Typography 排版组件： - Title 标题（h1 ~ h5） - Text 文本（语义色 / 修饰形态 / 单行省略 / 可复制） - Paragraph 段落（多行省略与展开收起）

```ts
type TypographyType = 'primary' | 'secondary' | 'tertiary' | 'disabled' | 'success' | 'warning' | 'error'
```

### `TitleProps`

继承 type TypographyType，指定文字语义色、`Omit<React.HTMLAttributes<HTMLHeadingElement>, 'color'>`。

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `level` | `1 \| 2 \| 3 \| 4 \| 5` | 否 | `1` | 级别 1~5 |
| `ellipsis` | `boolean` | 否 | `false` | 单行省略 |
| `copyable` | `boolean` | 否 | `false` | 是否可复制 |

### `TextProps`

继承 type TypographyType，指定文字语义色、`Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'>`。

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `strong` | `boolean` | 否 | `false` | 加粗 |
| `italic` | `boolean` | 否 | `false` | 斜体 |
| `underline` | `boolean` | 否 | `false` | 下划线 |
| `delete` | `boolean` | 否 | `false` | 删除线 |
| `mark` | `boolean` | 否 | `false` | 标记底色 |
| `code` | `boolean` | 否 | `false` | 等宽代码样式 |
| `ellipsis` | `boolean` | 否 | `false` | 单行省略 |
| `copyable` | `boolean` | 否 | `false` | 可复制 |

### `ParagraphProps`

继承 type TypographyType，指定文字语义色、`Omit<React.HTMLAttributes<HTMLParagraphElement>, 'color'>`。

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `ellipsis` | `ParagraphEllipsisConfig \| boolean` | 否 | `false` | 多行省略 |

### `ParagraphEllipsisConfig`

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `rows` | `number` | 是 | — | 省略行数 |
| `expandable` | `boolean` | 否 | — | 是否可展开收起 |

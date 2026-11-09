# Mentions 提及

[返回 API 索引](README.md) · [源码](../../src/components/mentions)

getMentions 从文本提取指定前缀后的提及项，默认前缀是 @。

## 使用示例

```tsx
import { Mentions, getMentions } from 'sofa-ui'

export function Example() {
  return (
    <Mentions
      options={[{ value: 'lin', label: '小林' }]}
      onChange={(value) => console.log(getMentions(value))}
    />
  )
}
```

## 运行时 API

### `Mentions`

```ts
Mentions(props: MentionsProps): React.JSX.Element
```

### `getMentions`

提取文本中所有被匹配的提及词（不含前缀）

```ts
getMentions(value: string, prefix?: string): string[]
```

## 公开类型

### `MentionOption`

Mentions 提及输入框： 输入前缀触发建议列表，选中后以「前缀 + 词条」替换输入片段

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `value` | `string` | 是 | — | 词条值（写入文本的内容） |
| `label` | `string` | 否 | — | 展示文案，缺省用 value |

### `MentionsProps`

继承 `Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'onBlur' | 'size'>`。

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `value` | `string` | 否 | — | 受控文本 |
| `defaultValue` | `string` | 否 | `''` | 默认文本 |
| `onChange` | `(value: string) => void` | 否 | — | 文本变化回调 |
| `options` | `MentionOption[]` | 否 | `[]` | 候选词条 |
| `prefix` | `string` | 否 | `'@'` | 提及前缀，默认 @ |
| `onSearch` | `(text: string, prefix: string) => void` | 否 | — | 输入前缀后搜索回调：参数为当前输入片段与触发前缀 |
| `placeholder` | `string` | 否 | `'请输入，@ 提及他人'` | 占位文案 |
| `disabled` | `boolean` | 否 | `false` | 禁用 |
| `className` | `string` | 否 | — | 附加类名 |
| `style` | `React.CSSProperties` | 否 | — | 内联样式 |

# Switch 开关

[返回 API 索引](README.md) · [源码](../../src/components/switch)

checked 用于受控状态。onChange 返回新开关值，loading 时阻止切换。

## 使用示例

```tsx
import { Switch } from 'sofa-ui'

export function Example() {
  return (
    <Switch defaultChecked checkedText="开" uncheckedText="关" onChange={console.log} />
  )
}
```

## 运行时 API

### `Switch`

```ts
Switch(props: SwitchProps): React.JSX.Element
```

## 公开类型

### `SwitchProps`

Switch 开关：支持加载态、开关文案与切换前确认

继承 `Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'type'>`。

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `checked` | `boolean` | 否 | — | 是否开启（受控） |
| `defaultChecked` | `boolean` | 否 | `false` | 默认开启 |
| `onChange` | `(checked: boolean) => void` | 否 | — | 变化回调 |
| `onBeforeChange` | `(checked: boolean) => boolean \| void \| Promise<boolean \| void>` | 否 | — | 切换前确认：返回 false 或 Promise<false> 时阻止切换（异步场景自动进入加载态） |
| `loading` | `boolean` | 否 | `false` | 加载中 |
| `disabled` | `boolean` | 否 | `false` | 禁用 |
| `checkedText` | `React.ReactNode` | 否 | — | 开启时的文案 |
| `uncheckedText` | `React.ReactNode` | 否 | — | 关闭时的文案 |
| `size` | `'small' \| 'default'` | 否 | `'default'` | 尺寸 |

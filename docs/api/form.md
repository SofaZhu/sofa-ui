# Form 表单

[返回 API 索引](README.md) · [源码](../../src/components/form)

Form.Item 绑定字段时接收一个可注入值及变更回调的子元素。嵌套字段可以用点分隔路径或字符串数组。validateFields 失败时拒绝 Promise，错误结构见 FormValidateResult。

## 使用示例

```tsx
import { Button, Form, Input, useForm } from 'sofa-ui'

export function Example() {
  const [form] = useForm()
  return (
    <Form form={form} layout="vertical" onFinish={console.log}>
      <Form.Item name="email" label="邮箱" rules={[{ required: true, message: '请输入邮箱' }]}>
        <Input type="email" />
      </Form.Item>
      <Button htmlType="submit" type="primary">提交</Button>
    </Form>
  )
}
```

## 运行时 API

### `Form`

```ts
Form(props: FormProps): React.JSX.Element
Form.Item(props: FormItemProps): React.JSX.Element
Form.useForm(): [FormInstance]
```

### `useForm`

```ts
useForm(): [FormInstance]
```

## 公开类型

### `FieldPath`

Form 表单： FormStore 管理字段注册、取值、设值与校验； Form.Item 通过 cloneElement 向唯一子元素注入受控属性； 支持 rules 校验、校验时机、依赖重校验、重置与三种布局

```ts
type FieldPath = string | string[]
```

### `FormInstance`

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `getFieldValue` | `(name: FieldPath) => unknown` | 是 | — | 读取单个字段值，支持 'a.b' 或数组路径 |
| `getFieldsValue` | `(nameList?: FieldPath[]) => Record<string, unknown>` | 是 | — | 读取字段值（不传 nameList 返回全部值） |
| `setFieldsValue` | `(values: Record<string, unknown>) => void` | 是 | — | 批量设值 |
| `resetFields` | `(nameList?: FieldPath[]) => void` | 是 | — | 重置字段到 initialValues（可指定字段） |
| `validateFields` | `(nameList?: FieldPath[]) => Promise<Record<string, unknown>>` | 是 | — | 校验全部或指定字段，失败时以 FormValidateResult 拒绝 |
| `submit` | `() => void` | 是 | — | 提交：全量校验后触发注册的成功/失败回调 |
| `onFinish` | `(values: Record<string, unknown>) => void` | 是 | — | 注册提交成功回调（会被 Form 的 onFinish 覆盖） |
| `onFinishFailed` | `(errorFields: Record<string, string[]>) => void` | 是 | — | 注册提交失败回调（会被 Form 的 onFinishFailed 覆盖） |

### `FormItemProps`

继承 `Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>`。

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `name` | `FieldPath` | 否 | — | 字段名：支持 'a.b' 或数组路径 |
| `label` | `React.ReactNode` | 否 | — | 标签 |
| `rules` | `FormRule[]` | 否 | `[]` | 校验规则 |
| `validateTrigger` | `FormValidateTrigger` | 否 | `'onChange'` | 字段级校验时机，覆盖默认值 |
| `extra` | `React.ReactNode` | 否 | — | 校验通过后的附加说明（常驻展示） |
| `help` | `React.ReactNode` | 否 | — | 手动帮助文案（无校验错误时展示） |
| `hasFeedback` | `boolean` | 否 | `false` | 显示成功/失败的反馈图标 |
| `dependencies` | `FieldPath \| FieldPath[]` | 否 | — | 依赖字段：依赖变化时重新校验当前字段 |
| `children` | `React.ReactNode` | 否 | — | 唯一受控子元素（注入 value/onChange/onBlur） |
| `className` | `string` | 否 | — | 附加类名 |
| `style` | `React.CSSProperties` | 否 | — | 内联样式 |

### `FormLayout`

```ts
type FormLayout = 'horizontal' | 'vertical' | 'inline'
```

### `FormProps`

继承 `Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit' | 'onChange' | 'onReset'>`。

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `form` | `FormInstance` | 否 | — | 表单实例（useForm 创建） |
| `initialValues` | `Record<string, unknown>` | 否 | — | 初始值 |
| `onFinish` | `(values: Record<string, unknown>) => void` | 否 | — | 提交成功（全部字段校验通过）回调 |
| `onFinishFailed` | `(errorFields: Record<string, string[]>) => void` | 否 | — | 提交失败（存在校验错误）回调 |
| `labelWidth` | `number \| string` | 否 | — | 标签宽度（数字为 px） |
| `layout` | `FormLayout` | 否 | `'horizontal'` | 布局方式 |
| `size` | `FormSize` | 否 | `'default'` | 尺寸 |
| `requiredMark` | `boolean \| 'optional'` | 否 | `true` | 必填标记：true 显示星号；'optional' 额外显示「（可选）」 |
| `disabled` | `boolean` | 否 | `false` | 整表禁用：向所有字段的子元素传播 |
| `children` | `React.ReactNode` | 否 | — | 子内容 |

### `FormRule`

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `required` | `boolean` | 否 | — | 必填校验 |
| `message` | `string` | 否 | — | 校验失败提示文案（required 或 validator 返回 false 时使用） |
| `validator` | `( value: unknown, getFieldValue: (name: FieldPath) => unknown ) => string \| boolean \| Promise<string \| boolean>` | 否 | — | 自定义校验：返回 string 视为失败文案，boolean 表示通过/失败，支持 Promise |

### `FormSize`

```ts
type FormSize = 'small' | 'default' | 'large'
```

### `FormValidateResult`

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `errorFields` | `Record<string, string[]>` | 是 | — | 各失败字段的错误文案（字段路径为键） |
| `values` | `Record<string, unknown>` | 是 | — | 校验时的表单值 |

### `FormValidateTrigger`

```ts
type FormValidateTrigger = 'onChange' | 'onBlur'
```

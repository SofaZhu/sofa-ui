import { describe, expect, it } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Form, type FormInstance } from '@/components/form/form'
import { Input } from '@/components/input/input'

/**
 * 测试壳组件：在渲染中创建 useForm 实例并提供 提交/自定义 按钮
 */
function TestForm({
  initialValues,
  onFinish,
  onFinishFailed,
  buttons = [],
  children
}: {
  initialValues?: Record<string, unknown>
  onFinish?: (values: Record<string, unknown>) => void
  onFinishFailed?: (errorFields: Record<string, string[]>) => void
  buttons?: Array<{ label: string; onClick: (form: FormInstance) => void }>
  children?: React.ReactNode
}) {
  const [form] = Form.useForm()
  return (
    <Form
      form={form}
      initialValues={initialValues}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      {children}
      <button type="button" onClick={() => form.submit()}>
        提交
      </button>
      {buttons.map((b) => (
        <button key={b.label} type="button" onClick={() => b.onClick(form)}>
          {b.label}
        </button>
      ))}
    </Form>
  )
}

describe('Form 表单', () => {
  it('required 校验失败显示 message 与 error 类名', async () => {
    const onFinishFailed = vi.fn()
    const { container } = render(
      <TestForm onFinishFailed={onFinishFailed}>
        <Form.Item name="name" label="姓名" rules={[{ required: true, message: '请输入姓名' }]}>
          <Input />
        </Form.Item>
      </TestForm>
    )
    await userEvent.click(screen.getByText('提交'))
    expect(await screen.findByText('请输入姓名')).toBeTruthy()
    expect(container.querySelector('.sofa-form-item-has-error')).toBeTruthy()
    // 输入框同时挂上 error 类名
    expect(container.querySelector('.sofa-form-item-error-input')).toBeTruthy()
    expect(onFinishFailed).toHaveBeenCalledWith({ name: ['请输入姓名'] })
  })

  it('校验通过后 onFinish 收到表单值', async () => {
    const onFinish = vi.fn()
    render(
      <TestForm initialValues={{ name: '张三' }} onFinish={onFinish}>
        <Form.Item name="name" rules={[{ required: true, message: '请输入姓名' }]}>
          <Input />
        </Form.Item>
      </TestForm>
    )
    await userEvent.click(screen.getByText('提交'))
    await waitFor(() => expect(onFinish).toHaveBeenCalledWith({ name: '张三' }))
  })

  it('输入中触发 onChange 校验，填好后错误消失', async () => {
    render(
      <TestForm>
        <Form.Item name="email" rules={[{ required: true, message: '请填写邮箱' }]}>
          <Input />
        </Form.Item>
      </TestForm>
    )
    const input = screen.getByRole('textbox')
    await userEvent.click(screen.getByText('提交'))
    expect(await screen.findByText('请填写邮箱')).toBeTruthy()
    await userEvent.type(input, 'a@b.com')
    await waitFor(() => expect(screen.queryByText('请填写邮箱')).toBeNull())
  })

  it('resetFields 恢复 initialValues', async () => {
    render(
      <TestForm
        initialValues={{ name: '初始名' }}
        buttons={[
          { label: '改值', onClick: (form) => form.setFieldsValue({ name: '改过的名' }) },
          { label: '重置', onClick: (form) => form.resetFields() }
        ]}
      >
        <Form.Item name="name" label="姓名">
          <Input />
        </Form.Item>
      </TestForm>
    )
    const input = screen.getByRole('textbox') as HTMLInputElement
    expect(input.value).toBe('初始名')
    await userEvent.click(screen.getByText('改值'))
    expect(input.value).toBe('改过的名')
    await userEvent.click(screen.getByText('重置'))
    expect(input.value).toBe('初始名')
  })

  it('dependencies 依赖变化触发重校验', async () => {
    const { container } = render(
      <TestForm>
        <Form.Item name="count" rules={[{ required: true, message: '请填写数量' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="note"
          dependencies={['count']}
          rules={[
            {
              validator: (_value, getFieldValue) =>
                getFieldValue('count') ? true : '请先填写数量再填写备注'
            }
          ]}
        >
          <Input />
        </Form.Item>
      </TestForm>
    )
    // 未填 count 时提交：note 的依赖校验失败，两个字段都报错
    await userEvent.click(screen.getByText('提交'))
    expect(await screen.findByText('请先填写数量再填写备注')).toBeTruthy()
    expect(container.querySelectorAll('.sofa-form-item-has-error').length).toBe(2)
    // 填写 count 后：count 自身通过，note 依赖项自动重校验通过
    await userEvent.type(screen.getAllByRole('textbox')[0], '3')
    await waitFor(() => expect(screen.queryByText('请先填写数量再填写备注')).toBeNull())
    expect(container.querySelectorAll('.sofa-form-item-has-error').length).toBe(0)
  })

  it('layout 三种布局渲染对应类名，disabled 整表禁用', () => {
    const { container } = render(
      <Form layout="vertical" disabled>
        <Form.Item name="name" label="姓名">
          <Input />
        </Form.Item>
      </Form>
    )
    expect(container.querySelector('.sofa-form-vertical')).toBeTruthy()
    expect(container.querySelector('.sofa-form-disabled')).toBeTruthy()
    const input = container.querySelector('input') as HTMLInputElement
    expect(input.disabled).toBe(true)
  })
})
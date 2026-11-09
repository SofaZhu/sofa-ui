import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/button/button'
import { Switch } from '@/components/switch/switch'
import { Checkbox } from '@/components/checkbox/checkbox'
import { RadioGroup } from '@/components/radio/radio'
import { Tag } from '@/components/tag/tag'
import { className } from '@/utils/classNames'

describe('Button 按钮', () => {
  it('渲染不同 type 的类名', () => {
    const { container } = render(<Button type="primary">确定</Button>)
    expect(container.querySelector('.sofa-btn.sofa-btn-primary')).toBeTruthy()
  })

  it('点击触发回调', async () => {
    const fn = vi.fn()
    render(<Button onClick={fn}>点击</Button>)
    await userEvent.click(screen.getByText('点击'))
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('禁用后不触发回调', async () => {
    const fn = vi.fn()
    render(
      <Button disabled onClick={fn}>
        禁用
      </Button>
    )
    await userEvent.click(screen.getByText('禁用'))
    expect(fn).not.toHaveBeenCalled()
  })

  it('block 模式渲染全宽类名', () => {
    const { container } = render(<Button block>全宽</Button>)
    expect(container.querySelector('.sofa-btn-block')).toBeTruthy()
  })
})

describe('Switch 开关', () => {
  it('默认关闭，点击后切换并回调', async () => {
    const fn = vi.fn()
    render(<Switch onChange={fn} />)
    const sw = screen.getByRole('switch')
    expect(sw.getAttribute('aria-checked')).toBe('false')
    await userEvent.click(sw)
    expect(fn).toHaveBeenCalledWith(true)
  })

  it('受控模式不改变内部状态', async () => {
    const fn = vi.fn()
    render(<Switch checked={false} onChange={fn} />)
    const sw = screen.getByRole('switch')
    await userEvent.click(sw)
    expect(fn).toHaveBeenCalledWith(true)
    expect(sw.getAttribute('aria-checked')).toBe('false')
  })
})

describe('Checkbox 复选框', () => {
  it('默认未选中，点击后选中并回传值', async () => {
    const fn = vi.fn()
    render(
      <Checkbox value={1} onChange={fn}>
        选项
      </Checkbox>
    )
    await userEvent.click(screen.getByText('选项'))
    expect(fn).toHaveBeenCalledWith(true, 1)
  })

  it('半选状态渲染 mixed aria 属性', () => {
    render(<Checkbox indeterminate>半选</Checkbox>)
    const input = screen.getByRole('checkbox')
    expect(input.getAttribute('aria-checked')).toBe('mixed')
  })
})

describe('RadioGroup 单选组', () => {
  it('点击选项触发变更', async () => {
    const fn = vi.fn()
    render(
      <RadioGroup
        defaultValue="a"
        onChange={fn}
        options={[
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' }
        ]}
      />
    )
    await userEvent.click(screen.getByText('B'))
    expect(fn).toHaveBeenCalledWith('b')
  })
})

describe('Tag 标签', () => {
  it('渲染语义色类名', () => {
    const { container } = render(<Tag color="success">成功</Tag>)
    expect(container.querySelector('.sofa-tag-success')).toBeTruthy()
  })

  it('可勾选标签触发回调', async () => {
    const fn = vi.fn()
    render(
      <Tag checkable checked={false} onCheckedChange={fn}>
        标签
      </Tag>
    )
    await userEvent.click(screen.getByText('标签'))
    expect(fn).toHaveBeenCalledWith(true)
  })
})

describe('className 工具', () => {
  it('合并字符串与条件对象', () => {
    expect(className('a', false, 'b', { c: true, d: false })).toBe('a b c')
  })
})
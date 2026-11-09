import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Collapse } from '@/components/collapse/collapse'

const items = [
  { key: 'a', label: '面板A', children: '内容A' },
  { key: 'b', label: '面板B', children: '内容B' },
  { key: 'c', label: '面板C', children: '内容C', disabled: true }
]

describe('Collapse 折叠面板', () => {
  it('默认收起：内容区折叠、箭头未旋转', () => {
    const { container } = render(<Collapse items={items} />)
    expect(container.querySelectorAll('.sofa-collapse-item').length).toBe(3)
    expect(container.querySelector('.sofa-collapse-item-active')).toBeFalsy()
    expect(container.querySelector('.sofa-collapse-content')?.getAttribute('aria-hidden')).toBe('true')
  })

  it('点击标题展开并回调，再次点击收起', async () => {
    const fn = vi.fn()
    render(<Collapse items={items} onChange={fn} />)
    await userEvent.click(screen.getByText('面板A'))
    expect(fn).toHaveBeenCalledWith(['a'])
    expect(screen.getByText('内容A')).toBeTruthy()
    await userEvent.click(screen.getByText('面板A'))
    expect(fn).toHaveBeenLastCalledWith([])
  })

  it('手风琴模式同时只展开一个', async () => {
    const fn = vi.fn()
    render(<Collapse items={items} accordion onChange={fn} />)
    await userEvent.click(screen.getByText('面板A'))
    await userEvent.click(screen.getByText('面板B'))
    expect(fn).toHaveBeenLastCalledWith('b')
    const headers = screen.getAllByRole('button')
    const expanded = headers.filter((h) => h.getAttribute('aria-expanded') === 'true')
    expect(expanded.length).toBe(1)
  })

  it('禁用面板与 collapsible disabled 不可展开', async () => {
    const fn = vi.fn()
    render(<Collapse items={items} onChange={fn} />)
    await userEvent.click(screen.getByText('面板C'))
    expect(fn).not.toHaveBeenCalled()

    const fn2 = vi.fn()
    render(
      <Collapse
        items={[{ key: 'x', label: '恒展开', children: '内容' }]}
        collapsible="disabled"
        onChange={fn2}
      />
    )
    await userEvent.click(screen.getByText('恒展开'))
    expect(fn2).not.toHaveBeenCalled()
    expect(screen.getByText('内容')).toBeTruthy()
  })
})
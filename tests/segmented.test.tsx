import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Segmented } from '@/components/segmented/segmented'

const options = ['日', '周', '月'] as const

describe('Segmented 分段控制器', () => {
  it('渲染选项并默认选中第一项', () => {
    const { container } = render(<Segmented options={[...options]} />)
    const buttons = container.querySelectorAll('.sofa-segmented-item')
    expect(buttons.length).toBe(3)
    expect(buttons[0].getAttribute('aria-checked')).toBe('true')
  })

  it('点击触发 onChange 并切换选中', async () => {
    const fn = vi.fn()
    render(<Segmented options={[...options]} onChange={fn} />)
    await userEvent.click(screen.getByRole('radio', { name: '月' }))
    expect(fn).toHaveBeenCalledWith('月')
    expect(screen.getByRole('radio', { name: '月' }).getAttribute('aria-checked')).toBe('true')
  })

  it('受控模式选中值不受内部影响', async () => {
    const fn = vi.fn()
    render(<Segmented options={[...options]} value="日" onChange={fn} />)
    await userEvent.click(screen.getByRole('radio', { name: '周' }))
    expect(fn).toHaveBeenCalledWith('周')
    expect(screen.getByRole('radio', { name: '日' }).getAttribute('aria-checked')).toBe('true')
  })

  it('方向键移动选中', async () => {
    render(<Segmented options={[...options]} />)
    const first = screen.getByRole('radio', { name: '日' })
    first.focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(fn0()).toBe('true')
  })
})

function fn0() {
  return screen.getByRole('radio', { name: '周' }).getAttribute('aria-checked')
}
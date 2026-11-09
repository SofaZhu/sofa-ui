import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Dropdown } from '@/components/dropdown/dropdown'

const items = [
  { key: 'a', label: '操作 A' },
  { key: 'b', label: '操作 B', danger: true },
  { key: 'c', label: '禁用项', disabled: true }
]

describe('Dropdown 下拉菜单', () => {
  it('点击触发展开并选中菜单项', async () => {
    const user = userEvent.setup()
    const fn = vi.fn()
    render(
      <Dropdown menu={{ items, onSelect: fn }}>
        <button type="button">更多</button>
      </Dropdown>
    )
    await user.click(screen.getByRole('button', { name: '更多' }))
    expect(screen.getByText('操作 A')).toBeTruthy()
    await user.click(screen.getByText('操作 A'))
    expect(fn).toHaveBeenCalledWith('a')
    // 选中后关闭
    expect(screen.queryByText('操作 A')).toBeFalsy()
  })

  it('禁用项点击不触发', async () => {
    const user = userEvent.setup()
    const fn = vi.fn()
    render(
      <Dropdown menu={{ items, onSelect: fn }}>
        <button type="button">更多</button>
      </Dropdown>
    )
    await user.click(screen.getByRole('button', { name: '更多' }))
    await user.click(screen.getByText('禁用项'))
    expect(fn).not.toHaveBeenCalled()
  })
})
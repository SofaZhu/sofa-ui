import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DatePicker, formatDate, getMonthGrid } from '@/components/date-picker/date-picker'

describe('DatePicker 日期选择器', () => {
  it('纯函数：formatDate 与 getMonthGrid', () => {
    expect(formatDate(new Date(2026, 7, 5), 'YYYY-MM-DD')).toBe('2026-08-05')
    expect(formatDate(new Date(2026, 0, 3), 'YYYY/MM/DD')).toBe('2026/01/03')
    expect(formatDate(new Date(2026, 11, 31))).toBe('2026-12-31')
    // 2026-08-01 是周六，网格应从 7 月 27 日（周一）开始，共 42 天
    const grid = getMonthGrid(2026, 7)
    expect(grid).toHaveLength(42)
    expect(grid[0].getDay()).toBe(1)
    expect(grid[0].getDate()).toBe(27)
    expect(grid[0].getMonth()).toBe(6)
    expect(grid[21].getDate()).toBe(17)
    expect(grid[30].getDate()).toBe(26)
  })

  it('点击输入打开面板，选择日期触发 onChange', async () => {
    const fn = vi.fn()
    render(<DatePicker value={new Date(2026, 7, 5)} onChange={fn} />)
    await userEvent.click(screen.getByRole('textbox'))
    // 面板中 2026 年 8 月的 15 号（等待定位后可见）
    await userEvent.click(await screen.findByRole('button', { name: '15' }))
    expect(fn).toHaveBeenCalledWith(new Date(2026, 7, 15))
  })

  it('minDate/maxDate 禁用范围外的日期且选择被拒绝', async () => {
    const fn = vi.fn()
    render(
      <DatePicker
        value={new Date(2026, 7, 15)}
        minDate={new Date(2026, 7, 10)}
        maxDate={new Date(2026, 7, 20)}
        onChange={fn}
      />
    )
    await userEvent.click(screen.getByRole('textbox'))
    // 网格中可能同时出现上月/下月的 5 号，全部应在禁用范围内
    const outs = await screen.findAllByRole('button', { name: '5' })
    expect(outs.length).toBeGreaterThan(0)
    outs.forEach((btn) => expect(btn.hasAttribute('disabled')).toBe(true))
    for (const btn of outs) await userEvent.click(btn)
    expect(fn).not.toHaveBeenCalled()
    // 范围内日期可选（取不在相邻月份的 18 号）
    const eights = await screen.findAllByRole('button', { name: '18' })
    const inside = eights.find((b) => !b.className.includes('sofa-datepicker-cell-out'))
    expect(inside).toBeTruthy()
    expect(inside!.hasAttribute('disabled')).toBe(false)
    await userEvent.click(inside!)
    expect(fn).toHaveBeenCalledWith(new Date(2026, 7, 18))
  })

  it('键盘方向键移动高亮，Enter 选中', async () => {
    const fn = vi.fn()
    render(<DatePicker value={new Date(2026, 7, 5)} onChange={fn} />)
    const input = screen.getByRole('textbox')
    await userEvent.click(input)
    await userEvent.keyboard('{ArrowRight}')
    await userEvent.keyboard('{Enter}')
    expect(fn).toHaveBeenCalledWith(new Date(2026, 7, 6))
  })

  it('allowClear 清空回传 null', async () => {
    const fn = vi.fn()
    render(<DatePicker allowClear defaultValue={new Date(2026, 7, 5)} onChange={fn} />)
    await userEvent.click(screen.getByRole('button', { name: '清空输入' }))
    expect(fn).toHaveBeenCalledWith(null)
  })
})
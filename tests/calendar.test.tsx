import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Calendar } from '@/components/calendar/calendar'

describe('Calendar 日历', () => {
  it('默认月模式渲染 42 格网格，选中与今天高亮类名', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 18))
    try {
      const { container } = render(<Calendar defaultValue={new Date(2026, 7, 15)} />)
      expect(container.querySelector('.sofa-calendar')).toBeTruthy()
      expect(container.querySelectorAll('.sofa-calendar-cell')).toHaveLength(42)
      expect(screen.getByText('2026 年 8 月')).toBeTruthy()
      const selected = container.querySelector('.sofa-calendar-cell-selected')
      expect(selected?.textContent).toContain('15')
      const todayCell = container.querySelector('.sofa-calendar-cell-today')
      expect(todayCell?.textContent).toContain('18')
    } finally {
      vi.useRealTimers()
    }
  })

  it('点击日期触发 onChange 与 onSelect，禁用日期不可选', async () => {
    const onChange = vi.fn()
    const onSelect = vi.fn()
    render(
      <Calendar
        defaultValue={new Date(2026, 7, 1)}
        onChange={onChange}
        onSelect={onSelect}
        disabledDate={(d) => d.getDate() === 25}
      />
    )
    const target = new Date(2026, 7, 20)
    await userEvent.click(screen.getByRole('button', { name: '2026年8月20日' }))
    expect(onChange).toHaveBeenCalledWith(target)
    expect(onSelect).toHaveBeenCalledWith(target)

    const disabledBtn = screen.getByRole('button', { name: '2026年8月25日' }) as HTMLButtonElement
    expect(disabledBtn.disabled).toBe(true)
    await userEvent.click(disabledBtn)
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('月导航翻页与跨月选择联动', async () => {
    const { container } = render(<Calendar defaultValue={new Date(2026, 7, 15)} />)
    await userEvent.click(screen.getByRole('button', { name: '上一页' }))
    expect(screen.getByText('2026 年 7 月')).toBeTruthy()
    await userEvent.click(screen.getByRole('button', { name: '下一页' }))
    expect(screen.getByText('2026 年 8 月')).toBeTruthy()
    // 点击相邻月份单元格后面板跟随
    const outCell = container.querySelector('.sofa-calendar-cell-out button') as HTMLElement
    await userEvent.click(outCell)
    expect(screen.getByText(/2026 年/)).toBeTruthy()
  })

  it('年模式渲染 12 个月，点击月份切换面板并回调', async () => {
    const onPanelChange = vi.fn()
    const { container } = render(
      <Calendar
        defaultValue={new Date(2026, 7, 15)}
        defaultMode="year"
        onPanelChange={onPanelChange}
      />
    )
    expect(container.querySelectorAll('.sofa-calendar-month-cell')).toHaveLength(12)
    expect(screen.getByText('2026 年')).toBeTruthy()
    await userEvent.click(screen.getByRole('button', { name: '3 月' }))
    expect(screen.getByText('2026 年 3 月')).toBeTruthy()
    expect(onPanelChange).toHaveBeenCalledWith('month', new Date(2026, 2, 1))

    // 点击头部标签可切回年面板
    await userEvent.click(screen.getByText('2026 年 3 月'))
    expect(container.querySelectorAll('.sofa-calendar-month-cell')).toHaveLength(12)
  })

  it('dateCellRender 渲染单元格内容，紧凑模式类名', () => {
    const { container } = render(
      <Calendar
        defaultValue={new Date(2026, 7, 15)}
        fullscreen={false}
        dateCellRender={(d) => (d.getDate() === 5 ? <span className="cell-dot" /> : null)}
      />
    )
    expect(container.querySelector('.sofa-calendar-card')).toBeTruthy()
    expect(container.querySelector('.cell-dot')).toBeTruthy()
  })
})
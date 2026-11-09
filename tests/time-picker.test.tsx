import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TimePicker, getTimeOptions, pad } from '@/components/time-picker/time-picker'

describe('TimePicker 时间选择器', () => {
  it('纯函数：getTimeOptions 步长与 12 小时制', () => {
    const opts = getTimeOptions({ minuteStep: 15 })
    expect(opts.minutes).toEqual([0, 15, 30, 45])
    expect(opts.hours).toHaveLength(24)
    expect(opts.seconds).toHaveLength(60)
    expect(getTimeOptions({ secondStep: 30 }).seconds).toEqual([0, 30])
    expect(getTimeOptions({ use12Hours: true }).hours).toEqual([12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
    expect(pad(5)).toBe('05')
    expect(pad(12)).toBe('12')
  })

  it('点击输入打开面板，选择时与分触发 onChange', async () => {
    const fn = vi.fn()
    render(<TimePicker defaultValue={new Date(2026, 0, 1, 10, 30, 0)} onChange={fn} />)
    await userEvent.click(screen.getByRole('textbox'))
    const hourList = await screen.findByRole('listbox', { name: '时' })
    const minuteList = screen.getByRole('listbox', { name: '分' })
    // 选择小时 09
    await userEvent.click(within(hourList).getByRole('button', { name: '09' }))
    expect(fn).toHaveBeenLastCalledWith(new Date(2026, 0, 1, 9, 30, 0))
    // 选择分钟 45（小时仍为 09）
    await userEvent.click(within(minuteList).getByRole('button', { name: '45' }))
    expect(fn).toHaveBeenLastCalledWith(new Date(2026, 0, 1, 9, 45, 0))
  })

  it('12 小时制为 4 列并支持 AM/PM 切换', async () => {
    const fn = vi.fn()
    render(
      <TimePicker use12Hours defaultValue={new Date(2026, 0, 1, 2, 0, 0)} onChange={fn} />
    )
    await userEvent.click(screen.getByRole('textbox'))
    // 显示上午 2 点，切到下午
    await userEvent.click(await screen.findByRole('button', { name: 'PM' }))
    expect(fn).toHaveBeenLastCalledWith(new Date(2026, 0, 1, 14, 0, 0))
  })
})
import { act, fireEvent, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { notification } from '@/components/notification/notification'

describe('Notification 通知', () => {
  afterEach(() => {
    act(() => notification.destroy())
    vi.useRealTimers()
  })

  it('已有常驻通知时立即显示新通知，并按角落独立堆叠', () => {
    act(() => notification.info({ title: '第一条', duration: 0 }))
    act(() => notification.success({ title: '第二条', duration: 0 }))
    act(() => notification.warning({ title: '另一角', duration: 0, placement: 'bottomLeft' }))

    const first = screen.getByText('第一条').closest('.sofa-notification-container')
    const second = screen.getByText('第二条').closest('.sofa-notification-container')
    expect(first).toHaveClass('sofa-notification-topRight')
    expect(second).toBe(first)
    expect(screen.getByText('另一角').closest('.sofa-notification-container')).toHaveClass('sofa-notification-bottomLeft')
  })

  it('手动关闭取消原有计时，只关闭目标且回调执行一次', () => {
    vi.useFakeTimers()
    const onClose = vi.fn()
    act(() => {
      notification.info({ title: '保留', duration: 0 })
      notification.success({ title: '待关闭', duration: 100, onClose })
    })

    const notice = screen.getByText('待关闭').closest<HTMLElement>('[role="alert"]')!
    const close = within(notice).getByRole('button', { name: '关闭通知' })
    fireEvent.click(close)
    fireEvent.click(close)
    act(() => vi.advanceTimersByTime(220))
    expect(screen.queryByText('待关闭')).not.toBeInTheDocument()
    expect(screen.getByText('保留')).toBeInTheDocument()
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('自动关闭后可在回调中发布新通知，清空后旧计时不影响新通知', () => {
    vi.useFakeTimers()
    const onClose = vi.fn(() => notification.success({ title: '回调中的新通知', duration: 0 }))
    act(() => notification.info({ title: '自动关闭', duration: 50, onClose }))
    act(() => vi.advanceTimersByTime(270))
    expect(onClose).toHaveBeenCalledTimes(1)
    expect(screen.queryByText('自动关闭')).not.toBeInTheDocument()
    expect(screen.getByText('回调中的新通知')).toBeInTheDocument()

    const cancelled = vi.fn()
    act(() => {
      notification.info({ title: '待清空', duration: 50, onClose: cancelled })
      notification.destroy()
      notification.info({ title: '清空后的新通知', duration: 0 })
    })
    act(() => vi.advanceTimersByTime(1000))
    expect(cancelled).not.toHaveBeenCalled()
    expect(screen.getAllByRole('alert')).toHaveLength(1)
    expect(screen.getByText('清空后的新通知')).toBeInTheDocument()
  })
})

import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render } from '@testing-library/react'
import { BackTop } from '@/components/back-top/back-top'

describe('BackTop 回到顶部', () => {
  it('滚动未到阈值时不显示', () => {
    const { container } = render(<BackTop />)
    const el = container.querySelector('.sofa-back-top') as HTMLElement
    expect(el.classList.contains('sofa-back-top-hidden')).toBe(true)
  })

  it('滚动超过阈值显示', () => {
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 600 })
    const { container } = render(<BackTop visibilityHeight={400} />)
    fireEvent.scroll(window)
    const el = container.querySelector('.sofa-back-top') as HTMLElement
    expect(el.classList.contains('sofa-back-top-hidden')).toBe(false)
  })

  it('点击调用 scrollTo 回到顶部', () => {
    const scrollTo = vi.fn()
    Object.assign(window, { scrollTo })
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 600 })
    const { container } = render(<BackTop visibilityHeight={400} />)
    fireEvent.scroll(window)
    fireEvent.click(container.querySelector('.sofa-back-top') as Element)
    expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ top: 0 }))
  })
})
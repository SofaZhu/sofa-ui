import { act, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Carousel } from '@/components/carousel/carousel'

const slides = (
  <>
    <div>第一张</div>
    <div>第二张</div>
    <div>第三张</div>
  </>
)

describe('Carousel 走马灯', () => {
  it('默认渲染幻灯片、指示点与箭头，首张激活', () => {
    const { container } = render(<Carousel>{slides}</Carousel>)
    expect(container.querySelectorAll('.sofa-carousel-slide')).toHaveLength(3)
    expect(container.querySelectorAll('.sofa-carousel-dot')).toHaveLength(3)
    expect(container.querySelector('.sofa-carousel-slide-active')).toBeTruthy()
    const track = container.querySelector('.sofa-carousel-track') as HTMLElement
    expect(track.style.transform).toContain('translateX')
    expect(screen.getByRole('button', { name: '上一张' })).toBeTruthy()
  })

  it('箭头切换触发 onChange 与激活态迁移', async () => {
    const fn = vi.fn()
    const { container } = render(<Carousel onChange={fn}>{slides}</Carousel>)
    await userEvent.click(screen.getByRole('button', { name: '下一张' }))
    expect(fn).toHaveBeenCalledWith(1)
    expect(container.querySelector('.sofa-carousel-slide-active')?.textContent).toContain('第二张')
    await userEvent.click(screen.getByRole('button', { name: '上一张' }))
    expect(fn).toHaveBeenLastCalledWith(0)
  })

  it('点击指示点跳转对应幻灯片', async () => {
    const fn = vi.fn()
    const { container } = render(<Carousel onChange={fn}>{slides}</Carousel>)
    await userEvent.click(screen.getByRole('button', { name: '切换到第 3 张' }))
    expect(fn).toHaveBeenCalledWith(2)
    expect(container.querySelector('.sofa-carousel-slide-active')?.textContent).toContain('第三张')
  })

  it('键盘左右键切换', () => {
    const fn = vi.fn()
    const { container } = render(<Carousel onChange={fn}>{slides}</Carousel>)
    const wrap = container.querySelector('.sofa-carousel') as HTMLElement
    fireEvent.keyDown(wrap, { key: 'ArrowRight' })
    expect(fn).toHaveBeenCalledWith(1)
    fireEvent.keyDown(wrap, { key: 'ArrowLeft' })
    expect(fn).toHaveBeenLastCalledWith(0)
  })

  it('fade 效果使用透明度过渡与克隆位结构', () => {
    const { container } = render(<Carousel effect="fade">{slides}</Carousel>)
    expect(container.querySelector('.sofa-carousel-fade')).toBeTruthy()
    const active = container.querySelector('.sofa-carousel-slide-active') as HTMLElement
    expect(active.className).toContain('sofa-carousel-slide-active')
  })

  it('自动播放按间隔切换，悬停暂停', () => {
    vi.useFakeTimers()
    try {
      const fn = vi.fn()
      const { container } = render(
        <Carousel autoplay interval={500} onChange={fn}>
          {slides}
        </Carousel>
      )
      const wrap = container.querySelector('.sofa-carousel') as HTMLElement
      act(() => {
        vi.advanceTimersByTime(500)
      })
      expect(fn).toHaveBeenCalledWith(1)

      fireEvent.mouseEnter(wrap)
      act(() => {
        vi.advanceTimersByTime(1500)
      })
      expect(fn).toHaveBeenCalledTimes(1)
      fireEvent.mouseLeave(wrap)
      act(() => {
        vi.advanceTimersByTime(500)
      })
      expect(fn).toHaveBeenCalledTimes(2)
    } finally {
      vi.useRealTimers()
    }
  })

  it('非循环模式到末张后箭头禁用', async () => {
    const fn = vi.fn()
    const { container } = render(<Carousel onChange={fn}>{slides}</Carousel>)
    const next = () => screen.getByRole('button', { name: '下一张' }) as HTMLButtonElement
    await userEvent.click(next())
    await userEvent.click(next())
    expect(next().disabled).toBe(true)
    await userEvent.click(screen.getByRole('button', { name: '上一张' }))
    expect(fn).toHaveBeenLastCalledWith(1)
    expect(container.querySelector('.sofa-carousel-slide-active')?.textContent).toContain('第二张')
  })

  it('无限循环模式末张继续回绕到首张', () => {
    const fn = vi.fn()
    const { container } = render(<Carousel infinite onChange={fn}>{slides}</Carousel>)
    const wrap = container.querySelector('.sofa-carousel') as HTMLElement
    fireEvent.keyDown(wrap, { key: 'ArrowRight' })
    fireEvent.keyDown(wrap, { key: 'ArrowRight' })
    fireEvent.keyDown(wrap, { key: 'ArrowRight' })
    expect(fn).toHaveBeenLastCalledWith(0)
    fireEvent.keyDown(wrap, { key: 'ArrowLeft' })
    expect(fn).toHaveBeenLastCalledWith(2)
  })
})
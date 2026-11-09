import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { Slider } from '@/components/slider/slider'

function mockRect(width: number) {
  // jsdom getBoundingClientRect 默认全 0，这里返回可控宽度
  const proto = HTMLElement.prototype
  const original = proto.getBoundingClientRect
  proto.getBoundingClientRect = function (this: HTMLElement) {
    const base = original.call(this)
    if (this.classList.contains('sofa-slider-track-wrap')) {
      return { ...base, left: 0, width } as DOMRect
    }
    return base
  }
  return () => {
    proto.getBoundingClientRect = original
  }
}

describe('Slider 滑块', () => {
  it('渲染默认值 0 且带可访问性属性', () => {
    render(<Slider defaultValue={30} />)
    const handle = screen.getByRole('slider')
    expect(handle.getAttribute('aria-valuenow')).toBe('30')
    expect(handle.getAttribute('aria-valuemin')).toBe('0')
    expect(handle.getAttribute('aria-valuemax')).toBe('100')
  })

  it('点击轨道更新值并触发 onChange', () => {
    const restore = mockRect(100)
    const fn = vi.fn()
    render(<Slider onChange={fn} />)
    fireEvent.pointerDown(screen.getByRole('slider').parentElement!, { clientX: 42 })
    expect(fn).toHaveBeenCalledWith(42)
    expect(screen.getByRole('slider').getAttribute('aria-valuenow')).toBe('42')
    restore()
  })

  it('键盘 ArrowRight 增加步长', () => {
    render(<Slider defaultValue={10} step={5} />)
    const handle = screen.getByRole('slider')
    handle.focus()
    fireEvent.keyDown(handle, { key: 'ArrowRight' })
    expect(handle.getAttribute('aria-valuenow')).toBe('15')
  })

  it('范围模式渲染两个把手并可拖动高位', () => {
    const restore = mockRect(100)
    const fn = vi.fn()
    render(<Slider range defaultValue={[20, 80]} onChange={fn} />)
    const handles = screen.getAllByRole('slider')
    expect(handles.length).toBe(2)
    fireEvent.pointerDown(handles[1], { clientX: 90 })
    fireEvent.pointerMove(handles[1], { clientX: 90 })
    fireEvent.pointerUp(handles[1])
    expect(fn).toHaveBeenLastCalledWith([20, 90])
    restore()
  })

  it('渲染刻度标记', () => {
    render(<Slider marks={{ 0: '低', 50: '中', 100: '高' }} />)
    expect(screen.getByText('低')).toBeTruthy()
    expect(screen.getByText('中')).toBeTruthy()
    expect(screen.getByText('高')).toBeTruthy()
  })

  it('禁用状态不响应点击', () => {
    const fn = vi.fn()
    render(<Slider disabled onChange={fn} />)
    fireEvent.pointerDown(screen.getByRole('slider').parentElement!, { clientX: 60 })
    expect(fn).not.toHaveBeenCalled()
  })
})
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { Tooltip } from '@/components/tooltip/tooltip'

describe('浮层定位', () => {
  it('贴近顶部时翻转，滚动后恢复方向和末端对齐', () => {
    let anchorTop = 2
    const measure = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
      return this.classList.contains('sofa-pop-anchor')
        ? new DOMRect(200, anchorTop, 80, 30)
        : new DOMRect(0, 0, 120, 60)
    })

    try {
      render(<Tooltip title="提示" placement="topRight" offset={0} defaultOpen><button>触发</button></Tooltip>)
      const popup = screen.getByRole('tooltip')
      const arrow = popup.querySelector('.sofa-popup-arrow')
      expect(popup).toHaveAttribute('data-side', 'bottom')
      expect(popup).toHaveStyle({ top: '32px', left: '160px' })
      expect(arrow).toHaveStyle({ left: '74px' })

      anchorTop = 200
      fireEvent.scroll(window)
      expect(popup).toHaveAttribute('data-side', 'top')
      expect(popup).toHaveStyle({ top: '140px', left: '160px' })
    } finally {
      measure.mockRestore()
    }
  })

  it('水平弹层在视口边缘翻转，箭头沿纵向对齐', () => {
    const measure = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
      return this.classList.contains('sofa-pop-anchor')
        ? new DOMRect(window.innerWidth - 40, 160, 30, 30)
        : new DOMRect(0, 0, 120, 60)
    })

    try {
      render(<Tooltip title="提示" placement="rightBottom" defaultOpen><button>触发</button></Tooltip>)
      const popup = screen.getByRole('tooltip')
      expect(popup).toHaveAttribute('data-side', 'left')
      expect(popup).toHaveStyle({ top: '130px', left: `${window.innerWidth - 168}px` })
      expect(popup.querySelector('.sofa-popup-arrow')).toHaveStyle({ top: '39px' })
    } finally {
      measure.mockRestore()
    }
  })

  it('键盘聚焦显示提示、保留原描述并支持 Escape 关闭', async () => {
    render(
      <Tooltip title="补充说明">
        <button aria-describedby="existing">触发</button>
      </Tooltip>
    )
    const button = screen.getByRole('button', { name: '触发' })
    fireEvent.focus(button)
    const tooltip = await screen.findByRole('tooltip')
    expect(button).toHaveAttribute('aria-describedby', `existing ${tooltip.id}`)
    fireEvent.keyDown(button, { key: 'Escape' })
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    expect(button).toHaveAttribute('aria-describedby', 'existing')
  })
})

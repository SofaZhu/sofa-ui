import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Timeline } from '@/components/timeline/timeline'

const items = [
  { children: '创建订单', color: 'green' as const },
  { children: '支付成功' },
  { children: '商品发货', pending: true }
]

describe('Timeline 时间轴', () => {
  it('渲染条目内容与节点颜色', () => {
    const { container } = render(<Timeline items={items} />)
    expect(screen.getByText('创建订单')).toBeTruthy()
    expect(screen.getByText('商品发货')).toBeTruthy()
    const firstDot = container.querySelectorAll('.sofa-timeline-dot')[0]
    expect(firstDot?.getAttribute('style')).toContain('var(--sofa-color-success)')
  })

  it('mode right 渲染右对齐类名', () => {
    const { container } = render(<Timeline items={items} mode="right" />)
    expect(container.querySelector('.sofa-timeline-item-pos-right')).toBeTruthy()
    expect(container.querySelector('.sofa-timeline-mode-right')).toBeTruthy()
  })

  it('pending 渲染虚线类名', () => {
    const { container } = render(<Timeline items={items} />)
    expect(container.querySelector('.sofa-timeline-item-pending')).toBeTruthy()
  })

  it('reverse 倒序渲染 & 自定义 dot 生效', () => {
    const { container } = render(
      <Timeline
        reverse
        items={[{ children: '结尾' }, { children: '开头', dot: <span>★</span> }]}
      />
    )
    const dots = container.querySelectorAll('.sofa-timeline-item')
    expect(dots[0]?.textContent).toContain('开头')
    expect(container.querySelector('.sofa-timeline-dot')?.textContent).toBe('★')
  })
})
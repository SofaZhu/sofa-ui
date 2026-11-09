import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Skeleton } from '@/components/skeleton/skeleton'

describe('Skeleton 骨架屏', () => {
  it('默认渲染标题与 3 行段落', () => {
    const { container } = render(<Skeleton />)
    expect(container.querySelector('.sofa-skeleton-title')).toBeTruthy()
    expect(container.querySelectorAll('.sofa-skeleton-line').length).toBe(3)
  })

  it('loading 为 false 时渲染 children', () => {
    render(<Skeleton loading={false}>已加载内容</Skeleton>)
    expect(screen.getByText('已加载内容')).toBeTruthy()
    expect(document.querySelector('.sofa-skeleton')).toBeFalsy()
  })

  it('active 与 avatar、image 占位渲染对应类名', () => {
    const { container } = render(
      <Skeleton active avatar={{ shape: 'square' }} image />
    )
    expect(container.querySelector('.sofa-skeleton-active')).toBeTruthy()
    expect(container.querySelector('.sofa-skeleton-avatar-square')).toBeTruthy()
    expect(container.querySelector('.sofa-skeleton-image')).toBeTruthy()
  })

  it('paragraph 行数与宽度配置生效', () => {
    const { container } = render(
      <Skeleton title={false} paragraph={{ rows: 2, width: ['80%', '40%'] }} />
    )
    expect(container.querySelector('.sofa-skeleton-title')).toBeFalsy()
    const lines = container.querySelectorAll('.sofa-skeleton-line')
    expect(lines.length).toBe(2)
    expect(lines[0]?.getAttribute('style')).toContain('80%')
  })
})
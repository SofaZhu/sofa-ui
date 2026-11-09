import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { Container } from '@/components/container/container'

describe('Container 宽屏容器', () => {
  it('渲染基础类名', () => {
    const { container } = render(<Container>内容</Container>)
    const el = container.querySelector('.sofa-container')
    expect(el).toBeTruthy()
    expect(el?.textContent).toBe('内容')
  })

  it('数字 maxWidth 转像素，字符串原样', () => {
    const { container, rerender } = render(<Container maxWidth={800}>A</Container>)
    expect(container.querySelector('.sofa-container')?.getAttribute('style')).toContain('800px')
    rerender(<Container maxWidth="60rem">B</Container>)
    expect(container.querySelector('.sofa-container')?.getAttribute('style')).toContain('60rem')
  })

  it('fluid 模式不加 maxWidth，gutter 数字转像素', () => {
    const { container } = render(<Container fluid gutter={24}>A</Container>)
    const style = container.querySelector('.sofa-container')?.getAttribute('style') ?? ''
    expect(container.querySelector('.sofa-container-fluid')).toBeTruthy()
    expect(style).toContain('24px')
  })
})
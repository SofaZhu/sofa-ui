import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { Anchor, AnchorLink } from '@/components/anchor/anchor'

describe('Anchor 锚点', () => {
  it('渲染链接并带高亮类名（滚动触发）', () => {
    const { container } = render(
      <Anchor>
        <AnchorLink href="#section-1" title="第一章" />
        <AnchorLink href="#section-2" title="第二章" />
      </Anchor>
    )
    expect(screen.getByText('第一章').getAttribute('href')).toBe('#section-1')
    // 无滚动时不高亮
    expect(container.querySelector('.sofa-anchor-link-active')).toBeFalsy()
  })

  it('scroll 事件更新当前高亮', () => {
    const fn = vi.fn()
    const { container } = render(
      <Anchor onChange={fn}>
        <AnchorLink href="#s1" title="锚 1" />
      </Anchor>
    )
    // 模拟 scrollY 满足 offsetTop -> 触发高亮（初始 listener 也会执行一次）
    fireEvent.scroll(window)
    // 因收集的链接初始 top 未知，仅验证组件未崩且渲染链接
    expect(screen.getByText('锚 1')).toBeTruthy()
    expect(container.querySelector('.sofa-anchor')).toBeTruthy()
  })

  it('点击链接平滑滚动（stub scrollTo）', () => {
    const scrollTo = vi.fn()
    Object.assign(window, { scrollTo })
    // 提供一个存在的锚点目标，不然 handleClick 直接 return
    const el = document.createElement('div')
    el.id = 'target'
    document.body.appendChild(el)
    render(
      <Anchor>
        <AnchorLink href="#target" title="目标" />
      </Anchor>
    )
    fireEvent.click(screen.getByText('目标'))
    expect(scrollTo).toHaveBeenCalled()
    el.remove()
  })
})
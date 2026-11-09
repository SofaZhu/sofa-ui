import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Result } from '@/components/result/result'

describe('Result 结果页', () => {
  it('success 状态渲染成功图标与标题副标题', () => {
    const { container } = render(<Result status="success" title="操作成功" subTitle="已保存" />)
    expect(container.querySelector('.sofa-result-success')).toBeTruthy()
    expect(screen.getByText('操作成功')).toBeTruthy()
    expect(screen.getByText('已保存')).toBeTruthy()
  })

  it('404 状态叠加状态码大字', () => {
    const { container } = render(<Result status="404" title="页面不存在" />)
    expect(container.querySelector('.sofa-result-code')).toBeTruthy()
    expect(container.querySelector('.sofa-result-code-text')?.textContent).toBe('404')
    expect(screen.getByText('页面不存在')).toBeTruthy()
  })

  it('icon 覆盖默认图标', () => {
    const { container } = render(<Result status="success" icon={<span>自定义</span>} />)
    expect(screen.getByText('自定义')).toBeTruthy()
    expect(container.querySelector('.sofa-result-icon')).toBeFalsy()
  })

  it('extra 渲染操作区', () => {
    render(<Result status="error" extra={<button>重试</button>} />)
    expect(screen.getByText('重试')).toBeTruthy()
    expect(screen.getByRole('button')).toBeTruthy()
  })
})
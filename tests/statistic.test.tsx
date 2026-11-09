import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Statistic, formatStatisticValue } from '@/components/statistic/statistic'

describe('Statistic 统计数值', () => {
  it('默认渲染千分位数值与前后缀', () => {
    const { container } = render(
      <Statistic title="销量" value={1234567.5} prefix="¥" suffix="件" />
    )
    expect(screen.getByText('销量')).toBeTruthy()
    expect(container.querySelector('.sofa-statistic-value')?.textContent).toBe('1,234,567.5')
    expect(screen.getByText('¥')).toBeTruthy()
    expect(screen.getByText('件')).toBeTruthy()
  })

  it('precision 与自定义分隔符生效', () => {
    const { container } = render(<Statistic value={1234.567} precision={2} />)
    expect(container.querySelector('.sofa-statistic-value')?.textContent).toBe('1,234.57')
    const { container: c2 } = render(
      <Statistic value={1234567} groupSeparator="" />
    )
    expect(c2.querySelector('.sofa-statistic-value')?.textContent).toBe('1234567')
  })

  it('formatter 覆盖默认格式化', () => {
    const { container } = render(
      <Statistic value={99} formatter={() => '99.9%'} />
    )
    expect(container.querySelector('.sofa-statistic-value')?.textContent).toBe('99.9%')
  })

  it('loading 时显示加载指示，color 渲染语义类名', () => {
    const { container } = render(<Statistic value={1} loading color="success" />)
    expect(container.querySelector('.sofa-spin')).toBeTruthy()
    expect(container.querySelector('.sofa-statistic-success')).toBeTruthy()
  })
})

describe('formatStatisticValue 纯函数', () => {
  it('支持字符串原样返回与精度处理', () => {
    expect(formatStatisticValue('abc')).toBe('abc')
    expect(formatStatisticValue(3.14159, { precision: 2 })).toBe('3.14')
  })
})
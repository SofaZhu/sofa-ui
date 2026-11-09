import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Descriptions } from '@/components/descriptions/descriptions'

const items = [
  { key: 'name', label: '姓名', children: '张三' },
  { key: 'age', label: '年龄', children: '18' },
  { key: 'city', label: '城市', children: '北京' }
]

describe('Descriptions 描述列表', () => {
  it('渲染条目标签与内容', () => {
    render(<Descriptions items={items} />)
    expect(screen.getByText('姓名')).toBeTruthy()
    expect(screen.getByText('张三')).toBeTruthy()
    expect(screen.getByText('北京')).toBeTruthy()
  })

  it('bordered / vertical / size 渲染对应类名', () => {
    const { container } = render(<Descriptions items={items} bordered layout="vertical" size="small" />)
    expect(container.querySelector('.sofa-descriptions-bordered')).toBeTruthy()
    expect(container.querySelector('.sofa-descriptions-vertical')).toBeTruthy()
    expect(container.querySelector('.sofa-descriptions-size-small')).toBeTruthy()
  })

  it('column 与 span 写入网格样式', () => {
    const { container } = render(
      <Descriptions
        column={2}
        items={[{ key: 'a', label: '占位', children: '值', span: 2 }]}
      />
    )
    const body = container.querySelector('.sofa-descriptions-body')
    expect(body?.getAttribute('style')).toContain('repeat(2')
    const item = container.querySelector('.sofa-descriptions-item')
    expect(item?.getAttribute('style')).toContain('span 2')
  })

  it('title 渲染在列表上方', () => {
    render(<Descriptions items={items} title="基本信息" />)
    expect(screen.getByText('基本信息')).toBeTruthy()
  })
})
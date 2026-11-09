import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { List } from '@/components/list/list'

const data = ['苹果', '香蕉', '橙子']

describe('List 列表', () => {
  it('渲染数据源并支持 List.Item', () => {
    const { container } = render(
      <List
        dataSource={data}
        renderItem={(item, index) => <List.Item>{`${index + 1}. ${item}`}</List.Item>}
      />
    )
    expect(screen.getByText('1. 苹果')).toBeTruthy()
    expect(screen.getByText('3. 橙子')).toBeTruthy()
    expect(container.querySelectorAll('.sofa-list-item').length).toBe(3)
  })

  it('空数据渲染 Empty 空态', () => {
    render(<List dataSource={[]} renderItem={(item) => <div>{item}</div>} />)
    expect(screen.getByText('暂无数据')).toBeTruthy()
  })

  it('loading 时渲染 Spin 覆盖层', () => {
    const { container } = render(
      <List dataSource={data} loading renderItem={(item) => <div>{item}</div>} />
    )
    expect(container.querySelector('.sofa-spin-wrapper')).toBeTruthy()
    expect(container.querySelector('.sofa-spin-mask')).toBeTruthy()
  })

  it('List.Item 渲染 actions 与 extra', async () => {
    const onEdit = vi.fn()
    const { container } = render(
      <List
        dataSource={data.slice(0, 1)}
        renderItem={(item) => (
          <List.Item
            actions={[<button key="edit" onClick={onEdit}>编辑</button>]}
            extra={<span>详情</span>}
          >
            {item}
          </List.Item>
        )}
      />
    )
    expect(screen.getByText('详情')).toBeTruthy()
    expect(container.querySelector('.sofa-list-item-actions')).toBeTruthy()
    await userEvent.click(screen.getByText('编辑'))
    expect(onEdit).toHaveBeenCalledTimes(1)
  })
})
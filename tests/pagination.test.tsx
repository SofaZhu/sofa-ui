import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { Pagination } from '@/components/pagination/pagination'

describe('Pagination 分页器', () => {
  it('非受控模式切换条数并将页码限制在新范围', () => {
    const onChange = vi.fn()
    const onPageSizeChange = vi.fn()
    render(<Pagination total={93} defaultCurrent={9} showSizeChanger onChange={onChange} onPageSizeChange={onPageSizeChange} />)

    const size = screen.getByRole('combobox', { name: '每页条数' })
    fireEvent.change(size, { target: { value: '50' } })
    expect(size).toHaveValue('50')
    expect(screen.getByRole('button', { name: '2', current: 'page' })).toBeInTheDocument()
    expect(onPageSizeChange).toHaveBeenCalledWith(50)
    expect(onChange).toHaveBeenCalledWith(2, 50)
  })

  it('受控模式只上报请求，保留传入的页码和条数', () => {
    const onChange = vi.fn()
    render(<Pagination total={93} current={9} pageSize={10} showSizeChanger onChange={onChange} />)

    const size = screen.getByRole('combobox', { name: '每页条数' })
    fireEvent.change(size, { target: { value: '50' } })
    expect(size).toHaveValue('10')
    expect(screen.getByRole('button', { name: '9', current: 'page' })).toBeInTheDocument()
    expect(onChange).toHaveBeenCalledWith(2, 50)
  })

  it('空数据展示零区间，并拒绝小数页码', () => {
    const showTotal = vi.fn()
    const onChange = vi.fn()
    const { rerender } = render(<Pagination total={0} pageSize={0} showTotal={showTotal} />)
    expect(showTotal).toHaveBeenCalledWith(0, [0, 0])

    rerender(<Pagination total={80} showQuickJumper onChange={onChange} />)
    const input = screen.getByRole('spinbutton')
    fireEvent.change(input, { target: { value: '2.5' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(onChange).not.toHaveBeenCalled()
    fireEvent.change(input, { target: { value: '3' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(onChange).toHaveBeenCalledWith(3, 10)
  })
})

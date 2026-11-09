import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { TreeSelect } from '@/components/tree-select/tree-select'

const treeData = [
  { key: 'p1', label: '华东', children: [{ key: 'c1', label: '上海' }, { key: 'c2', label: '杭州' }] },
  { key: 'p2', label: '华南', children: [{ key: 'c3', label: '广州' }] }
]

describe('TreeSelect 树选择', () => {
  it('单选点击节点提交值并关闭', () => {
    const fn = vi.fn()
    render(<TreeSelect treeData={treeData} onChange={fn} />)
    fireEvent.click(screen.getByRole('combobox'))
    expect(screen.getByText('上海')).toBeTruthy()
    fireEvent.click(screen.getByText('上海'))
    expect(fn).toHaveBeenCalledWith('c1', ['上海'])
    expect(screen.queryByText('杭州')).toBeFalsy()
  })

  it('多选显示已选标签与占位', () => {
    const { container } = render(<TreeSelect treeData={treeData} multiple defaultValue={['c1']} />)
    expect(screen.getByText('上海')).toBeTruthy()
    expect(container.querySelector('.sofa-tree-select-tag')).toBeTruthy()
  })

  it('可清空触发 undefined', () => {
    const fn = vi.fn()
    render(<TreeSelect treeData={treeData} clearable defaultValue={['c1']} onChange={fn} />)
    fireEvent.click(screen.getByRole('combobox'))
    const clear = document.querySelector('.sofa-tree-select-suffix')!
    fireEvent.click(clear)
    expect(fn).toHaveBeenCalledWith(undefined, undefined)
  })

  it('搜索过滤树', () => {
    render(<TreeSelect treeData={treeData} searchable />)
    fireEvent.click(screen.getByRole('combobox'))
    const input = document.querySelector('.sofa-tree-select-search-input')!
    fireEvent.change(input, { target: { value: '杭州' } })
    expect(screen.getByText('杭州')).toBeTruthy()
    expect(screen.queryByText('上海')).toBeFalsy()
  })
})
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { Cascader } from '@/components/cascader/cascader'

const options = [
  {
    value: 'zhejiang',
    label: '浙江',
    children: [
      { value: 'hangzhou', label: '杭州', children: [{ value: 'xihu', label: '西湖' }] },
      { value: 'ningbo', label: '宁波' }
    ]
  },
  { value: 'jiangsu', label: '江苏', children: [{ value: 'nanjing', label: '南京' }] }
]

describe('Cascader 级联选择', () => {
  it('级联多列点击叶子提交完整路径', () => {
    const fn = vi.fn()
    render(<Cascader options={options} onChange={fn} />)
    fireEvent.click(screen.getAllByRole('combobox')[0])
    fireEvent.click(screen.getByText('浙江'))
    fireEvent.click(screen.getByText('杭州'))
    fireEvent.click(screen.getByText('西湖'))
    expect(fn).toHaveBeenCalledWith(['zhejiang', 'hangzhou', 'xihu'], expect.any(Array))
  })

  it('渲染已选路径文案', () => {
    const { container } = render(<Cascader options={options} value={['zhejiang', 'hangzhou']} />)
    expect(screen.getByText('浙江')).toBeTruthy()
    expect(screen.getByText('杭州')).toBeTruthy()
    expect(container.querySelector('.sofa-cascader-placeholder')).toBeFalsy()
  })

  it('可清空', () => {
    const fn = vi.fn()
    render(<Cascader options={options} clearable value={['jiangsu', 'nanjing']} onChange={fn} />)
    const clear = document.querySelector('.sofa-cascader-suffix')!
    fireEvent.click(clear)
    expect(fn).toHaveBeenCalledWith(undefined, [])
  })

  it('搜索展示命中路径并可选取', async () => {
    const fn = vi.fn()
    render(<Cascader options={options} searchable onChange={fn} />)
    fireEvent.click(screen.getAllByRole('combobox')[0])
    const input = document.querySelector('.sofa-cascader-search-input')!
    fireEvent.change(input, { target: { value: '南京' } })
    fireEvent.click(await screen.findByText('南京'))
    expect(fn).toHaveBeenCalledWith(['jiangsu', 'nanjing'], expect.any(Array))
  })

  it('搜索排除禁用分支，重新打开时清空搜索', async () => {
    const onChange = vi.fn()
    render(
      <Cascader
        searchable
        options={[{ ...options[0], disabled: true }, options[1]]}
        onChange={onChange}
      />
    )
    const trigger = screen.getByRole('combobox')
    fireEvent.click(trigger)
    fireEvent.change(screen.getByPlaceholderText('搜索'), { target: { value: '杭州' } })
    expect(await screen.findByText('暂无匹配')).toBeInTheDocument()
    expect(onChange).not.toHaveBeenCalled()
    fireEvent.keyDown(document, { key: 'Escape' })
    fireEvent.click(trigger)
    expect(screen.getByPlaceholderText('搜索')).toHaveValue('')
    expect(screen.getByText('江苏')).toBeInTheDocument()
  })
})
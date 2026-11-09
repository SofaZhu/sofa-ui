import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Mentions, getMentions } from '@/components/mentions/mentions'

const OPTIONS = [
  { value: 'xiaoming', label: '小明' },
  { value: 'xiaohong', label: '小红' },
  { value: 'daniu', label: '大牛' }
]

describe('Mentions 提及输入框', () => {
  it('纯函数：getMentions 提取被匹配的提及词', () => {
    expect(getMentions('今天和 @小明 一起写代码')).toEqual(['小明'])
    expect(getMentions('@abc 与 @def_1 都参与了')).toEqual(['abc', 'def_1'])
    expect(getMentions('没有提及任何词')).toEqual([])
    expect(getMentions('自定义前缀 #tag 成功', '#')).toEqual(['tag'])
  })

  it('输入 @ 弹出候选，点击选择替换片段', async () => {
    render(<Mentions options={OPTIONS} />)
    const input = screen.getByRole('textbox')
    await userEvent.type(input, '你好 @大')
    await screen.findByRole('listbox')
    // 按关键字过滤：只剩大牛
    expect(screen.getByRole('option', { name: '大牛' })).toBeTruthy()
    expect(screen.queryByRole('option', { name: '小明' })).toBeNull()
    await userEvent.click(screen.getByRole('option', { name: '大牛' }))
    expect(input).toHaveValue('你好 @daniu ')
  })

  it('键盘上下选择 + Enter 确认选中', async () => {
    render(<Mentions options={OPTIONS} />)
    const input = screen.getByRole('textbox')
    await userEvent.type(input, '喊 @大')
    await userEvent.keyboard('{ArrowDown}')
    await userEvent.keyboard('{Enter}')
    expect(input).toHaveValue('喊 @daniu ')
  })

  it('受控模式 onChange 回传替换后的文本', async () => {
    const fn = vi.fn()
    render(<Mentions value="说 @xiao" options={OPTIONS} onChange={fn} />)
    await userEvent.click(screen.getByRole('textbox'))
    await userEvent.click(await screen.findByRole('option', { name: '小红' }))
    expect(fn).toHaveBeenCalledWith('说 @xiaohong ')
  })
})
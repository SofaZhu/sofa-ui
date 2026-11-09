import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Title, Text, Paragraph } from '@/components/typography/typography'

describe('Typography 排版', () => {
  it('Title 渲染对应级别标签与类名', () => {
    const { container } = render(<Title level={3}>标题</Title>)
    expect(container.querySelector('h3.sofa-typography-title-3')).toBeTruthy()
  })

  it('Text 渲染语义色与修饰类名', () => {
    const { container } = render(
      <Text type="error" strong delete>
        错误文本
      </Text>
    )
    expect(container.querySelector('.sofa-text-error')).toBeTruthy()
    expect(container.querySelector('.sofa-typography-strong')).toBeTruthy()
    expect(container.querySelector('.sofa-typography-del')).toBeTruthy()
  })

  it('Text copyable 点击后切换复制图标', async () => {
    Object.assign(navigator, { clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } })
    render(<Text copyable>复制的文本</Text>)
    const btn = screen.getByLabelText('复制')
    await userEvent.click(btn)
    expect(btn.querySelector('.sofa-icon-check')).toBeTruthy()
  })

  it('文本省略时复制按钮位于裁切区域之外', () => {
    render(<Text ellipsis copyable>长文本</Text>)
    const text = screen.getByText('长文本')
    const button = screen.getByRole('button', { name: '复制' })
    expect(text).toHaveClass('sofa-typography-ellipsis')
    expect(text).not.toContainElement(button)
    expect(text.parentElement).toContainElement(button)
  })

  it('Paragraph 展开收起切换', async () => {
    render(<Paragraph ellipsis={{ rows: 2, expandable: true }}>很长的一段文本内容</Paragraph>)
    const expandBtn = screen.getByRole('button', { name: '展开' })
    await userEvent.click(expandBtn)
    expect(screen.getByRole('button', { name: '收起' })).toBeTruthy()
    expect(screen.queryByText('展开')).toBeFalsy()
  })
})
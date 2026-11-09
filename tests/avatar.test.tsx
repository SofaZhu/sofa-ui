import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { Avatar, AvatarGroup } from '@/components/avatar/avatar'

describe('Avatar 头像', () => {
  it('文字缩略为前 2 字，默认圆形，数字尺寸生效', () => {
    const { container } = render(<Avatar>张三丰</Avatar>)
    expect(screen.getByText('张三')).toBeTruthy()
    expect(container.querySelector('.sofa-avatar')).toBeTruthy()
    expect(container.querySelector('.sofa-avatar-circle')).toBeTruthy()
    expect((container.querySelector('.sofa-avatar') as HTMLElement).style.width).toBe('32px')
  })

  it('尺寸档位与方形形状类名', () => {
    const { container } = render(<Avatar size="large" shape="square">李</Avatar>)
    expect(container.querySelector('.sofa-avatar-square')).toBeTruthy()
    expect((container.querySelector('.sofa-avatar') as HTMLElement).style.width).toBe('40px')
    expect((container.querySelector('.sofa-avatar') as HTMLElement).style.height).toBe('40px')
    const num = render(<Avatar size={50}>王</Avatar>)
    expect((num.container.querySelector('.sofa-avatar') as HTMLElement).style.width).toBe('50px')
  })

  it('图片加载失败回退到 fallback / 图标', () => {
    const { container } = render(
      <Avatar src="broken.png" fallback={<span className="my-fallback">加载失败</span>} />
    )
    const img = container.querySelector('img') as HTMLElement
    expect(img).toBeTruthy()
    fireEvent.error(img)
    expect(screen.getByText('加载失败')).toBeTruthy()

    const icon = render(<Avatar src="broken2.png" icon={<span className="my-icon">i</span>} />)
    fireEvent.error(icon.container.querySelector('img') as HTMLElement)
    expect(icon.container.querySelector('.my-icon')).toBeTruthy()
  })

  it('图片正常渲染后不再回退', () => {
    const { container } = render(
      <Avatar src="ok.png" icon={<span className="my-icon">i</span>} />
    )
    const img = container.querySelector('img') as HTMLElement
    fireEvent.load(img)
    expect(img).toBeTruthy()
    expect(container.querySelector('.my-icon')).toBeNull()
  })

  it('Group 叠放：超过 maxCount 折叠为 +N', () => {
    const { container } = render(
      <AvatarGroup maxCount={2}>
        <Avatar>甲</Avatar>
        <Avatar>乙</Avatar>
        <Avatar>丙</Avatar>
        <Avatar>丁</Avatar>
      </AvatarGroup>
    )
    expect(container.querySelectorAll('.sofa-avatar-group-item')).toHaveLength(3)
    expect(screen.getByText('+2')).toBeTruthy()
    expect(container.querySelector('.sofa-avatar-group')).toBeTruthy()
    expect(screen.getByText('甲')).toBeTruthy()
    expect(screen.queryByText('丁')).toBeNull()
  })

  it('Group 不超限时全部展示', () => {
    const { container } = render(
      <AvatarGroup maxCount={5}>
        <Avatar>甲</Avatar>
        <Avatar>乙</Avatar>
      </AvatarGroup>
    )
    expect(container.querySelectorAll('.sofa-avatar-group-item')).toHaveLength(2)
    expect(screen.queryByText(/^\+/)).toBeNull()
  })
})
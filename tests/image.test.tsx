import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Image } from '@/components/image/image'

describe('Image 图片', () => {
  it('加载中显示占位，加载完成移除，失败显示回退内容', () => {
    const { container } = render(
      <Image src="a.png" placeholder={<span className="my-placeholder">加载中</span>} fallback="图片损坏" />
    )
    expect(container.querySelector('.my-placeholder')).toBeTruthy()
    const img = container.querySelector('.sofa-image-img') as HTMLElement
    fireEvent.load(img)
    expect(container.querySelector('.my-placeholder')).toBeNull()

    const fail = render(<Image src="broken.png" fallback="图片损坏" />)
    fireEvent.error(fail.container.querySelector('.sofa-image-img') as HTMLElement)
    expect(screen.getAllByText('图片损坏').length).toBeGreaterThan(0)
  })

  it('点击打开全屏预览：缩放、旋转、ESC 关闭', async () => {
    const onOpen = vi.fn()
    const onClose = vi.fn()
    const { container } = render(
      <Image src="a.png" onPreviewOpen={onOpen} onPreviewClose={onClose} />
    )
    await userEvent.click(container.querySelector('.sofa-image-img') as HTMLElement)
    expect(onOpen).toHaveBeenCalled()
    const overlay = container.querySelector('.sofa-image-preview') as HTMLElement
    expect(overlay).toBeTruthy()
    const previewImg = overlay.querySelector('.sofa-image-preview-img') as HTMLElement
    expect(previewImg.getAttribute('src')).toBe('a.png')

    await userEvent.click(screen.getByRole('button', { name: '放大' }))
    expect(screen.getByText('125%')).toBeTruthy()
    expect(previewImg.style.transform).toContain('scale(1.25)')

    await userEvent.click(screen.getByRole('button', { name: '旋转' }))
    expect(previewImg.style.transform).toContain('rotate(90deg)')

    await userEvent.click(screen.getByRole('button', { name: '缩小' }))
    expect(screen.getByText('100%')).toBeTruthy()

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(container.querySelector('.sofa-image-preview')).toBeNull()
    expect(onClose).toHaveBeenCalled()
  })

  it('滚轮缩放限制在 0.5~3 倍区间', async () => {
    const { container } = render(<Image src="a.png" />)
    await userEvent.click(container.querySelector('.sofa-image-img') as HTMLElement)
    const overlay = container.querySelector('.sofa-image-preview') as HTMLElement
    for (let i = 0; i < 30; i += 1) {
      fireEvent.wheel(overlay, { deltaY: -100 })
    }
    expect(screen.getByText('300%')).toBeTruthy()
    for (let i = 0; i < 60; i += 1) {
      fireEvent.wheel(overlay, { deltaY: 100 })
    }
    expect(screen.getByText('50%')).toBeTruthy()
  })

  it('preview=false 时不弹出预览，previewSrc 用于预览大图', async () => {
    const { container } = render(<Image src="small.png" preview={false} />)
    await userEvent.click(container.querySelector('.sofa-image-img') as HTMLElement)
    expect(container.querySelector('.sofa-image-preview')).toBeNull()

    const previewable = render(<Image src="small.png" previewSrc="big.png" />)
    await userEvent.click(previewable.container.querySelector('.sofa-image-img') as HTMLElement)
    const big = previewable.container.querySelector('.sofa-image-preview-img') as HTMLElement
    expect(big.getAttribute('src')).toBe('big.png')
  })

  it('点击遮罩关闭预览', async () => {
    const { container } = render(<Image src="a.png" />)
    await userEvent.click(container.querySelector('.sofa-image-img') as HTMLElement)
    await userEvent.click(container.querySelector('.sofa-image-preview-mask') as HTMLElement)
    expect(container.querySelector('.sofa-image-preview')).toBeNull()
  })
})
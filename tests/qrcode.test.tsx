import { describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/react'
import { encodeQR, QRCode, qrToDataURL } from '@/components/qrcode/qrcode'

describe('QRCode 二维码', () => {
  it('编码矩阵尺寸随版本增长', () => {
    const small = encodeQR('hello', 'L')
    const large = encodeQR('a'.repeat(120), 'L')
    expect(small.modules.length).toBe(21)
    expect(large.modules.length).toBeGreaterThan(21)
  })

  it('角部 finder 图案正确（7x7 边框）', () => {
    const { modules } = encodeQR('测试中文内容', 'M')
    // finder 顶部行：7 黑 + 分隔白 + 1 黑芯列起点
    const topRow = modules[0]
    expect(topRow.slice(0, 7).every((v) => v)).toBe(true)
    expect(topRow[7]).toBe(false)
    // 中心 3x3 黑芯：(2,2) 内环黑、(1,1) 白环
    expect(modules[2][2]).toBe(true)
    expect(modules[1][1]).toBe(false)
  })

  it('不同容错级别与内容不抛错', () => {
    expect(() => encodeQR('https://example.com/path?q=1', 'H')).not.toThrow()
    expect(() => encodeQR('x'.repeat(200), 'Q')).not.toThrow()
    expect(() => encodeQR('', 'L')).not.toThrow()
  })

  it('toDataURL 生成 png dataURL', () => {
    const ctxStub = { fillStyle: '', scale: vi.fn(), fillRect: vi.fn() } as unknown as CanvasRenderingContext2D
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(ctxStub as never)
    const toDataURL = vi
      .spyOn(HTMLCanvasElement.prototype, 'toDataURL')
      .mockReturnValue('data:image/png;base64,ZmFrZQ==')
    const url = qrToDataURL('data-url-test')
    expect(toDataURL).toHaveBeenCalled()
    expect(url).toBe('data:image/png;base64,ZmFrZQ==')
  })

  it('组件渲染 canvas 元素与自定义尺寸', () => {
    const { container } = render(<QRCode value="component" size={96} />)
    const canvas = container.querySelector('canvas')
    expect(canvas).toBeTruthy()
    expect(canvas?.style.width).toBe('96px')
  })
})
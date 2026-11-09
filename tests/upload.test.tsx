import { describe, expect, it } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { fireEvent } from '@testing-library/react'
import { Upload, type UploadFile } from '@/components/upload/upload'

/** 触发隐藏 input 的文件选择：模拟用户选择文件 */
function pickFile(container: HTMLElement, files: File[]) {
  const input = container.querySelector('input[type="file"]') as HTMLInputElement
  fireEvent.change(input, { target: { files } })
}

describe('Upload 文件上传', () => {
  it('点击触发文件选择，无 action 时不崩溃并回传列表', async () => {
    const fn = vi.fn()
    const { container } = render(<Upload onChange={fn} />)
    await userEvent.click(screen.getByRole('button', { name: '点击上传' }))
    const file = new File(['hello'], 'a.txt', { type: 'text/plain' })
    pickFile(container, [file])
    await waitFor(() => expect(fn).toHaveBeenCalled())
    await waitFor(() => expect(screen.getByText('a.txt')).toBeTruthy())
    // 无 action：直接置为完成态
    const list = fn.mock.calls.map((c) => c[0]).flat() as UploadFile[]
    expect(list[list.length - 1].status).toBe('done')
  })

  it('beforeUpload 返回 false 时拦截并拒绝', async () => {
    const fn = vi.fn()
    const before = vi.fn(() => false)
    const { container } = render(<Upload beforeUpload={before} onChange={fn} />)
    const file = new File(['b'], 'b.txt', { type: 'text/plain' })
    pickFile(container, [file])
    await waitFor(() => expect(before).toHaveBeenCalledWith(file))
    expect(fn).not.toHaveBeenCalled()
    expect(screen.queryByText('b.txt')).toBeNull()
  })

  it('maxCount 超限时拒绝超出部分', async () => {
    const fn = vi.fn()
    const { container } = render(<Upload maxCount={1} onChange={fn} />)
    const pick = (name: string) => new File(['x'], name, { type: 'text/plain' })
    pickFile(container, [pick('one.txt'), pick('two.txt')])
    await waitFor(() => expect(fn).toHaveBeenCalled())
    expect(screen.getByText('one.txt')).toBeTruthy()
    expect(screen.queryByText('two.txt')).toBeNull()
  })

  it('受控 fileList 渲染固定列表并可移除', async () => {
    const fn = vi.fn()
    const list: UploadFile[] = [{ uid: 'u1', name: 'keep.txt', status: 'done' }]
    render(<Upload fileList={list} onChange={fn} onRemove={fn} />)
    expect(screen.getByText('keep.txt')).toBeTruthy()
    await userEvent.click(screen.getByRole('button', { name: '移除文件' }))
    expect(fn).toHaveBeenCalled()
  })

  it('拖拽区渲染 drag 类名，禁用时不触发选择', async () => {
    const fn = vi.fn()
    render(<Upload drag onChange={fn} />)
    expect(screen.getByText('点击或拖拽文件到此区域上传')).toBeTruthy()
    const dnf = vi.fn()
    render(<Upload disabled onChange={dnf} />)
    await userEvent.click(screen.getByRole('button', { name: '点击上传' }))
    expect(dnf).not.toHaveBeenCalled()
  })
})
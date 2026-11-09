import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tree, type TreeNode } from '@/components/tree/tree'

const treeData: TreeNode[] = [
  {
    key: 'a',
    label: '部门 A',
    children: [
      { key: 'a1', label: '成员 1' },
      {
        key: 'a2',
        title: '成员 2（title 兼容）',
        children: [{ key: 'a2-1', label: '成员 2-1' }]
      }
    ]
  },
  { key: 'b', label: '部门 B' }
]

describe('Tree 树形控件', () => {
  it('默认展开全部渲染节点，label/title 兼容，缩进层级类名', () => {
    const { container } = render(<Tree treeData={treeData} defaultExpandAll />)
    expect(screen.getByText('部门 A')).toBeTruthy()
    expect(screen.getByText('成员 2（title 兼容）')).toBeTruthy()
    expect(screen.getByText('成员 2-1')).toBeTruthy()
    expect(container.querySelectorAll('.sofa-tree-node')).toHaveLength(5)
    expect(container.querySelector('.sofa-tree')).toBeTruthy()
  })

  it('点击节点选中并回调，受控模式内部不改变', async () => {
    const fn = vi.fn()
    const { unmount } = render(<Tree treeData={treeData} onSelect={fn} />)
    await userEvent.click(screen.getByText('部门 A'))
    expect(fn).toHaveBeenLastCalledWith(['a'], expect.objectContaining({ selected: true }))
    unmount()

    const fn2 = vi.fn()
    const { container } = render(
      <Tree treeData={treeData} selectedKeys={['b']} onSelect={fn2} />
    )
    await userEvent.click(screen.getByText('部门 A'))
    expect(fn2).toHaveBeenCalled()
    expect(container.querySelector('.sofa-tree-node-selected')?.textContent).toContain('部门 B')
  })

  it('复选：子节点勾选后父节点半选，勾选父节点级联全选且 checkedKeys 只含全选', async () => {
    const fn = vi.fn()
    const { container } = render(
      <Tree treeData={treeData} checkable onCheck={fn} defaultExpandAll />
    )
    const checkboxes = () =>
      Array.from(container.querySelectorAll('[role="checkbox"]'))

    // 勾选 a1：a 半选
    await userEvent.click(checkboxes()[1])
    expect(fn).toHaveBeenLastCalledWith(
      ['a1'],
      expect.objectContaining({ halfCheckedKeys: ['a'], checked: true })
    )
    expect(checkboxes()[0].getAttribute('aria-checked')).toBe('mixed')

    // 勾选父节点 a：a 与全部后代进入 checkedKeys
    await userEvent.click(checkboxes()[0])
    expect(fn).toHaveBeenLastCalledWith(
      ['a1', 'a', 'a2', 'a2-1'],
      expect.objectContaining({ checked: true })
    )
    expect(checkboxes()[0].getAttribute('aria-checked')).toBe('true')

    // 取消 a2：a2 与后代 a2-1 移出，a 回到半选
    await userEvent.click(checkboxes()[2])
    expect(fn).toHaveBeenLastCalledWith(
      ['a1'],
      expect.objectContaining({ checked: false, halfCheckedKeys: ['a'] })
    )
    expect(checkboxes()[0].getAttribute('aria-checked')).toBe('mixed')
  })

  it('懒加载：展开时调用 loadData，完成后渲染子节点', async () => {
    const parent: TreeNode = { key: 'root', label: '根节点' }
    const loadData = vi.fn((node: TreeNode) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          node.children = [{ key: 'child-1', label: '懒加载子节点' }]
          resolve()
        }, 10)
      })
    })
    const { container } = render(<Tree treeData={[parent]} loadData={loadData} />)
    expect(screen.queryByText('懒加载子节点')).toBeNull()
    await userEvent.click(container.querySelector('.sofa-tree-switcher') as HTMLElement)
    expect(loadData).toHaveBeenCalledWith(parent)
    expect(await screen.findByText('懒加载子节点')).toBeTruthy()
  })

  it('拖拽事件透传：dragStart/dragOver/drop 绑定并回传节点与落点信息', async () => {
    const onDragStart = vi.fn()
    const onDragOver = vi.fn()
    const onDrop = vi.fn()
    const { container } = render(
      <Tree
        treeData={treeData}
        draggable
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDrop={onDrop}
      />
    )
    const nodes = container.querySelectorAll('.sofa-tree-node')
    expect(nodes[0].getAttribute('draggable')).toBe('true')

    fireEvent.dragStart(nodes[0])
    expect(onDragStart).toHaveBeenCalledTimes(1)
    fireEvent.dragOver(nodes[1])
    expect(onDragOver).toHaveBeenCalledTimes(1)
    fireEvent.drop(nodes[1])
    expect(onDrop).toHaveBeenCalledTimes(1)
    const info = onDrop.mock.calls[0][0] as {
      node: TreeNode
      dragNode: TreeNode
      dropPosition: number
      dropToGap: boolean
    }
    expect(info.node.key).toBe('b')
    expect(info.dragNode.key).toBe('a')
    expect([-1, 0, 1]).toContain(info.dropPosition)
    expect(typeof info.dropToGap).toBe('boolean')
  })

  it('键盘导航：方向键移动焦点，回车选中', () => {
    const fn = vi.fn()
    const { container } = render(
      <Tree treeData={treeData} defaultExpandAll onSelect={fn} />
    )
    const tree = container.querySelector('.sofa-tree') as HTMLElement
    const nodes = container.querySelectorAll('.sofa-tree-node')

    fireEvent.focus(nodes[0])
    fireEvent.keyDown(tree, { key: 'ArrowDown' })
    expect(nodes[1].className).toContain('sofa-tree-node-focused')

    fireEvent.keyDown(tree, { key: 'Enter' })
    expect(fn).toHaveBeenCalledWith(['a1'], expect.anything())
  })

  it('禁用节点不可选择与勾选', async () => {
    const fn = vi.fn()
    render(
      <Tree
        treeData={[{ key: 'd', label: '禁用项', disabled: true }]}
        checkable
        onSelect={fn}
        onCheck={fn}
      />
    )
    const node = screen.getByText('禁用项')
    await userEvent.click(node)
    expect(fn).not.toHaveBeenCalled()
  })
})
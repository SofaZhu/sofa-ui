import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { Menu, MenuItem, SubMenu, MenuItemGroup } from '@/components/menu/menu'

describe('Menu 导航菜单', () => {
  it('渲染并支持受控选中高亮', () => {
    render(
      <Menu selectedKey="a">
        <MenuItem key="a">首页</MenuItem>
        <MenuItem key="b">文档</MenuItem>
      </Menu>
    )
    const items = screen.getAllByRole('menuitem')
    expect(items.length).toBe(2)
    expect(items[0].classList.contains('sofa-menu-item-selected')).toBe(true)
    expect(items[1].classList.contains('sofa-menu-item-selected')).toBe(false)
  })

  it('点击触发 onSelect 并更新选中', () => {
    const fn = vi.fn()
    render(
      <Menu onSelect={fn}>
        <MenuItem key="x">项目 A</MenuItem>
      </Menu>
    )
    fireEvent.click(screen.getByText('项目 A'))
    expect(fn).toHaveBeenCalledWith('x')
    expect(screen.getByText('项目 A').closest('.sofa-menu-item')!.classList.contains('sofa-menu-item-selected')).toBe(true)
  })

  it('SubMenu 展开显示子项', () => {
    render(
      <Menu defaultOpenKeys={['s']}>
        <SubMenu key="s" title="设置">
          <MenuItem key="s1">账户</MenuItem>
        </SubMenu>
      </Menu>
    )
    // 子项 div 渲染在文档中（折叠由样式控制）
    expect(screen.getByText('账户')).toBeTruthy()
    const title = screen.getByText('设置').closest('.sofa-submenu-title')!
    expect(title.getAttribute('aria-expanded')).toBe('true')
  })

  it('MenuItemGroup 渲染分组标题', () => {
    render(
      <Menu>
        <MenuItemGroup title="分组一">
          <MenuItem key="g1">叶子一</MenuItem>
        </MenuItemGroup>
      </Menu>
    )
    expect(screen.getByText('分组一')).toBeTruthy()
  })

  it('横向模式类名', () => {
    const { container } = render(
      <Menu horizontal>
        <MenuItem key="h">头</MenuItem>
      </Menu>
    )
    expect(container.querySelector('.sofa-menu-horizontal')).toBeTruthy()
  })
})
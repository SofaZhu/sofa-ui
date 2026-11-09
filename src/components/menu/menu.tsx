import { Children, cloneElement, createContext, isValidElement, useCallback, useContext, useMemo, useState } from 'react'
import { className } from '@/utils/classNames'
import { Icon } from '../icon/icon'

/**
 * Menu 导航菜单：
 * - inline 垂直展开 / horizontal 横向
 * - MenuItem 叶子项 / SubMenu 子菜单（inline 展开，horizontal 悬浮展开）
 * - MenuItemGroup 分组
 * 说明：React 会剥离 `key` prop，Menu 在渲染时通过 cloneElement 将子元素
 * 的 React key 注入 itemKey / subKey 作为组件标识。
 */

export interface MenuItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'key'> {
  /** 唯一标识（也可通过 React key 传入） */
  itemKey?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 图标 */
  icon?: React.ReactNode
}

export interface SubMenuProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'key' | 'title'> {
  subKey?: string
  title: React.ReactNode
  icon?: React.ReactNode
  /** inline 模式下默认展开 */
  defaultOpen?: boolean
  disabled?: boolean
}

export interface MenuItemGroupProps {
  title: React.ReactNode
  children?: React.ReactNode
}

export interface MenuProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** 选中项 key */
  selectedKey?: string
  /** 默认选中 */
  defaultSelectedKey?: string
  /** 展开的 submenu key 列表（inline） */
  openKeys?: string[]
  /** 默认展开 */
  defaultOpenKeys?: string[]
  /** 横向模式 */
  horizontal?: boolean
  /** 选中回调 */
  onSelect?: (key: string) => void
  onOpenChange?: (keys: string[]) => void
}

interface MenuContextValue {
  mode: 'inline' | 'horizontal'
  selectedKey: string
  openKeys: string[]
  select: (key: string) => void
  toggleOpen: (key: string) => void
}

const MenuContext = createContext<MenuContextValue | null>(null)

export function MenuItem({ itemKey, disabled = false, icon, className: cls, children, onClick, ...rest }: MenuItemProps) {
  const ctx = useContext(MenuContext)
  if (!ctx) return null
  const active = ctx.selectedKey === itemKey
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return
    onClick?.(e)
    if (itemKey !== undefined) ctx.select(itemKey)
  }
  return (
    <div
      role="menuitem"
      aria-current={active || undefined}
      className={className(
        'sofa-menu-item',
        active && 'sofa-menu-item-selected',
        disabled && 'sofa-menu-item-disabled',
        cls
      )}
      onClick={handleClick}
      {...rest}
    >
      {icon && <span className="sofa-menu-item-icon">{icon}</span>}
      <span className="sofa-menu-item-label">{children}</span>
    </div>
  )
}

export function SubMenu({ subKey, title, icon, defaultOpen = false, disabled = false, className: cls, children }: SubMenuProps) {
  const ctx = useContext(MenuContext)
  const [innerOpen, setInnerOpen] = useState(defaultOpen)
  const open = ctx ? ctx.openKeys.includes(subKey as string) : innerOpen
  const effectiveKey = subKey

  const handleToggle = useCallback(() => {
    if (!ctx || disabled || effectiveKey === undefined) return
    ctx.toggleOpen(effectiveKey as string)
  }, [ctx, disabled, effectiveKey])

  // 无 context（单独使用）时自治展开
  const handleSelfToggle = useCallback(() => {
    if (disabled) return
    setInnerOpen((v) => !v)
  }, [disabled])

  return (
    <div className={className('sofa-submenu', open && 'sofa-submenu-open', cls)}>
      <div className="sofa-submenu-title" role="menuitem" aria-expanded={open} tabIndex={0} onClick={ctx ? handleToggle : handleSelfToggle}>
        {icon && <span className="sofa-menu-item-icon">{icon}</span>}
        <span className="sofa-submenu-title-label">{title}</span>
        <Icon type={open ? 'chevron-up' : 'chevron-down'} size={12} className="sofa-submenu-arrow" />
      </div>
      <div className="sofa-submenu-content" role="menu">
        {children}
      </div>
    </div>
  )
}

export function MenuItemGroup({ title, children }: MenuItemGroupProps) {
  return (
    <div className="sofa-menu-group">
      <div className="sofa-menu-group-title">{title}</div>
      {children}
    </div>
  )
}

export const Menu = function Menu({
  selectedKey,
  defaultSelectedKey,
  openKeys,
  defaultOpenKeys = [],
  horizontal = false,
  onSelect,
  onOpenChange,
  className: cls,
  children,
  ...rest
}: MenuProps) {
  const [innerSelected, setInnerSelected] = useState(defaultSelectedKey ?? '')
  const [innerOpenKeys, setInnerOpenKeys] = useState<string[]>(defaultOpenKeys)
  const isControlledSelected = selectedKey !== undefined
  const isControlledOpen = openKeys !== undefined
  const currentSelected = isControlledSelected ? selectedKey : innerSelected
  const currentOpenKeys = isControlledOpen ? openKeys : innerOpenKeys

  const select = useCallback(
    (key: string) => {
      onSelect?.(key)
      if (!isControlledSelected) setInnerSelected(key)
    },
    [onSelect, isControlledSelected]
  )

  const setOpen = useCallback(
    (keys: string[]) => {
      onOpenChange?.(keys)
      if (!isControlledOpen) setInnerOpenKeys(keys)
    },
    [onOpenChange, isControlledOpen]
  )

  const toggleOpen = useCallback(
    (key: string) => {
      const next = currentOpenKeys.includes(key) ? currentOpenKeys.filter((k) => k !== key) : [...currentOpenKeys, key]
      setOpen(next)
    },
    [currentOpenKeys, setOpen]
  )

  const contextValue = useMemo<MenuContextValue>(
    () => ({
      mode: horizontal ? 'horizontal' : 'inline',
      selectedKey: currentSelected,
      openKeys: currentOpenKeys,
      select,
      toggleOpen
    }),
    [horizontal, currentSelected, currentOpenKeys, select, toggleOpen]
  )

  // 将子元素 React key 注入 itemKey / subKey（React 会剥离 key prop）
  const normalizedChildren = Children.map(children, (child) => {
    if (!isValidElement(child) || child.key === undefined) return child
    const props = child.props as { itemKey?: string; subKey?: string }
    if (props.itemKey !== undefined || props.subKey !== undefined) return child
    return cloneElement(child, {
      [isSubMenuLike(child) ? 'subKey' : 'itemKey']: child.key
    } as Record<string, string>)
  })

  return (
    <MenuContext.Provider value={contextValue}>
      <div
        role="menu"
        className={className(
          'sofa-menu',
          horizontal ? 'sofa-menu-horizontal' : 'sofa-menu-inline',
          cls
        )}
        {...rest}
      >
        {normalizedChildren}
      </div>
    </MenuContext.Provider>
  )
}

/** 判断子元素是否为 SubMenu（按组件类型区分，避免与 MenuItemGroup 混淆） */
function isSubMenuLike(child: React.ReactElement): boolean {
  return child.type === SubMenu
}

export default Menu
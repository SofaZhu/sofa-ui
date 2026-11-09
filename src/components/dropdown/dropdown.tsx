import { useCallback, useMemo } from 'react'
import { className } from '@/utils/classNames'
import { usePop } from '@/hooks/usePop'
import type { PopPlacement, PopTrigger } from '@/hooks/usePop'
import { Icon } from '../icon/icon'

/**
 * Dropdown 下拉菜单：
 * - 支持 hover / click 触发
 * - menu 配置式（items 数组）或 children 自定义菜单
 */

export type DropdownMenuItem = {
  key: string
  label: React.ReactNode
  icon?: React.ReactNode
  disabled?: boolean
  danger?: boolean
  children?: DropdownMenuItem[]
}

export interface DropdownMenuProps {
  items: DropdownMenuItem[]
  onSelect?: (key: string) => void
}

export interface DropdownProps {
  /** 触发元素 */
  children: React.ReactNode
  /** 菜单配置 */
  menu: DropdownMenuProps
  /** 触发方式 */
  trigger?: PopTrigger
  placement?: PopPlacement
  /** 打开状态（受控） */
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  disabled?: boolean
}

function MenuList({ items, onSelect, depth = 0 }: DropdownMenuProps & { depth?: number }) {
  return (
    <ul className={className('sofa-dropdown-menu', depth > 0 && 'sofa-dropdown-submenu')}>
      {items.map((item) => {
        if (item.children) {
          return (
            <li key={item.key} className="sofa-dropdown-item sofa-dropdown-item-parent">
              <span className="sofa-dropdown-item-label">
                {item.icon && <span className="sofa-dropdown-item-icon">{item.icon}</span>}
                {item.label}
              </span>
              <Icon type="chevron-right" size={12} className="sofa-dropdown-item-arrow" />
              <MenuList items={item.children} onSelect={onSelect} depth={depth + 1} />
            </li>
          )
        }
        return (
          <li
            key={item.key}
            role="menuitem"
            tabIndex={item.disabled ? -1 : 0}
            aria-disabled={item.disabled || undefined}
            className={className(
              'sofa-dropdown-item',
              item.disabled && 'sofa-dropdown-item-disabled',
              item.danger && 'sofa-dropdown-item-danger'
            )}
            onClick={() => {
              if (!item.disabled) onSelect?.(item.key)
            }}
          >
            {item.icon && <span className="sofa-dropdown-item-icon">{item.icon}</span>}
            {item.label}
          </li>
        )
      })}
    </ul>
  )
}

export function Dropdown({
  children,
  menu,
  trigger = 'click',
  placement = 'bottomLeft',
  open: openProp,
  defaultOpen,
  onOpenChange,
  disabled = false
}: DropdownProps) {
  const { open, setOpen, anchorRef, popRef, events, placement: finalPlacement } = usePop({
    open: openProp,
    defaultOpen,
    onOpenChange,
    trigger,
    placement,
    disabled,
    widthRatio: menu.items.length > 0 ? 0 : 0
  })

  const handleSelect = useCallback(
    (key: string) => {
      menu.onSelect?.(key)
      setOpen(false)
    },
    [menu, setOpen]
  )

  const popContent = useMemo(
    () => <MenuList items={menu.items} onSelect={handleSelect} />,
    [menu.items, handleSelect]
  )

  return (
    <span className="sofa-dropdown" ref={anchorRef} {...events}>
      <span className="sofa-dropdown-trigger" aria-haspopup="menu" aria-expanded={open}>
        {children}
      </span>
      {open && (
        <div ref={popRef} className={className('sofa-popup', `sofa-popup-${finalPlacement}`, 'sofa-dropdown-popup')} role="menu">
          {popContent}
        </div>
      )}
    </span>
  )
}

export default Dropdown
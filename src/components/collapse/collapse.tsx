import { useCallback } from 'react'
import { className } from '@/utils/classNames'
import { useControlled } from '@/hooks/useControlled'
import { Icon } from '../icon/icon'

/**
 * Collapse 折叠面板：
 * 多面板展开/收起，支持手风琴、无边框幽灵风格、
 * 点击区域自定义与纯 CSS 展开动画（grid-template-rows 0fr→1fr）
 */

export interface CollapseItem {
  /** 唯一键 */
  key: string
  /** 标题 */
  label: React.ReactNode
  /** 内容区 */
  children?: React.ReactNode
  /** 是否禁用 */
  disabled?: boolean
}

export interface CollapseProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** 面板项 */
  items: CollapseItem[]
  /** 受控展开键（手风琴为字符串，多开为字符串数组） */
  activeKey?: string | string[]
  /** 默认展开键 */
  defaultActiveKey?: string | string[]
  /** 展开变化回调 */
  onChange?: (key: string | string[]) => void
  /** 手风琴模式：同时只展开一个 */
  accordion?: boolean
  /** 显示边框 */
  bordered?: boolean
  /** 幽灵风格：无边框无背景 */
  ghost?: boolean
  /** 可折叠区域：整行 / 仅箭头 / 不可折叠（始终展开） */
  collapsible?: 'header' | 'icon' | 'disabled'
}

/** 统一把 activeKey 归一为数组处理 */
function normalizeKeys(key: string | string[] | undefined): string[] {
  if (Array.isArray(key)) return key
  if (key == null || key === '') return []
  return [key]
}

export const Collapse = function Collapse({
  items,
  activeKey,
  defaultActiveKey,
  onChange,
  accordion = false,
  bordered = true,
  ghost = false,
  collapsible = 'header',
  className: cls,
  style,
  ...rest
}: CollapseProps) {
  const [innerKeys, setInnerKeys, isControlled] = useControlled<string[]>(
    activeKey !== undefined ? normalizeKeys(activeKey) : undefined,
    normalizeKeys(defaultActiveKey)
  )

  const toggle = useCallback(
    (key: string) => {
      const isActive = innerKeys.includes(key)
      let next: string[]
      if (accordion) {
        next = isActive ? [] : [key]
      } else {
        next = isActive ? innerKeys.filter((k) => k !== key) : [...innerKeys, key]
      }
      if (!isControlled) setInnerKeys(next)
      onChange?.(accordion ? next[0] ?? '' : next)
    },
    [accordion, innerKeys, isControlled, onChange, setInnerKeys]
  )

  const iconOnly = collapsible === 'icon'
  const forcedOpen = collapsible === 'disabled'

  return (
    <div
      className={className(
        'sofa-collapse',
        { 'sofa-collapse-bordered': bordered, 'sofa-collapse-ghost': ghost },
        cls
      )}
      style={style}
      {...rest}
    >
      {items.map((item) => {
        const isActive = forcedOpen || innerKeys.includes(item.key)
        const disabled = item.disabled
        const headerToggleable = !disabled && !forcedOpen && !iconOnly

        return (
          <div
            key={item.key}
            className={className('sofa-collapse-item', {
              'sofa-collapse-item-active': isActive,
              'sofa-collapse-item-disabled': disabled
            })}
          >
            <div
              className="sofa-collapse-header"
              role={headerToggleable ? 'button' : undefined}
              tabIndex={headerToggleable ? 0 : undefined}
              aria-expanded={isActive}
              onClick={() => headerToggleable && toggle(item.key)}
              onKeyDown={(e) => {
                if (!headerToggleable) return
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  toggle(item.key)
                }
              }}
            >
              <span className="sofa-collapse-label">{item.label}</span>
              <span
                role="button"
                tabIndex={disabled ? -1 : 0}
                aria-label="展开或收起"
                aria-disabled={disabled || forcedOpen}
                className="sofa-collapse-arrow"
                onClick={(e) => {
                  e.stopPropagation()
                  if (!disabled && !forcedOpen) toggle(item.key)
                }}
                onKeyDown={(e) => {
                  if (disabled || forcedOpen) return
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    toggle(item.key)
                  }
                }}
              >
                <Icon type="chevron-down" size={14} />
              </span>
            </div>
            <div className="sofa-collapse-content" aria-hidden={!isActive}>
              <div className="sofa-collapse-content-inner">{item.children}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Collapse
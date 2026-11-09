import { useCallback } from 'react'
import { className } from '@/utils/classNames'
import { useControlled } from '@/hooks/useControlled'
import { Icon } from '../icon/icon'

/**
 * Tabs 标签页：
 * 支持 line / card 两种风格、可关闭、居中布局
 */

export interface TabItem {
  /** 唯一键 */
  key: string
  /** 标签文字 */
  label: React.ReactNode
  /** 是否禁用 */
  disabled?: boolean
  /** 是否可关闭 */
  closable?: boolean
  /** 标签内容 */
  children?: React.ReactNode
  /** 图标 */
  icon?: React.ReactNode
}

export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** 标签项 */
  items: TabItem[]
  /** 受控激活键 */
  activeKey?: string
  /** 默认激活键 */
  defaultActiveKey?: string
  /** 切换回调 */
  onChange?: (key: string) => void
  /** 关闭回调 */
  onClose?: (key: string) => void
  /** 风格：line（下划线）/ card（卡片） */
  type?: 'line' | 'card'
  /** 标签居中 */
  centered?: boolean
  /** 是否保持已渲染内容不销毁 */
  keepAlive?: boolean
  /** 是否懒渲染（首次激活才渲染内容） */
  lazy?: boolean
}

export const Tabs = function Tabs({
  items,
  activeKey,
  defaultActiveKey,
  onChange,
  onClose,
  type = 'line',
  centered = false,
  keepAlive = false,
  lazy = true,
  className: cls,
  style,
  ...rest
}: TabsProps) {
  const [innerKey, setInnerKey, isControlled] = useControlled(activeKey, defaultActiveKey ?? items[0]?.key ?? '')

  const active = items.some((t) => t.key === innerKey) ? innerKey : items[0]?.key ?? ''

  const select = useCallback(
    (key: string) => {
      if (!isControlled) setInnerKey(key)
      onChange?.(key)
    },
    [isControlled, onChange, setInnerKey]
  )

  const handleClose = useCallback(
    (e: React.MouseEvent, key: string) => {
      e.stopPropagation()
      onClose?.(key)
      if (active === key) {
        const index = items.findIndex((t) => t.key === key)
        const next = items[index + 1] ?? items[index - 1]
        if (next) select(next.key)
      }
    },
    [onClose, active, items, select]
  )

  const activeItem = items.find((t) => t.key === active)

  return (
    <div className={className('sofa-tabs', `sofa-tabs-${type}`, centered && 'sofa-tabs-centered', cls)} style={style} {...rest}>
      <div className="sofa-tabs-header" role="tablist">
        {items.map((tab) => {
          const isActive = tab.key === active
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-disabled={tab.disabled}
              disabled={tab.disabled}
              className={className('sofa-tabs-tab', { 'sofa-tabs-tab-active': isActive })}
              onClick={() => !tab.disabled && select(tab.key)}
            >
              {tab.icon}
              <span className="sofa-tabs-tab-label">{tab.label}</span>
              {tab.closable && (
                <span
                  role="button"
                  aria-label="关闭标签页"
                  className="sofa-tabs-tab-close"
                  onClick={(e) => handleClose(e, tab.key)}
                >
                  <Icon type="close" size={10} />
                </span>
              )}
            </button>
          )
        })}
      </div>
      {activeItem?.children != null && (!lazy || activeItem.key === active || keepAlive) && (
        <div className="sofa-tabs-content" role="tabpanel">
          {activeItem.children}
        </div>
      )}
    </div>
  )
}

export default Tabs
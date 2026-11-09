import { useEffect, useRef, useState } from 'react'
import { className } from '@/utils/classNames'
import { useControlled } from '@/hooks/useControlled'
import { Icon } from '../icon/icon'

/**
 * Layout 布局容器：Header / Sider / Content / Footer 组合骨架
 * - Sider 支持折叠（手动按钮触发或断点自动收合）
 */

export interface LayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 是否包含侧边栏（有 Sider 时横向排布） */
  hasSider?: boolean
}

export interface SiderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 宽度（展开态） */
  width?: number | string
  /** 折叠宽度 */
  collapsedWidth?: number | string
  /** 受控折叠 */
  collapsed?: boolean
  /** 默认折叠 */
  defaultCollapsed?: boolean
  /** 折叠变化回调 */
  onCollapse?: (collapsed: boolean) => void
  /** 断点：窗口窄于断点宽度时自动折叠（'lg'=992, 'md'=768, 'sm'=576, 'xs'=480） */
  breakpoint?: 'lg' | 'md' | 'sm' | 'xs'
  /** 显示折叠触发器 */
  collapsible?: boolean
  /** 触发器位置 */
  trigger?: 'bottom' | 'top'
  /** 触发器自定义内容 */
  triggerContent?: React.ReactNode
  /** 主题 */
  theme?: 'light' | 'dark'
  /** 零宽折叠时仍保留触发表面 */
  zeroWidthTriggerStyle?: boolean
  children?: React.ReactNode
}

const BREAKPOINTS: Record<string, number> = { lg: 992, md: 768, sm: 576, xs: 480 }

export function Header({ className: cls, ...rest }: React.HTMLAttributes<HTMLElement>) {
  return <header className={className('sofa-layout-header', cls)} {...rest} />
}

export function Footer({ className: cls, ...rest }: React.HTMLAttributes<HTMLElement>) {
  return <footer className={className('sofa-layout-footer', cls)} {...rest} />
}

export function Content({ className: cls, ...rest }: React.HTMLAttributes<HTMLElement>) {
  return <main className={className('sofa-layout-content', cls)} {...rest} />
}

export interface SiderRenderProps {
  /** 渲染内容 */
  children?: React.ReactNode
}

export function Sider({
  width = 200,
  collapsedWidth = 64,
  collapsed,
  defaultCollapsed = false,
  onCollapse,
  breakpoint,
  collapsible = false,
  trigger = 'bottom',
  triggerContent,
  theme = 'light',
  className: cls,
  style,
  children,
  ...rest
}: SiderProps) {
  const [innerCollapsed, setInnerCollapsed, isControlled] = useControlled(collapsed, defaultCollapsed)
  const [belowBreakpoint, setBelowBreakpoint] = useState(false)
  const prevBelow = useRef(false)

  // 断点监听：进入窄屏自动折叠，退出恢复
  useEffect(() => {
    if (!breakpoint) return
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    const mql = window.matchMedia(`(max-width: ${BREAKPOINTS[breakpoint]}px)`)
    const onChange = (e: MediaQueryListEvent) => setBelowBreakpoint(e.matches)
    setBelowBreakpoint(mql.matches)
    try {
      mql.addEventListener('change', onChange)
    } catch {
      mql.addListener(onChange)
    }
    return () => {
      try {
        mql.removeEventListener('change', onChange)
      } catch {
        mql.removeListener(onChange)
      }
    }
  }, [breakpoint])

  // 断点翻转时联动折叠状态
  useEffect(() => {
    if (!breakpoint || belowBreakpoint === prevBelow.current) return
    prevBelow.current = belowBreakpoint
    if (!isControlled) setInnerCollapsed(belowBreakpoint)
    else onCollapse?.(belowBreakpoint)
  }, [belowBreakpoint, breakpoint, isControlled, onCollapse, setInnerCollapsed])

  const toggle = () => {
    const next = !innerCollapsed
    if (!isControlled) setInnerCollapsed(next)
    onCollapse?.(next)
  }

  const actualWidth = innerCollapsed ? collapsedWidth : width

  return (
    <aside
      className={className(
        'sofa-layout-sider',
        `sofa-layout-sider-${theme}`,
        innerCollapsed && 'sofa-layout-sider-collapsed',
        cls
      )}
      style={{
        flex: `0 0 ${typeof actualWidth === 'number' ? `${actualWidth}px` : actualWidth}`,
        width: typeof actualWidth === 'number' ? `${actualWidth}px` : actualWidth,
        ...style
      }}
      {...rest}
    >
      <div className="sofa-layout-sider-children">{children}</div>
      {collapsible && (
        <button
          type="button"
          aria-label={innerCollapsed ? '展开侧边栏' : '折叠侧边栏'}
          className={className('sofa-layout-sider-trigger', `sofa-layout-sider-trigger-${trigger}`)}
          onClick={toggle}
        >
          {triggerContent ?? <Icon type={innerCollapsed ? 'chevron-right' : 'chevron-left'} size={16} />}
        </button>
      )}
    </aside>
  )
}

export function Layout({ hasSider = false, className: cls, children, ...rest }: LayoutProps) {
  const siderCount = Array.isArray(children)
    ? children.filter((c) => (c as React.ReactElement)?.type === Sider).length
    : (children as React.ReactElement)?.type === Sider
      ? 1
      : 0

  return (
    <section
      className={className('sofa-layout', hasSider || siderCount > 0 ? 'sofa-layout-has-sider' : undefined, cls)}
      {...rest}
    >
      {children}
    </section>
  )
}

const LayoutNamespace = Object.assign(
  {},
  { Header, Sider, Content, Footer }
)

export default LayoutNamespace
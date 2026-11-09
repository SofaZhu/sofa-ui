import { useCallback, useEffect, useRef, useState } from 'react'
import { className } from '@/utils/classNames'

/**
 * Anchor 锚点：监听滚动位置高亮当前区块，点击平滑滚动到目标
 */

export interface AnchorLinkProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick' | 'title'> {
  /** 锚点标识（页面中对应元素的 id） */
  href: string
  /** 链接文案 */
  title: React.ReactNode
  /** 子链接 */
  children?: React.ReactNode
  /** 点击链接回调 */
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
}

export interface AnchorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** 滚动容器（默认 window） */
  target?: HTMLElement | (() => HTMLElement | null)
  /** 监听偏移量（滚动到距顶部该距离时触发高亮） */
  offsetTop?: number
  /** 点击滚动时预留的偏移 */
  scrollOffset?: number
  /** 当前高亮 id 变化回调 */
  onChange?: (currentId: string) => void
  /** 是否固定（position: sticky） */
  sticky?: boolean
}

/** 收集文档中目标元素的实际滚动偏移 */
function getElementTop(el: HTMLElement, target: HTMLElement | null): number {
  let top = el.offsetTop
  let parent = el.offsetParent as HTMLElement | null
  while (parent && parent !== target) {
    top += parent.offsetTop
    parent = parent.offsetParent as HTMLElement | null
  }
  return top
}

export function AnchorLink({ href, title, children, className: cls, onClick, ...rest }: AnchorLinkProps) {
  return (
    <div className={className('sofa-anchor-link', cls)} {...rest}>
      <a className="sofa-anchor-link-title" href={href} onClick={onClick}>
        {title}
      </a>
      {children && <div className="sofa-anchor-link-children">{children}</div>}
    </div>
  )
}

export const Anchor = function Anchor({
  target,
  offsetTop = 0,
  scrollOffset = 0,
  onChange,
  sticky = true,
  className: cls,
  children,
  ...rest
}: AnchorProps) {
  const [activeId, setActiveId] = useState('')
  const linksRef = useRef<Array<{ id: string; top: number }>>([])

  /** 收集所有锚点元素的位置 */
  const collectLinks = useCallback(() => {
    const root = target ? (typeof target === 'function' ? target() : target) : null
    const scope = root ?? document
    const nodes = scope.querySelectorAll<HTMLElement>('[id]')
    linksRef.current = Array.from(nodes).map((el) => ({
      id: el.id,
      top: getElementTop(el, root)
    }))
    linksRef.current.sort((a, b) => a.top - b.top)
  }, [target])

  /** 解析滚动容器：target() 可能返回 null，兜底 window */
  const resolveNode = (): HTMLElement | Window =>
    (target ? (typeof target === 'function' ? target() : target) : window) ?? window

  useEffect(() => {
    collectLinks()
    const node = resolveNode()
    const listener = () => {
      const scrollTop = node === window ? window.scrollY || document.documentElement.scrollTop : (node as HTMLElement).scrollTop
      const current = [...linksRef.current]
        .reverse()
        .find((l) => scrollTop + offsetTop >= l.top)
      const next = current ? current.id : ''
      setActiveId((prev) => {
        if (prev !== next) onChange?.(next)
        return next
      })
    }
    node.addEventListener('scroll', listener, { passive: true })
    listener()
    const timer = window.setTimeout(listener, 200)
    return () => {
      node.removeEventListener('scroll', listener)
      window.clearTimeout(timer)
    }
  }, [target, offsetTop, collectLinks, onChange])

  /** 点击锚点：平滑滚动 */
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = document.getElementById(e.currentTarget.hash.slice(1))
    if (!el) return
    e.preventDefault()
    const top = getElementTop(el, resolveNode() === window ? null : (resolveNode() as HTMLElement))
    const node = resolveNode()
    const dest = Math.max(0, top - scrollOffset)
    if (node === window) {
      window.scrollTo({ top: dest, behavior: 'smooth' })
    } else {
      ;(node as HTMLElement).scrollTo?.({ top: dest, behavior: 'smooth' })
    }
  }

  /** 把 AnchorLink 的 href 标记为当前高亮 */
  const links = Array.isArray(children) ? (children as React.ReactElement<AnchorLinkProps>[]) : children ? [children as React.ReactElement<AnchorLinkProps>] : []

  return (
    <div className={className('sofa-anchor', sticky && 'sofa-anchor-sticky', cls)} {...rest}>
      {links.map((child, i) => {
        if (child && (child as React.ReactElement).type === AnchorLink) {
          const element = child as React.ReactElement<AnchorLinkProps>
          const href = element.props.href
          const isActive = activeId === href.slice(1)
          return (
            <div
              key={href ?? i}
              className={className('sofa-anchor-link-wrapper', isActive && 'sofa-anchor-link-active')}
            >
              <AnchorLink
                {...element.props}
                className={className(element.props.className, isActive && 'sofa-anchor-link-active')}
                onClick={(e) => {
                  element.props.onClick?.(e)
                  if (!e.defaultPrevented) handleClick(e)
                }}
              />
            </div>
          )
        }
        return child
      })}
    </div>
  )
}

export default Anchor
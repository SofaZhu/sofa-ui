import { useEffect, useState } from 'react'
import { className } from '@/utils/classNames'
import { Icon } from '../icon/icon'

/**
 * BackTop 回到顶部：页面滚动后显示按钮，点击平滑回到顶部
 */

export interface BackTopProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 滚动容器（默认 window） */
  target?: HTMLElement | (() => HTMLElement | null)
  /** 显示按钮的滚动高度阈值 */
  visibilityHeight?: number
  /** 是否平滑滚动 */
  smooth?: boolean
}

/** 获取滚动容器元素 */
function getTargetNode(target: BackTopProps['target']): HTMLElement | null {
  if (!target) return null
  return typeof target === 'function' ? target() : target
}

export function BackTop({
  target,
  visibilityHeight = 400,
  smooth = true,
  className: cls,
  children,
  onClick,
  ...rest
}: BackTopProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = getTargetNode(target) ?? window
    const listener = () => {
      const scrollTop = node === window ? window.scrollY || document.documentElement.scrollTop : (node as HTMLElement).scrollTop
      setVisible(scrollTop > visibilityHeight)
    }
    node.addEventListener('scroll', listener, { passive: true })
    listener()
    return () => node.removeEventListener('scroll', listener)
  }, [target, visibilityHeight])

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    onClick?.(e)
    const node = getTargetNode(target) ?? window
    if (node === window) {
      window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' })
    } else {
      ;(node as HTMLElement).scrollTo?.({ top: 0, behavior: smooth ? 'smooth' : 'auto' })
    }
  }

  return (
    <div
      className={className('sofa-back-top', !visible && 'sofa-back-top-hidden', cls)}
      role="button"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      onClick={handleClick}
      {...rest}
    >
      {children ?? <Icon type="arrow-up" size={18} />}
    </div>
  )
}

export default BackTop

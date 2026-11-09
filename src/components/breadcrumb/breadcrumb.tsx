import { forwardRef } from 'react'
import { className } from '@/utils/classNames'

/**
 * Breadcrumb 面包屑：层级导航，支持自定义分隔符
 */

export interface BreadcrumbItem {
  /** 文字或自定义内容 */
  title: React.ReactNode
  /** 链接 */
  href?: string
  /** 图标 */
  icon?: React.ReactNode
}

export interface BreadcrumbProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  /** 面包屑层级 */
  items?: BreadcrumbItem[]
  /** 自定义分隔符 */
  separator?: React.ReactNode
  /** 子节点方式（替代 items） */
  children?: React.ReactNode
}

export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb(
  { items = [], separator = '/', children, className: cls, style, ...rest },
  ref
) {
  const renderItem = (item: BreadcrumbItem, isLast: boolean) => {
    const content = (
      <>
        {item.icon && <span className="sofa-breadcrumb-icon">{item.icon}</span>}
        {item.title}
      </>
    )
    if (item.href && !isLast) {
      return <a className="sofa-breadcrumb-link" href={item.href}>{content}</a>
    }
    return <span className="sofa-breadcrumb-current">{content}</span>
  }

  return (
    <nav ref={ref} aria-label="面包屑" className={className('sofa-breadcrumb', cls)} style={style} {...rest}>
      <ol className="sofa-breadcrumb-list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={index} className="sofa-breadcrumb-item">
              {renderItem(item, isLast)}
              {!isLast && <span className="sofa-breadcrumb-separator" aria-hidden="true">{separator}</span>}
            </li>
          )
        })}
        {children}
      </ol>
    </nav>
  )
})

export default Breadcrumb
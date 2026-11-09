import { forwardRef } from 'react'
import { className } from '@/utils/classNames'

/**
 * Col 栅格列：span 为 24 分栅格数，支持偏移、排序与响应式断点配置
 */

type ColSpan = number | 'auto'

export interface ColProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** 栅格占位数（1~24，或 auto） */
  span?: ColSpan
  /** 向右偏移的栅格数 */
  offset?: number
  /** 排序（越小越靠前） */
  order?: number
  /** 左侧推入栅格数 */
  pull?: number
  /** 右侧推出栅格数 */
  push?: number
  /** 响应式：xs 及以上 */
  xs?: ColSpan | { span?: ColSpan; offset?: number }
  sm?: ColSpan | { span?: ColSpan; offset?: number }
  md?: ColSpan | { span?: ColSpan; offset?: number }
  lg?: ColSpan | { span?: ColSpan; offset?: number }
  xl?: ColSpan | { span?: ColSpan; offset?: number }
  xxl?: ColSpan | { span?: ColSpan; offset?: number }
  /** 是否隐藏 */
  hidden?: boolean
  children?: React.ReactNode
}

/** 解析单个响应式断点配置，返回其 CSS 规则片段 */

export const Col = forwardRef<HTMLDivElement, ColProps>(function Col(
  {
    span,
    offset = 0,
    order,
    pull,
    push,
    xs,
    sm,
    md,
    lg,
    xl,
    xxl,
    hidden = false,
    children,
    className: cls,
    style,
    ...rest
  },
  ref
) {
  // 响应式断点类名：由 CSS 媒体查询驱动（样式定义在 col.css）
  const responsive = className(
    xs !== undefined && `sofa-col-xs-${typeof xs === 'object' ? (xs.span ?? 24) : xs}`,
    sm !== undefined && `sofa-col-sm-${typeof sm === 'object' ? (sm.span ?? 24) : sm}`,
    md !== undefined && `sofa-col-md-${typeof md === 'object' ? (md.span ?? 24) : md}`,
    lg !== undefined && `sofa-col-lg-${typeof lg === 'object' ? (lg.span ?? 24) : lg}`,
    xl !== undefined && `sofa-col-xl-${typeof xl === 'object' ? (xl.span ?? 24) : xl}`,
    xxl !== undefined && `sofa-col-xxl-${typeof xxl === 'object' ? (xxl.span ?? 24) : xxl}`
  )

  const baseStyle: React.CSSProperties = {}
  if (span !== undefined) {
    if (span === 'auto') {
      baseStyle.flex = 'none'
      baseStyle.width = 'auto'
    } else {
      baseStyle.flex = `0 0 ${(span / 24) * 100}%`
      baseStyle.maxWidth = `${(span / 24) * 100}%`
    }
  }
  if (offset) baseStyle.marginLeft = `${(offset / 24) * 100}%`
  if (order !== undefined) baseStyle.order = order
  if (pull) baseStyle.marginRight = `${(pull / 24) * 100}%`
  if (push) baseStyle.marginLeft = `${(push / 24) * 100}%`
  if (hidden) baseStyle.display = 'none'

  return (
    <div
      ref={ref}
      className={className('sofa-col', responsive, cls)}
      style={{ ...baseStyle, ...style }}
      {...rest}
    >
      {children}
    </div>
  )
})

export default Col
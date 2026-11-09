import { forwardRef } from 'react'
import { className } from '@/utils/classNames'

/**
 * Badge 徽标：数字角标 / 状态点 / 自定义内容三种形态
 */

export type BadgeStatus = 'success' | 'warning' | 'error' | 'info' | 'primary' | 'default'

export interface BadgeProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'> {
  /** 显示的数字内容 */
  count?: React.ReactNode
  /** 数字超出 overflowCount 时显示为 「overflowCount+」 */
  overflowCount?: number
  /** 数值为 0 时是否显示 */
  showZero?: boolean
  /** 小圆点模式 */
  dot?: boolean
  /** 状态点模式（与 dot 互斥，dot 优先） */
  status?: BadgeStatus
  /** 自定义角标颜色（十六进制色值） */
  color?: string
  /** 角标偏移量 */
  offset?: [number, number]
  /** 内容（角标所依附的节点） */
  children?: React.ReactNode
  /** 用户鼠标悬停时角标的文字提示 */
  title?: string
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  {
    count,
    overflowCount = 99,
    showZero = false,
    dot = false,
    status,
    color,
    offset,
    children,
    title,
    className: cls,
    style,
    ...rest
  },
  ref
) {
  const countValue = typeof count === 'number' ? count : 0
  const showCount =
    count !== undefined && !dot && !status && (showZero || countValue > 0)
  const displayCount =
    typeof count === 'number' && countValue > overflowCount
      ? `${overflowCount}+`
      : count

  const innerDot = (
    <span
      className={className('sofa-badge-dot', status && `sofa-badge-dot-${status}`)}
      style={color ? { backgroundColor: color } : undefined}
    />
  )

  const innerCount = showCount ? (
    <sup
      className="sofa-badge-count"
      title={title}
      style={{
        backgroundColor: color,
        transform: offset && `translate(${offset[0]}px, ${offset[1]}px)`
      }}
    >
      {displayCount}
    </sup>
  ) : (dot || status) ? (
    <sup
      className="sofa-badge-sup"
      style={{
        transform: offset && `translate(${offset[0]}px, ${offset[1]}px)`
      }}
    >
      {innerDot}
    </sup>
  ) : null

  return (
    <span ref={ref} className={className('sofa-badge', cls)} style={style} {...rest}>
      {children}
      {innerCount}
    </span>
  )
})

export default Badge
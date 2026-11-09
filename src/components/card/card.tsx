import { forwardRef } from 'react'
import { className } from '@/utils/classNames'

/**
 * Card 卡片：
 * 标题 + 操作区 + 封面 + 悬浮效果
 */

export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** 卡片标题 */
  title?: React.ReactNode
  /** 右上角操作区 */
  extra?: React.ReactNode
  /** 封面图 */
  cover?: React.ReactNode
  /** 底部内容 */
  footer?: React.ReactNode
  /** 显示边框 */
  bordered?: boolean
  /** 悬浮时阴影加深 */
  hoverable?: boolean
  /** 内容区域自定义样式 */
  bodyStyle?: React.CSSProperties
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  {
    title,
    extra,
    cover,
    footer,
    bordered = true,
    hoverable = false,
    bodyStyle,
    children,
    className: cls,
    style,
    ...rest
  },
  ref
) {
  const showHeader = title != null || extra != null

  return (
    <div
      ref={ref}
      className={className(
        'sofa-card',
        { 'sofa-card-bordered': bordered, 'sofa-card-hoverable': hoverable },
        cls
      )}
      style={style}
      {...rest}
    >
      {cover != null && <div className="sofa-card-cover">{cover}</div>}
      {showHeader && (
        <div className="sofa-card-header">
          {title != null && <div className="sofa-card-title">{title}</div>}
          {extra != null && <div className="sofa-card-extra">{extra}</div>}
        </div>
      )}
      <div className="sofa-card-body" style={bodyStyle}>
        {children}
      </div>
      {footer != null && <div className="sofa-card-footer">{footer}</div>}
    </div>
  )
})

export default Card
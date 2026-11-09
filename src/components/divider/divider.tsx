import { forwardRef } from 'react'
import { className } from '@/utils/classNames'

/**
 * Divider 分割线：水平 / 垂直两种方向，支持带标题与对齐方式
 */

export interface DividerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** 垂直分割线 */
  vertical?: boolean
  /** 虚线 */
  dashed?: boolean
  /** 标题位置 */
  orientation?: 'left' | 'center' | 'right'
  /** 标题（或任意内容） */
  children?: React.ReactNode
}

export const Divider = forwardRef<HTMLDivElement, DividerProps>(function Divider(
  {
    vertical = false,
    dashed = false,
    orientation = 'center',
    children,
    className: cls,
    style,
    ...rest
  },
  ref
) {
  if (vertical) {
    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation="vertical"
        className={className('sofa-divider', 'sofa-divider-vertical', dashed && 'sofa-divider-dashed', cls)}
        style={style}
        {...rest}
      />
    )
  }

  const hasContent = children != null && children !== ''

  return (
    <div
      ref={ref}
      role="separator"
      className={className(
        'sofa-divider',
        `sofa-divider-${orientation}`,
        dashed && 'sofa-divider-dashed',
        !hasContent && 'sofa-divider-plain',
        cls
      )}
      style={style}
      {...rest}
    >
      {hasContent && <span className="sofa-divider-title">{children}</span>}
    </div>
  )
})

export default Divider
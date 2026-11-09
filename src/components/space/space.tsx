import { forwardRef, Children, Fragment } from 'react'
import { className } from '@/utils/classNames'

/**
 * Space 间距容器：为子元素提供统一的水平 / 垂直间距；
 * size 预设（small/middle/large），支持数组横向纵向分别设值
 */

export type SpaceSize = number | string | 'small' | 'middle' | 'large'
export type SpaceDirection = 'horizontal' | 'vertical'

/** 预设间距映射 */
export const SPACE_SIZE_MAP: Record<string, number> = {
  small: 8,
  middle: 16,
  large: 24
}

export interface SpaceProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** 排列方向 */
  direction?: SpaceDirection
  /** 间距：数值、预设或 [横向, 纵向] */
  size?: SpaceSize | [SpaceSize, SpaceSize]
  /** 是否换行 */
  wrap?: boolean
  /** 对齐方式 */
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch'
  /** 元素间的分隔节点 */
  split?: React.ReactNode
  children?: React.ReactNode
}

function normalizeSize(size: SpaceSize): number {
  if (typeof size === 'number') return size
  if (typeof size === 'string') {
    const mapped = SPACE_SIZE_MAP[size]
    return mapped !== undefined ? mapped : parseFloat(size) || 0
  }
  return 0
}

export const Space = forwardRef<HTMLDivElement, SpaceProps>(function Space(
  {
    direction = 'horizontal',
    size = 'small',
    wrap = false,
    align = 'center',
    split,
    children,
    className: cls,
    style,
    ...rest
  },
  ref
) {
  const isArray = Array.isArray(size)
  const gapH = normalizeSize(isArray ? size[0] : size)
  const gapV = normalizeSize(isArray ? size[1] : size)

  // 展平 fragment 子节点，保证 split 分隔符插位置正确
  const flattened = Children.toArray(children)

  return (
    <div
      ref={ref}
      className={className('sofa-space', `sofa-space-${direction}`, wrap && 'sofa-space-wrap', cls)}
      style={{
        gap: `${gapV}px ${gapH}px`,
        alignItems: align === 'start' ? 'flex-start' : align === 'end' ? 'flex-end' : align,
        ...style
      }}
      {...rest}
    >
      {flattened.map((child, index) => (
        <Fragment key={index}>
          {child}
          {split !== undefined && index < flattened.length - 1 && (
            <span className="sofa-space-split" aria-hidden="true">
              {split}
            </span>
          )}
        </Fragment>
      ))}
    </div>
  )
})

export default Space
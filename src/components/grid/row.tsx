import { forwardRef } from 'react'
import { className } from '@/utils/classNames'
import { SPACE_SIZE_MAP } from '../space/space'

/**
 * Row 栅格行：24 列栅格体系
 */

export type GutterValue = number | string | 'small' | 'middle' | 'large'
/** 响应式栅格配置：断点 → 间距 */
export type Gutter = GutterValue | [GutterValue, GutterValue] | Partial<Record<Breakpoint, GutterValue>>

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'

export const BREAKPOINTS: Array<{ key: Breakpoint; minWidth: number }> = [
  { key: 'xs', minWidth: 0 },
  { key: 'sm', minWidth: 576 },
  { key: 'md', minWidth: 768 },
  { key: 'lg', minWidth: 992 },
  { key: 'xl', minWidth: 1200 },
  { key: 'xxl', minWidth: 1600 }
]

export interface RowProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** 栅格间距 */
  gutter?: Gutter
  /** 水平对齐 */
  justify?: 'start' | 'end' | 'center' | 'space-around' | 'space-between' | 'space-evenly'
  /** 垂直对齐 */
  align?: 'top' | 'middle' | 'bottom' | 'stretch'
  /** 是否自动换行 */
  wrap?: boolean
  children?: React.ReactNode
}

function toGutterNumber(value: GutterValue | undefined): number {
  if (value === undefined) return 0
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const mapped = SPACE_SIZE_MAP[value]
    return mapped !== undefined ? mapped : parseFloat(value) || 0
  }
  return 0
}

export const Row = forwardRef<HTMLDivElement, RowProps>(function Row(
  {
    gutter = 0,
    justify = 'start',
    align = 'top',
    wrap = true,
    children,
    className: cls,
    style,
    ...rest
  },
  ref
) {
  let gapH = 0
  let gapV = 0
  if (Array.isArray(gutter)) {
    gapH = toGutterNumber(gutter[0])
    gapV = toGutterNumber(gutter[1])
  } else if (typeof gutter === 'object' && gutter !== null) {
    // 响应式间距：取当前视口对应的断点值
    const width = typeof window !== 'undefined' ? window.innerWidth : 1920
    let current: Breakpoint = 'xs'
    BREAKPOINTS.forEach((bp) => {
      if (width >= bp.minWidth) current = bp.key
    })
    gapH = toGutterNumber(gutter[current])
  } else {
    gapH = toGutterNumber(gutter)
  }

  return (
    <div
      ref={ref}
      className={className(
        'sofa-row',
        `sofa-row-justify-${justify}`,
        `sofa-row-align-${align}`,
        !wrap && 'sofa-row-nowrap',
        cls
      )}
      style={{ rowGap: gapV, columnGap: gapH, ...style }}
      {...rest}
    >
      {children}
    </div>
  )
})

export default Row
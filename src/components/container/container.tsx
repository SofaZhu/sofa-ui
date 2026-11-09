import { className } from '@/utils/classNames'

/**
 * Container 宽屏容器：限定最大宽度并水平居中，可选内边距与全宽模式
 */

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 最大宽度：数字按像素处理，字符串原样传入 */
  maxWidth?: number | string
  /** 全宽模式，忽略 maxWidth */
  fluid?: boolean
  /** 内边距：数字按像素，字符串原样传入 */
  gutter?: number | string
  /** 水平居中 */
  centered?: boolean
}

export const Container = function Container({
  maxWidth = '1200px',
  fluid = false,
  gutter = 16,
  centered = true,
  className: cls,
  style,
  ...rest
}: ContainerProps) {
  const computedStyle: React.CSSProperties = {
    maxWidth: fluid ? undefined : typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
    padding: typeof gutter === 'number' ? `0 ${gutter}px` : `0 ${gutter}`,
    ...style
  }

  return (
    <div
      className={className('sofa-container', { 'sofa-container-fluid': fluid, 'sofa-container-centered': centered }, cls)}
      style={computedStyle}
      {...rest}
    />
  )
}

export default Container
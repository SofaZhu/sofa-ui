import { className } from '@/utils/classNames'

/**
 * Spin 加载中：
 * 容器包裹时显示遮罩加载层，可全屏使用
 */

export interface SpinProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** 是否加载中 */
  spinning?: boolean
  /** 尺寸 */
  size?: 'small' | 'default' | 'large'
  /** 加载文案 */
  tip?: React.ReactNode
  /** 是否展示为全屏遮罩（挂载到 body） */
  fullscreen?: boolean
  children?: React.ReactNode
}

const SIZE_MAP = {
  small: 16,
  default: 24,
  large: 36
} as const

const SPIN_SVG_PATH =
  'M12 3a9 9 0 1 0 9 9'

export function Spin({
  spinning = true,
  size = 'default',
  tip,
  fullscreen = false,
  children,
  className: cls,
  style,
  ...rest
}: SpinProps) {
  const spinner = (
    <span className={className('sofa-spin', fullscreen && 'sofa-spin-fullscreen', cls)} style={style} {...rest}>
      <svg viewBox="0 0 24 24" width={SIZE_MAP[size]} height={SIZE_MAP[size]} className="sofa-spin-icon">
        <path
          d={SPIN_SVG_PATH}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
      {tip != null && <span className="sofa-spin-tip">{tip}</span>}
    </span>
  )

  if (!children) {
    return spinning ? spinner : null
  }

  return (
    <div className={className('sofa-spin-wrapper', { 'sofa-spin-wrapper-spinning': spinning })}>
      {children}
      {spinning && (
        <div className="sofa-spin-mask">
          {spinner}
        </div>
      )}
    </div>
  )
}

export default Spin
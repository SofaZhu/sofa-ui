import { className } from '@/utils/classNames'

/**
 * Progress 进度条：
 * 直线 / 环形两种形态，支持状态色与自定义颜色
 */

export type ProgressStatus = 'normal' | 'success' | 'exception' | 'warning'

export interface ProgressProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** 百分比（0~100） */
  percentage?: number
  /** 形态：line 直线 / circle 环形 / dashboard 仪表盘 */
  type?: 'line' | 'circle' | 'dashboard'
  /** 状态 */
  status?: ProgressStatus
  /** 自定义颜色（十六进制色值或渐变） */
  strokeColor?: string
  /** 进度条宽度 */
  strokeWidth?: number
  /** 是否显示数值文字 */
  showText?: boolean
  /** 数值文字模板 */
  format?: (percent: number) => React.ReactNode
  /** 是否展示为条纹 */
  striped?: boolean
  /** 是否有动画 */
  animated?: boolean
  /** 圆环直径 */
  size?: number
}

const STATUS_COLOR = {
  normal: 'var(--sofa-color-primary)',
  success: 'var(--sofa-color-success)',
  exception: 'var(--sofa-color-error)',
  warning: 'var(--sofa-color-warning)'
} as const

export function Progress({
  percentage = 0,
  type = 'line',
  status = 'normal',
  strokeColor,
  strokeWidth,
  showText = true,
  format,
  striped = false,
  animated = false,
  size = 120,
  className: cls,
  style,
  ...rest
}: ProgressProps) {
  const percent = Math.min(100, Math.max(0, percentage))
  const color = strokeColor ?? STATUS_COLOR[status]

  const renderText = () => {
    if (!showText) return null
    if (format) return format(percent)
    if (status === 'exception') return '✗'
    if (status === 'success') return '✓'
    return `${percent}%`
  }

  // 直线形态
  if (type === 'line') {
    const barHeight = strokeWidth ?? 8
    return (
      <div className={className('sofa-progress', 'sofa-progress-line', cls)} style={style} {...rest}>
        <div
          className={className('sofa-progress-bar', striped && 'sofa-progress-striped', animated && 'sofa-progress-animated')}
          style={{ height: barHeight }}
        >
          <div
            className="sofa-progress-bar-inner"
            style={{
              width: `${percent}%`,
              backgroundColor: color,
              transition: 'width 0.3s ease'
            }}
          />
        </div>
        {showText && <div className="sofa-progress-text">{renderText()}</div>}
      </div>
    )
  }

  // 圆环 / 仪表盘形态：SVG 圆弧
  const isDashboard = type === 'dashboard'
  const stroke = strokeWidth ?? (isDashboard ? 12 : 10)
  // 半径随描边自适应，保证圆环完整落入 viewBox 不被裁剪
  const radius = 50 - stroke / 2
  const dashOffset = radius * 2 * Math.PI
  const arcRatio = isDashboard ? 0.75 : 1
  const filled = (dashOffset * arcRatio * percent) / 100
  const empty = dashOffset * arcRatio - filled
  const rotate = isDashboard ? 135 : -90

  return (
    <div className={className('sofa-progress', `sofa-progress-${type}`, cls)} style={{ ...style }} {...rest}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="var(--sofa-fill-color)"
          strokeWidth={stroke}
          strokeLinecap="round"
          transform={`rotate(${rotate} 50 50)`}
          strokeDasharray={`${dashOffset * arcRatio} ${dashOffset * (1 - arcRatio)}`}
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          transform={`rotate(${rotate} 50 50)`}
          strokeDasharray={`${filled} ${empty + dashOffset * (1 - arcRatio)}`}
          style={{ transition: 'stroke-dasharray 0.3s ease' }}
        />
      </svg>
      <div className="sofa-progress-circle-text">{renderText()}</div>
    </div>
  )
}

export default Progress
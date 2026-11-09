import { className } from '@/utils/classNames'
import { Spin } from '../spin/spin'

/**
 * Statistic 统计数值：
 * 纯展示类数字组件，支持精度、千分位、前后缀、
 * 自定义格式化与加载态
 */

export interface StatisticProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title' | 'prefix'> {
  /** 标题 */
  title?: React.ReactNode
  /** 数值或字符串 */
  value: number | string
  /** 小数位精度 */
  precision?: number
  /** 数值前缀 */
  prefix?: React.ReactNode
  /** 数值后缀 */
  suffix?: React.ReactNode
  /** 千分位分隔符（默认逗号） */
  groupSeparator?: string
  /** 加载中（替换数值为加载指示） */
  loading?: boolean
  /** 自定义格式化，优先级最高 */
  formatter?: (value: number | string) => string
  /** 数值语义色 */
  color?: 'default' | 'success' | 'warning' | 'error'
}

/** 对整数部分做千分位分组 */
function groupInteger(text: string, separator: string): string {
  const [int, decimal] = text.split('.')
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, separator)
  return decimal !== undefined ? `${grouped}.${decimal}` : grouped
}

/** 输出格式化后的数值文本 */
export function formatStatisticValue(
  value: number | string,
  options: { precision?: number; groupSeparator?: string; formatter?: (v: number | string) => string } = {}
): string {
  const { precision, groupSeparator = ',', formatter } = options
  if (formatter) return formatter(value)
  if (typeof value === 'number') {
    const text = precision !== undefined ? value.toFixed(precision) : String(value)
    return groupSeparator === '' ? text : groupInteger(text, groupSeparator)
  }
  return value
}

export function Statistic({
  title,
  value,
  precision,
  prefix,
  suffix,
  groupSeparator = ',',
  loading = false,
  formatter,
  color = 'default',
  className: cls,
  style,
  ...rest
}: StatisticProps) {
  const text = formatStatisticValue(value, { precision, groupSeparator, formatter })

  return (
    <div
      className={className('sofa-statistic', `sofa-statistic-${color}`, cls)}
      style={style}
      {...rest}
    >
      {title != null && <div className="sofa-statistic-title">{title}</div>}
      <div className="sofa-statistic-content">
        {loading ? (
          <Spin size="small" />
        ) : (
          <>
            {prefix != null && <span className="sofa-statistic-prefix">{prefix}</span>}
            <span className="sofa-statistic-value">{text}</span>
            {suffix != null && <span className="sofa-statistic-suffix">{suffix}</span>}
          </>
        )}
      </div>
    </div>
  )
}

export default Statistic
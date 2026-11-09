import { useCallback } from 'react'
import { className } from '@/utils/classNames'
import { useControlled } from '@/hooks/useControlled'
import { Icon } from '../icon/icon'

/**
 * Rate 评分：支持半星、禁用与自定义字符
 */

export interface RateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** 受控评分值 */
  value?: number
  /** 默认值 */
  defaultValue?: number
  /** 总星数 */
  count?: number
  /** 是否允许半星 */
  allowHalf?: boolean
  /** 是否可清除（再次点击同分值归零） */
  allowClear?: boolean
  /** 禁用 */
  disabled?: boolean
  /** 变化回调 */
  onChange?: (score: number) => void
  /** 自定义评分字符 */
  character?: React.ReactNode
  /** 字符大小 */
  size?: number
}

export const Rate = function Rate({
  value,
  defaultValue = 0,
  count = 5,
  allowHalf = false,
  allowClear = true,
  disabled = false,
  onChange,
  character = null,
  size = 24,
  className: cls,
  style,
  ...rest
}: RateProps) {
  const [innerValue, setInnerValue, isControlled] = useControlled(value, defaultValue)

  /** 根据点击位置计算分值（支持半星） */
  const scoreFromEvent = useCallback(
    (e: React.MouseEvent, starIndex: number): number => {
      const rect = e.currentTarget.getBoundingClientRect()
      const ratio = (e.clientX - rect.left) / rect.width
      let score = starIndex + 1
      if (allowHalf && ratio < 0.5) score = starIndex + 0.5
      if (allowClear && Math.abs(innerValue - score) < 0.001) score = 0
      return score
    },
    [allowHalf, allowClear, innerValue]
  )

  const select = useCallback(
    (score: number) => {
      if (disabled) return
      if (!isControlled) setInnerValue(score)
      onChange?.(score)
    },
    [disabled, isControlled, onChange, setInnerValue]
  )

  return (
    <div
      className={className('sofa-rate', { 'sofa-rate-disabled': disabled }, cls)}
      style={{ gap: 4, ...style }}
      role="radiogroup"
      {...rest}
    >
      {Array.from({ length: count }, (_, i) => {
        const starValue = i + 1
        const isFull = innerValue >= starValue
        const isHalf = allowHalf && innerValue >= starValue - 0.5 && innerValue < starValue
        return (
          <span
            key={i}
            className={className('sofa-rate-item', {
              'sofa-rate-item-full': isFull,
              'sofa-rate-item-half': isHalf
            })}
            style={{ fontSize: size, width: size }}
            onClick={(e) => select(scoreFromEvent(e, i))}
            role="radio"
            aria-checked={isFull}
            tabIndex={disabled ? -1 : 0}
          >
            <span className="sofa-rate-star-bg">
              {character ?? <Icon type="star" size={size} />}
            </span>
            <span
              className="sofa-rate-star-fg"
              style={{ width: isFull ? '100%' : isHalf ? '50%' : '0%' }}
            >
              {character ?? <Icon type="star-filled" size={size} />}
            </span>
          </span>
        )
      })}
      <span className="sofa-rate-text" style={{ fontSize: size * 0.7 }}>
        {innerValue > 0 ? `${innerValue} / ${count}` : ''}
      </span>
    </div>
  )
}

export default Rate
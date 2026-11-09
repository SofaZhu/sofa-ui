import { useCallback } from 'react'
import { className } from '@/utils/classNames'
import { useControlled } from '@/hooks/useControlled'

/**
 * Segmented 分段控制器：互斥选项切换，选中高亮过渡，方向键移动焦点
 */

export interface SegmentedOption {
  /** 选项值 */
  value: string | number
  /** 显示文本 */
  label?: React.ReactNode
  /** 图标 */
  icon?: React.ReactNode
  /** 禁用 */
  disabled?: boolean
}

export interface SegmentedProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** 选项：字符串或对象数组 */
  options: Array<SegmentedOption | string | number>
  /** 受控选中值 */
  value?: string | number
  /** 默认选中值 */
  defaultValue?: string | number
  /** 变化回调 */
  onChange?: (value: string | number) => void
  /** 全宽自适应 */
  block?: boolean
  /** 尺寸 */
  size?: 'small' | 'default' | 'large'
  /** 禁用整体 */
  disabled?: boolean
}

export const Segmented = function Segmented({
  options,
  value,
  defaultValue,
  onChange,
  block = false,
  size = 'default',
  disabled = false,
  className: cls,
  style,
  ...rest
}: SegmentedProps) {
  const list = options.map((opt) => (typeof opt === 'object' && opt !== null ? opt : { value: opt })) as SegmentedOption[]
  const [innerValue, setInnerValue, isControlled] = useControlled<string | number>(value, defaultValue ?? list[0]?.value)

  const activeValue = list.some((o) => o.value === innerValue) ? innerValue : list[0]?.value

  const select = useCallback(
    (next: string | number) => {
      if (disabled) return
      if (!isControlled) setInnerValue(next)
      onChange?.(next)
    },
    [disabled, isControlled, onChange, setInnerValue]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      const enableIndexes: number[] = []
      list.forEach((o, i) => {
        if (!o.disabled) enableIndexes.push(i)
      })
      let step = 0
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') step = 1
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') step = -1
      else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        const opt = list[index]
        if (opt && !opt.disabled) select(opt.value)
        return
      }
      if (step === 0) return
      e.preventDefault()
      const current = enableIndexes.indexOf(index)
      const nextIndex = enableIndexes[(current + step + enableIndexes.length) % enableIndexes.length]
      const next = list[nextIndex]
      if (next) select(next.value)
    },
    [list, select]
  )

  return (
    <div
      role="radiogroup"
      aria-label="分段控制器"
      className={className('sofa-segmented', `sofa-segmented-${size}`, block && 'sofa-segmented-block', disabled && 'sofa-segmented-disabled', cls)}
      style={style}
      {...rest}
    >
      {list.map((opt, index) => {
        const active = opt.value === activeValue
        return (
          <button
            key={String(opt.value)}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active || index === 0 ? 0 : -1}
            disabled={disabled || opt.disabled}
            className={className(
              'sofa-segmented-item',
              {
                'sofa-segmented-item-active': active,
                'sofa-segmented-item-disabled': disabled || opt.disabled
              }
            )}
            onClick={() => select(opt.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          >
            {opt.icon && <span className="sofa-segmented-icon">{opt.icon}</span>}
            <span className="sofa-segmented-label">{opt.label ?? String(opt.value)}</span>
          </button>
        )
      })}
    </div>
  )
}

export default Segmented
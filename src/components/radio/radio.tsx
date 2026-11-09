import { useCallback } from 'react'
import { className } from '@/utils/classNames'
import { useControlled } from '@/hooks/useControlled'

/**
 * Radio 单选框（含 Group 分组与按钮形态）
 */

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  /** 是否选中 */
  checked?: boolean
  /** 默认选中 */
  defaultChecked?: boolean
  /** 值（Group 模式回传用） */
  value?: string | number
  /** 变化回调 */
  onChange?: (checked: boolean, value?: string | number) => void
  children?: React.ReactNode
}

export const Radio = function Radio({
  checked,
  defaultChecked = false,
  disabled = false,
  value,
  onChange,
  children,
  className: cls,
  style,
  ...rest
}: RadioProps) {
  const [innerChecked, setInnerChecked, isControlled] = useControlled(checked, defaultChecked)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = e.target.checked
      if (!isControlled) setInnerChecked(next)
      onChange?.(next, value)
    },
    [isControlled, onChange, setInnerChecked, value]
  )

  return (
    <label
      className={className(
        'sofa-radio',
        { 'sofa-radio-disabled': disabled, 'sofa-radio-checked': innerChecked }
      )}
      style={style}
    >
      <input
        type="radio"
        checked={innerChecked}
        disabled={disabled}
        onChange={handleChange}
        className="sofa-radio-input"
        {...rest}
      />
      <span className="sofa-radio-dot" />
      {children != null && <span className="sofa-radio-label">{children}</span>}
    </label>
  )
}

export interface RadioGroupProps {
  /** 选项列表 */
  options?: Array<{ label: React.ReactNode; value: string | number; disabled?: boolean }>
  /** 受控值 */
  value?: string | number
  /** 默认值 */
  defaultValue?: string | number
  /** 变化回调 */
  onChange?: (value: string | number) => void
  /** 全部禁用 */
  disabled?: boolean
  /** 按钮形态 */
  optionType?: 'default' | 'button'
  /** 尺寸（按钮形态） */
  size?: 'small' | 'default' | 'large'
  /** 排列方向 */
  direction?: 'horizontal' | 'vertical'
  className?: string
  style?: React.CSSProperties
}

/**
 * RadioGroup 单选组：按钮 / 默认两种形态
 */
export const RadioGroup = function RadioGroup({
  options = [],
  value,
  defaultValue,
  onChange,
  disabled = false,
  optionType = 'default',
  size = 'default',
  direction = 'horizontal',
  className: cls,
  style
}: RadioGroupProps) {
  const [innerValue, setInnerValue, isControlled] = useControlled(value, defaultValue)

  const select = useCallback(
    (val: string | number) => {
      if (!isControlled) setInnerValue(val)
      onChange?.(val)
    },
    [isControlled, onChange, setInnerValue]
  )

  if (optionType === 'button') {
    return (
      <div
        className={className('sofa-radio-group', 'sofa-radio-group-button', `sofa-radio-group-${size}`, cls)}
        style={style}
      >
        {options.map((opt) => {
          const active = innerValue === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              disabled={disabled || opt.disabled}
              aria-pressed={active}
              className={className('sofa-radio-button', { 'sofa-radio-button-active': active })}
              onClick={() => select(opt.value)}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div
      className={className(
        'sofa-radio-group',
        direction === 'vertical' && 'sofa-radio-group-vertical',
        cls
      )}
      style={style}
    >
      {options.map((opt) => (
        <Radio
          key={opt.value}
          value={opt.value}
          checked={innerValue === opt.value}
          disabled={disabled || opt.disabled}
          onChange={(checked) => checked && select(opt.value)}
        >
          {opt.label}
        </Radio>
      ))}
    </div>
  )
}

export default Radio
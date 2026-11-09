import { useCallback, useEffect } from 'react'
import { className } from '@/utils/classNames'
import { useControlled } from '@/hooks/useControlled'
import { Icon } from '../icon/icon'

/**
 * Checkbox 复选框（含 Group 分组）：支持半选状态与禁用
 */

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange' | 'value' | 'size'> {
  /** 是否选中（受控） */
  checked?: boolean
  /** 默认选中 */
  defaultChecked?: boolean
  /** 半选状态 */
  indeterminate?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 尺寸 */
  size?: 'small' | 'default' | 'large'
  /** 值（Group 模式回传用） */
  value?: string | number
  /** 选中变化回调 */
  onChange?: (checked: boolean, value?: string | number) => void
  children?: React.ReactNode
}

export const Checkbox = function Checkbox({
  checked,
  defaultChecked = false,
  indeterminate = false,
  disabled = false,
  size = 'default',
  value,
  onChange,
  children,
  className: cls,
  style,
  ...rest
}: CheckboxProps) {
  const [innerChecked, setInnerChecked, isControlled] = useControlled(checked, defaultChecked)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return
      const next = e.target.checked
      if (!isControlled) setInnerChecked(next)
      onChange?.(next, value)
    },
    [disabled, isControlled, onChange, setInnerChecked, value]
  )

  // 半选中与全选中互斥：半选时取消全选
  useEffect(() => {
    if (indeterminate && innerChecked) {
      if (!isControlled) setInnerChecked(false)
    }
  }, [indeterminate, innerChecked, isControlled, setInnerChecked])

  return (
    <label
      className={className(
        'sofa-checkbox',
        size === 'small' ? 'sofa-checkbox-sm' : size === 'large' ? 'sofa-checkbox-lg' : 'sofa-checkbox-md',
        { 'sofa-checkbox-disabled': disabled, 'sofa-checkbox-checked': innerChecked }
      )}
      style={style}
    >
      <input
        type="checkbox"
        checked={innerChecked}
        disabled={disabled}
        aria-checked={indeterminate ? 'mixed' : innerChecked}
        onChange={handleChange}
        className="sofa-checkbox-input"
        {...rest}
      />
      <span className={className('sofa-checkbox-box', { 'sofa-checkbox-indeterminate': indeterminate && !innerChecked })}>
        <Icon type="check" size={12} className="sofa-checkbox-icon" />
        {indeterminate && !innerChecked && <span className="sofa-checkbox-dash" />}
      </span>
      {children != null && <span className="sofa-checkbox-label">{children}</span>}
    </label>
  )
}

export interface CheckboxGroupProps {
  /** 选项列表 */
  options?: Array<{ label: React.ReactNode; value: string | number; disabled?: boolean }>
  /** 受控值 */
  value?: Array<string | number>
  /** 默认值 */
  defaultValue?: Array<string | number>
  /** 变化回调 */
  onChange?: (value: Array<string | number>) => void
  /** 全部禁用 */
  disabled?: boolean
  /** 排列方向 */
  direction?: 'horizontal' | 'vertical'
  /** 显示全选 */
  showSelectAll?: boolean
  className?: string
  style?: React.CSSProperties
}

/**
 * CheckboxGroup 复选组：支持全选控制与半选联动
 */
export const CheckboxGroup = function CheckboxGroup({
  options = [],
  value,
  defaultValue = [],
  onChange,
  disabled = false,
  direction = 'horizontal',
  showSelectAll = true,
  className: cls,
  style
}: CheckboxGroupProps) {
  const [innerValue, setInnerValue, isControlled] = useControlled(value, defaultValue)

  const toggle = useCallback(
    (val: string | number, checked: boolean) => {
      const next = checked
        ? [...innerValue, val]
        : innerValue.filter((v) => v !== val)
      if (!isControlled) setInnerValue(next)
      onChange?.(next)
    },
    [innerValue, isControlled, onChange, setInnerValue]
  )

  const enabledValues = options.filter((o) => !o.disabled).map((o) => o.value)
  const allChecked = enabledValues.length > 0 && enabledValues.every((v) => innerValue.includes(v))
  const indeterminate = !allChecked && enabledValues.some((v) => innerValue.includes(v))

  const toggleAll = useCallback(
    (checked: boolean) => {
      const next = checked ? [...new Set([...innerValue, ...enabledValues])] : innerValue.filter((v) => !enabledValues.includes(v))
      if (!isControlled) setInnerValue(next)
      onChange?.(next)
    },
    [enabledValues, innerValue, isControlled, onChange, setInnerValue]
  )

  return (
    <div
      className={className(
        'sofa-checkbox-group',
        direction === 'vertical' && 'sofa-checkbox-group-vertical',
        cls
      )}
      style={style}
    >
      {showSelectAll && options.length > 0 && (
        <Checkbox
          checked={allChecked}
          indeterminate={indeterminate}
          disabled={disabled}
          onChange={toggleAll}
        >
          全选
        </Checkbox>
      )}
      {options.map((opt) => (
        <Checkbox
          key={opt.value}
          value={opt.value}
          checked={innerValue.includes(opt.value)}
          disabled={disabled || opt.disabled}
          onChange={(checked) => toggle(opt.value, checked)}
        >
          {opt.label}
        </Checkbox>
      ))}
    </div>
  )
}

export default Checkbox
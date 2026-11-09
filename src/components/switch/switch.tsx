import { useCallback, useState } from 'react'
import { className } from '@/utils/classNames'
import { useControlled } from '@/hooks/useControlled'
import { Icon } from '../icon/icon'

/**
 * Switch 开关：支持加载态、开关文案与切换前确认
 */

export interface SwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'type'> {
  /** 是否开启（受控） */
  checked?: boolean
  /** 默认开启 */
  defaultChecked?: boolean
  /** 变化回调 */
  onChange?: (checked: boolean) => void
  /** 切换前确认：返回 false 或 Promise<false> 时阻止切换（异步场景自动进入加载态） */
  onBeforeChange?: (checked: boolean) => boolean | void | Promise<boolean | void>
  /** 加载中 */
  loading?: boolean
  /** 禁用 */
  disabled?: boolean
  /** 开启时的文案 */
  checkedText?: React.ReactNode
  /** 关闭时的文案 */
  uncheckedText?: React.ReactNode
  /** 尺寸 */
  size?: 'small' | 'default'
}

export const Switch = function Switch({
  checked,
  defaultChecked = false,
  onChange,
  onBeforeChange,
  loading = false,
  disabled = false,
  checkedText,
  uncheckedText,
  size = 'default',
  className: cls,
  style,
  ...rest
}: SwitchProps) {
  const [innerChecked, setInnerChecked, isControlled] = useControlled(checked, defaultChecked)
  const [confirming, setConfirming] = useState(false)

  const toggle = useCallback(async () => {
    if (disabled || loading || confirming) return
    const next = !innerChecked
    if (onBeforeChange) {
      setConfirming(true)
      try {
        const allow = await onBeforeChange(next)
        if (allow === false) return
      } finally {
        setConfirming(false)
      }
    }
    if (!isControlled) setInnerChecked(next)
    onChange?.(next)
  }, [disabled, loading, confirming, innerChecked, onBeforeChange, isControlled, onChange, setInnerChecked])

  return (
    <button
      role="switch"
      type="button"
      aria-checked={innerChecked}
      aria-disabled={disabled || loading || confirming}
      disabled={disabled || loading || confirming}
      className={className(
        'sofa-switch',
        `sofa-switch-${size}`,
        {
          'sofa-switch-checked': innerChecked,
          'sofa-switch-disabled': disabled || loading || confirming,
          'sofa-switch-with-text': Boolean(checkedText || uncheckedText)
        },
        cls
      )}
      style={style}
      onClick={toggle}
      {...rest}
    >
      <span className="sofa-switch-slider">
        {(loading || confirming) && <Icon type="loading" size={12} spin />}
      </span>
      <span className="sofa-switch-text">
        {innerChecked ? checkedText : uncheckedText}
      </span>
    </button>
  )
}

export default Switch
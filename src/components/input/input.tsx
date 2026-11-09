import { forwardRef, useCallback, useRef, useState } from 'react'
import { className } from '@/utils/classNames'
import { useControlled } from '@/hooks/useControlled'
import { Icon } from '../icon/icon'

/**
 * Input 输入框：支持前后缀插槽、一键清空、字数统计；
 * 支持 prefix/suffix/size 等形态
 */

export type InputSize = 'small' | 'default' | 'large'

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  /** 输入框尺寸 */
  size?: InputSize
  /** 前缀插槽 */
  prefix?: React.ReactNode
  /** 后缀插槽 */
  suffix?: React.ReactNode
  /** 显示清空按钮（有内容时） */
  allowClear?: boolean
  /** 是否显示字数统计 */
  showCount?: boolean
  /** 禁用状态 */
  disabled?: boolean
  /** 状态样式 */
  status?: 'error' | 'warning'
  value?: string
  defaultValue?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    size = 'default',
    prefix,
    suffix,
    allowClear = false,
    showCount = false,
    disabled = false,
    status,
    value,
    defaultValue = '',
    onChange,
    className: cls,
    style,
    maxLength,
    type = 'text',
    ...rest
  },
  ref
) {
  const [innerValue, setInnerValue, isControlled] = useControlled(value, defaultValue)
  const inputRef = useRef<HTMLInputElement | null>(null)
  /** 字数统计：rAF 节流，避免高频率输入触发每帧重算 */
  const [count, setCount] = useState(() => String(defaultValue ?? '').length)
  const countRafRef = useRef<number>(0)

  const scheduleCount = useCallback((val: string) => {
    cancelAnimationFrame(countRafRef.current)
    countRafRef.current = requestAnimationFrame(() => setCount(String(val).length))
  }, [])

  const mergedRef = (node: HTMLInputElement | null) => {
    inputRef.current = node
    if (typeof ref === 'function') ref(node)
    else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node
  }

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (showCount) scheduleCount(e.target.value)
      if (!isControlled) setInnerValue(e.target.value)
      onChange?.(e)
    },
    [isControlled, onChange, setInnerValue, showCount, scheduleCount]
  )

  const handleClear = useCallback(() => {
    if (!inputRef.current) return
    const inputEl = inputRef.current
    const nativeSetter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value'
    )?.set
    nativeSetter?.call(inputEl, '')
    inputEl.dispatchEvent(new Event('input', { bubbles: true }))
    if (!isControlled) setInnerValue('')
    onChange?.({
      target: inputEl,
      currentTarget: inputEl
    } as React.ChangeEvent<HTMLInputElement>)
    inputEl.focus()
  }, [isControlled, onChange, setInnerValue])

  const hasClear = allowClear && !disabled && innerValue !== ''

  return (
    <span
      className={className(
        'sofa-input-wrapper',
        size === 'small' ? 'sofa-input-sm' : size === 'large' ? 'sofa-input-lg' : 'sofa-input-md',
        {
          'sofa-input-affix': Boolean(prefix || suffix || hasClear),
          'sofa-input-disabled': disabled,
          'sofa-input-error': status === 'error',
          'sofa-input-warning': status === 'warning'
        },
        cls
      )}
      style={style}
    >
      {prefix && <span className="sofa-input-prefix">{prefix}</span>}
      <input
        ref={mergedRef}
        type={type}
        value={innerValue}
        disabled={disabled}
        maxLength={maxLength}
        onChange={handleChange}
        className="sofa-input"
        aria-disabled={disabled}
        {...rest}
      />
      {hasClear && (
        <span
          role="button"
          aria-label="清空输入"
          className="sofa-input-clear"
          onMouseDown={(e) => {
            e.preventDefault()
            handleClear()
          }}
        >
          <Icon type="close-circle" size={14} />
        </span>
      )}
      {suffix && <span className="sofa-input-suffix">{suffix}</span>}
      {showCount && (
        <span className="sofa-input-count">
          {count}
          {maxLength !== undefined && ` / ${maxLength}`}
        </span>
      )}
    </span>
  )
})

export default Input
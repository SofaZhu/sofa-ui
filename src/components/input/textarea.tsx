import { forwardRef, useCallback, useLayoutEffect, useRef } from 'react'
import { className } from '@/utils/classNames'
import { useControlled } from '@/hooks/useControlled'

/**
 * Textarea 文本域：
 * 支持自动高度（autosize）与字数统计
 */

export interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'defaultValue'> {
  /** 是否根据内容自动调整高度 */
  autosize?: boolean | { minRows?: number; maxRows?: number }
  /** 是否显示字数统计 */
  showCount?: boolean
  value?: string
  defaultValue?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    autosize = false,
    showCount = false,
    value,
    defaultValue = '',
    onChange,
    className: cls,
    style,
    maxLength,
    rows = 3,
    ...rest
  },
  ref
) {
  const [innerValue, setInnerValue, isControlled] = useControlled(value, defaultValue)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const mergedRef = (node: HTMLTextAreaElement | null) => {
    textareaRef.current = node
    if (typeof ref === 'function') ref(node)
    else if (ref) (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node
  }

  const minRows = typeof autosize === 'object' ? (autosize.minRows ?? 1) : 1
  const maxRows = typeof autosize === 'object' ? autosize.maxRows : undefined

  /** 依据内容行数调整高度，受 minRows / maxRows 约束 */
  const resize = useCallback(() => {
    const el = textareaRef.current
    if (!el || !autosize) return
    const lineHeight = Number.parseFloat(getComputedStyle(el).lineHeight) || 20
    el.style.height = 'auto'
    const contentRows = Math.ceil(el.scrollHeight / lineHeight)
    const finalRows = Math.max(minRows, Math.min(maxRows ?? contentRows, contentRows))
    el.style.height = `${finalRows * lineHeight}px`
  }, [autosize, minRows, maxRows])

  // 初始及内容变化时执行自适应
  useLayoutEffect(() => {
    resize()
  }, [innerValue, resize])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (!isControlled) setInnerValue(e.target.value)
      onChange?.(e)
    },
    [isControlled, onChange, setInnerValue]
  )

  return (
    <span className={className('sofa-textarea-wrapper', cls)} style={style}>
      <textarea
        ref={mergedRef}
        value={innerValue}
        rows={rows}
        maxLength={maxLength}
        onChange={handleChange}
        className="sofa-textarea"
        {...rest}
      />
      {showCount && (
        <span className="sofa-textarea-count">
          {String(innerValue ?? '').length}
          {maxLength !== undefined && ` / ${maxLength}`}
        </span>
      )}
    </span>
  )
})

export default Textarea
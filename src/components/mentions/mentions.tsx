import { useCallback, useEffect, useMemo, useState } from 'react'
import { className } from '@/utils/classNames'
import { useControlled, useLatest } from '@/hooks/useControlled'
import { usePop } from '@/hooks/usePop'
import { Input } from '../input/input'

/**
 * Mentions 提及输入框：
 * 输入前缀触发建议列表，选中后以「前缀 + 词条」替换输入片段
 */

export interface MentionOption {
  /** 词条值（写入文本的内容） */
  value: string
  /** 展示文案，缺省用 value */
  label?: string
}

export interface MentionsProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'onBlur' | 'size'> {
  /** 受控文本 */
  value?: string
  /** 默认文本 */
  defaultValue?: string
  /** 文本变化回调 */
  onChange?: (value: string) => void
  /** 候选词条 */
  options?: MentionOption[]
  /** 提及前缀，默认 @ */
  prefix?: string
  /** 输入前缀后搜索回调：参数为当前输入片段与触发前缀 */
  onSearch?: (text: string, prefix: string) => void
  /** 占位文案 */
  placeholder?: string
  /** 禁用 */
  disabled?: boolean
  className?: string
  style?: React.CSSProperties
}

/**
 * 提取文本中所有被匹配的提及词（不含前缀）
 */
export function getMentions(value: string, prefix = '@'): string[] {
  const esc = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const re = new RegExp(`${esc}([\\w\\u4e00-\\u9fa5]+)`, 'g')
  const result: string[] = []
  let match: RegExpExecArray | null
  while ((match = re.exec(value)) !== null) {
    result.push(match[1])
  }
  return result
}

/** 定位正在编辑的提及片段：最后一个以前缀开头的空白分隔片段 */
function getEditingFragment(value: string, prefix: string): { start: number; keyword: string } | null {
  const parts = value.split(/(\s+)/)
  const last = parts[parts.length - 1]
  if (!last || !last.startsWith(prefix)) return null
  const start = value.length - last.length
  return { start, keyword: last.slice(prefix.length) }
}

export function Mentions({
  value,
  defaultValue = '',
  onChange,
  options = [],
  prefix = '@',
  onSearch,
  placeholder = '请输入，@ 提及他人',
  disabled = false,
  className: cls,
  style,
  ...rest
}: MentionsProps) {
  const [innerValue, setInnerValue, isControlled] = useControlled<string>(value, defaultValue)
  const latestOnChange = useLatest(onChange)
  const latestOnSearch = useLatest(onSearch)

  const pop = usePop({
    trigger: 'focus',
    placement: 'bottomLeft',
    offset: 4,
    disabled
  })

  const editing = getEditingFragment(innerValue, prefix)
  const keyword = editing?.keyword ?? ''

  /** 过滤后的候选列表 */
  const filtered = useMemo(() => {
    if (!editing) return []
    if (!keyword) return options
    const kw = keyword.toLowerCase()
    return options.filter((o) => {
      const label = o.label ?? o.value
      return o.value.toLowerCase().includes(kw) || label.toLowerCase().includes(kw)
    })
  }, [editing, keyword, options])

  const [activeIndex, setActiveIndex] = useState(-1)

  // 候选变化时重置高亮
  useEffect(() => {
    setActiveIndex(-1)
  }, [keyword])

  // 输入片段变化时通知搜索
  useEffect(() => {
    if (editing) latestOnSearch.current?.(keyword, prefix)
  }, [editing, keyword, prefix, latestOnSearch])

  /** 用选中词条替换正在编辑的片段 */
  const selectOption = useCallback(
    (opt: MentionOption) => {
      if (!editing) return
      const next =
        innerValue.slice(0, editing.start) +
        prefix +
        opt.value +
        ' ' +
        innerValue.slice(editing.start + prefix.length + editing.keyword.length)
      if (!isControlled) setInnerValue(next)
      latestOnChange.current?.(next)
      setActiveIndex(-1)
      pop.setOpen(false)
    },
    [editing, innerValue, isControlled, prefix, setInnerValue, latestOnChange, pop]
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = e.target.value
      if (!isControlled) setInnerValue(next)
      latestOnChange.current?.(next)
    },
    [isControlled, setInnerValue, latestOnChange]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return
      if (!pop.open) return
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        if (filtered.length === 0) return
        e.preventDefault()
        const delta = e.key === 'ArrowDown' ? 1 : -1
        let next = activeIndex + delta
        if (next < 0) next = filtered.length - 1
        if (next >= filtered.length) next = 0
        setActiveIndex(next)
      } else if (e.key === 'Enter') {
        const opt = filtered[activeIndex >= 0 ? activeIndex : 0]
        if (opt) {
          e.preventDefault()
          selectOption(opt)
        }
      } else if (e.key === 'Escape') {
        pop.setOpen(false)
      }
    },
    [disabled, pop, filtered, activeIndex, selectOption]
  )

  return (
    <span
      ref={pop.anchorRef}
      className={className('sofa-mentions', cls)}
      style={style}
      {...pop.events}
      onFocus={() => pop.setOpen(true)}
      onBlur={() => pop.setOpen(false)}
    >
      <Input
        value={innerValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        aria-label={placeholder}
        {...rest}
      />

      {pop.open && filtered.length > 0 && (
        <div
          ref={pop.popRef}
          className={className('sofa-popup', 'sofa-mentions-popup')}
          role="listbox"
          aria-label="提及候选"
        >
          {filtered.map((opt, index) => (
            <div
              key={opt.value}
              role="option"
              aria-selected={index === activeIndex}
              className={className('sofa-mentions-option', {
                'sofa-mentions-option-active': index === activeIndex
              })}
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => selectOption(opt)}
            >
              {opt.label ?? opt.value}
            </div>
          ))}
        </div>
      )}
    </span>
  )
}

export default Mentions
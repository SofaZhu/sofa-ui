import { useCallback, useMemo, useRef, useState } from 'react'
import { className } from '@/utils/classNames'
import { useControlled, useLatest } from '@/hooks/useControlled'
import { usePop, type PopPlacement } from '@/hooks/usePop'
import { Icon } from '../icon/icon'

/**
 * Select 选择器：
 * 支持单选 / 多选 / 可搜索 / 可清空 / 自定义下拉内容
 */

export interface SelectOption {
  label: React.ReactNode
  value: string | number
  disabled?: boolean
}

export type SelectValue = string | number | Array<string | number> | undefined

export interface SelectProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    'onChange' | 'children' | 'value' | 'size' | 'defaultValue'
  > {
  /** 下拉选项 */
  options?: SelectOption[]
  /** 受控值 */
  value?: SelectValue
  /** 默认值 */
  defaultValue?: SelectValue
  /** 值变化回调 */
  onChange?: (value: SelectValue) => void
  /** 多选模式 */
  multiple?: boolean
  /** 是否可搜索 */
  searchable?: boolean
  /** 是否可清空 */
  clearable?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 是否处于加载状态 */
  loading?: boolean
  /** 占位文案 */
  placeholder?: string
  /** 尺寸 */
  size?: 'small' | 'default' | 'large'
  /** 下拉弹层方向 */
  placement?: PopPlacement
  /** 空数据展示 */
  emptyText?: React.ReactNode
  /** 自定义下拉内容（替代 options 渲染） */
  children?: React.ReactNode
}

/** 将受控值统一为数组形式，便于多选 / 单选共用 */
function toArray(value: SelectValue | undefined): Array<string | number> {
  if (value === undefined || value === null) return []
  return Array.isArray(value) ? value : [value]
}

export const Select = function Select({
  options = [],
  value,
  defaultValue,
  onChange,
  multiple = false,
  searchable = false,
  clearable = false,
  disabled = false,
  loading = false,
  placeholder = '请选择',
  size = 'default',
  placement = 'bottom',
  emptyText,
  children,
  className: cls,
  style,
  ...rest
}: SelectProps) {
  const fallback = (multiple ? [] : undefined) as SelectValue
  const [innerValue, setInnerValue, isControlled] = useControlled<SelectValue | undefined>(
    value,
    fallback
  )
  const latestValue = useLatest(innerValue)

  const pop = usePop({
    trigger: 'click',
    placement,
    widthRatio: 1,
    offset: 4,
    disabled
  })

  const [keyword, setKeyword] = useState('')
  const [activeIndex, setActiveIndex] = useState(-1)
  const searchRef = useRef<HTMLInputElement>(null)

  /** 过滤后的选项列表 */
  const filteredOptions = useMemo(() => {
    if (!searchable || !keyword) return options
    const kw = keyword.toLowerCase()
    return options.filter((opt) => String(opt.label).toLowerCase().includes(kw))
  }, [options, keyword, searchable])

  const selectedArray = toArray(latestValue.current)

  const isSelected = useCallback(
    (val: string | number) => selectedArray.includes(val),
    [selectedArray]
  )

  /** 切换某个选项的选择状态 */
  const toggleOption = useCallback(
    (opt: SelectOption) => {
      if (opt.disabled || disabled) return
      let next: SelectValue
      if (multiple) {
        const exists = selectedArray.includes(opt.value)
        next = exists
          ? selectedArray.filter((v) => v !== opt.value)
          : [...selectedArray, opt.value]
      } else {
        next = isSelected(opt.value) ? undefined : opt.value
        pop.setOpen(false)
      }
      if (!isControlled) setInnerValue(next)
      onChange?.(next)
    },
    [multiple, selectedArray, isSelected, isControlled, setInnerValue, onChange, pop, disabled]
  )

  /** 键盘导航：上下移动高亮，回车确认 */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
        const list = filteredOptions
        if (list.length === 0) return
        const delta = e.key === 'ArrowDown' ? 1 : -1
        let next = activeIndex + delta
        if (next < 0) next = list.length - 1
        if (next >= list.length) next = 0
        setActiveIndex(next)
      } else if (e.key === 'Enter') {
        const opt = filteredOptions[activeIndex]
        if (opt) toggleOption(opt)
      }
    },
    [activeIndex, filteredOptions, toggleOption, disabled]
  )

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      const next: SelectValue = multiple ? [] : undefined
      if (!isControlled) setInnerValue(next)
      onChange?.(next)
    },
    [isControlled, setInnerValue, onChange, multiple]
  )

  const shownLabel = !multiple && innerValue !== undefined ? (
    options.find((o) => o.value === innerValue)?.label ?? ''
  ) : ''

  return (
    <div
      className={className(
        'sofa-select',
        `sofa-select-${size}`,
        {
          'sofa-select-open': pop.open,
          'sofa-select-disabled': disabled,
          'sofa-select-multiple': multiple
        },
        cls
      )}
      style={style}
      {...rest}
    >
      <span
        ref={pop.anchorRef}
        className="sofa-select-anchor"
        {...pop.events}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={pop.open}
        aria-disabled={disabled}
      >
        <span className={className('sofa-select-render', (innerValue === undefined || innerValue === null || (multiple && selectedArray.length === 0)) && 'sofa-select-placeholder')}>
          {multiple ? (
            selectedArray.length > 0 && (
              <span className="sofa-select-tags">
                {selectedArray.map((v) => {
                  const opt = options.find((o) => o.value === v)
                  return (
                    <span key={v} className="sofa-select-tag">
                      {opt?.label ?? v}
                      {!disabled && (
                        <Icon
                          type="close"
                          size={10}
                          className="sofa-select-tag-close"
                          onClick={(e) => {
                            e.stopPropagation()
                            const optItem = options.find((o) => o.value === v)
                            if (optItem) toggleOption(optItem)
                          }}
                        />
                      )}
                    </span>
                  )
                })}
              </span>
            )
          ) : (
            shownLabel
          )}
          {((multiple && selectedArray.length === 0) || (!multiple && shownLabel === '')) && placeholder}
        </span>
        {loading ? (
          <Icon type="loading" size={14} spin className="sofa-select-suffix" />
        ) : clearable && selectedArray.length > 0 ? (
          <Icon
            type="close-circle"
            size={14}
            className="sofa-select-suffix sofa-select-clear"
            onClick={handleClear}
          />
        ) : (
          <Icon type="chevron-down" size={14} className="sofa-select-suffix" />
        )}
      </span>

      {pop.open && (
        <div
          ref={pop.popRef}
          className={className('sofa-popup', 'sofa-select-dropdown', `${'sofa-popup-' + placement.replace(/(Top|Left|Right|Bottom)$/i, (m) => m.toLowerCase())}`)}
          style={{ visibility: 'hidden' }}
          role="listbox"
          onMouseEnter={() => {
            /* 保持下拉打开，避免 hover 触发误关 */
          }}
        >
          {searchable && (
            <div className="sofa-select-search">
              <Icon type="search" size={13} className="sofa-select-search-icon" />
              <input
                ref={searchRef}
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value)
                  setActiveIndex(-1)
                }}
                placeholder="搜索"
                className="sofa-select-search-input"
                autoFocus
              />
            </div>
          )}
          <div className="sofa-select-option-list">
            {children ??
              (filteredOptions.length > 0 ? (
                filteredOptions.map((opt, index) => (
                  <div
                    key={opt.value}
                    role="option"
                    aria-selected={isSelected(opt.value)}
                    className={className('sofa-select-option', {
                      'sofa-select-option-active': isSelected(opt.value),
                      'sofa-select-option-highlight': index === activeIndex,
                      'sofa-select-option-disabled': opt.disabled
                    })}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => toggleOption(opt)}
                  >
                    <span className="sofa-select-option-label">{opt.label}</span>
                    {multiple && isSelected(opt.value) && (
                      <Icon type="check" size={13} className="sofa-select-option-check" />
                    )}
                  </div>
                ))
              ) : (
                <div className="sofa-select-empty">{emptyText ?? '暂无数据'}</div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Select
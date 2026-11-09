import { useCallback, useMemo, useState } from 'react'
import { className } from '@/utils/classNames'
import { useControlled, useLatest } from '@/hooks/useControlled'
import { usePop } from '@/hooks/usePop'
import { Icon } from '../icon/icon'
import { Input } from '../input/input'

/**
 * DatePicker 日期选择器：
 * 日历面板 + 输入框展示，支持格式、禁用范围、清空与键盘导航
 */

export interface DatePickerProps {
  /** 受控选中日期 */
  value?: Date | null
  /** 默认选中日期 */
  defaultValue?: Date | null
  /** 选中变化回调 */
  onChange?: (date: Date | null) => void
  /** 占位文案 */
  placeholder?: string
  /** 禁用 */
  disabled?: boolean
  /** 显示清空按钮 */
  allowClear?: boolean
  /** 展示格式，支持 YYYY/MM/DD 组合 */
  format?: string
  /** 最小可选日期（含当天） */
  minDate?: Date
  /** 最大可选日期（含当天） */
  maxDate?: Date
  /** 面板开合变化回调 */
  onOpenChange?: (open: boolean) => void
  className?: string
  style?: React.CSSProperties
}

/** 两位补零 */
function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n)
}

/**
 * 格式化日期：fmt 支持 YYYY/MM/DD 简单占位组合
 */
export function formatDate(date: Date, fmt = 'YYYY-MM-DD'): string {
  return fmt
    .replace('YYYY', String(date.getFullYear()))
    .replace('MM', pad(date.getMonth() + 1))
    .replace('DD', pad(date.getDate()))
}

/**
 * 生成月网格：从包含当月 1 号的周一开始，共 42 天（6 周）
 */
export function getMonthGrid(year: number, month: number): Date[] {
  const first = new Date(year, month, 1)
  // 周一开始计 0，得到 1 号所在周的周一
  const firstWeekday = (first.getDay() + 6) % 7
  const start = new Date(year, month, 1 - firstWeekday)
  return Array.from({ length: 42 }, (_, i) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i))
}

const WEEK_HEADERS = ['一', '二', '三', '四', '五', '六', '日']

/** 忽略时分秒后的日期比较 */
function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function dayStart(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

export function DatePicker({
  value,
  defaultValue,
  onChange,
  placeholder = '请选择日期',
  disabled = false,
  allowClear = false,
  format = 'YYYY-MM-DD',
  minDate,
  maxDate,
  onOpenChange,
  className: cls,
  style
}: DatePickerProps) {
  const [innerValue, setInnerValue, isControlled] = useControlled<Date | null>(
    value,
    defaultValue ?? null
  )
  const current = innerValue ?? null
  const latestValue = useLatest(current)
  const latestOnChange = useLatest(onChange)

  const pop = usePop({
    trigger: 'click',
    placement: 'bottomLeft',
    offset: 4,
    disabled
  })

  const today = useMemo(() => {
    const t = new Date()
    return new Date(t.getFullYear(), t.getMonth(), t.getDate())
  }, [])

  // 面板当前浏览的年月与键盘高亮日期
  const baseDate = current ?? today
  const [viewYear, setViewYear] = useState(baseDate.getFullYear())
  const [viewMonth, setViewMonth] = useState(baseDate.getMonth())
  const [focusDate, setFocusDate] = useState(baseDate)

  const grid = useMemo(() => getMonthGrid(viewYear, viewMonth), [viewYear, viewMonth])

  const open = pop.open
  const setOpen = pop.setOpen

  /** 展开面板时同步浏览到当前值所在月份 */
  const handleOpen = useCallback(() => {
    const base = latestValue.current ?? new Date()
    setViewYear(base.getFullYear())
    setViewMonth(base.getMonth())
    setFocusDate(base)
    setOpen(true)
    onOpenChange?.(true)
  }, [latestValue, onOpenChange, setOpen])

  const handleClose = useCallback(() => {
    setOpen(false)
    onOpenChange?.(false)
  }, [onOpenChange, setOpen])

  /** 是否在禁用范围内 */
  const isDisabled = useCallback(
    (d: Date) => {
      const t = dayStart(d).getTime()
      if (minDate && t < dayStart(minDate).getTime()) return true
      if (maxDate && t > dayStart(maxDate).getTime()) return true
      return false
    },
    [minDate, maxDate]
  )

  /** 选中某天 */
  const selectDate = useCallback(
    (d: Date) => {
      if (isDisabled(d)) return
      const next = new Date(d.getFullYear(), d.getMonth(), d.getDate())
      if (!isControlled) setInnerValue(next)
      latestOnChange.current?.(next)
      handleClose()
    },
    [isDisabled, isControlled, setInnerValue, latestOnChange, handleClose]
  )

  /** 切换月份 */
  const moveMonth = useCallback(
    (delta: number) => {
      const next = new Date(viewYear, viewMonth + delta, 1)
      setViewYear(next.getFullYear())
      setViewMonth(next.getMonth())
    },
    [viewYear, viewMonth]
  )

  /** 输入框键盘：方向键移动高亮，Enter 选中，Tab/ESC 关闭 */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return
      if (!open) return
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault()
        const delta = e.key === 'ArrowLeft' ? -1 : e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' ? -7 : 7
        const next = new Date(
          focusDate.getFullYear(),
          focusDate.getMonth(),
          focusDate.getDate() + delta
        )
        setFocusDate(next)
        // 跨月时跟随浏览月份
        if (next.getMonth() !== viewMonth) {
          setViewYear(next.getFullYear())
          setViewMonth(next.getMonth())
        }
      } else if (e.key === 'Enter') {
        e.preventDefault()
        selectDate(focusDate)
      }
    },
    [disabled, open, focusDate, viewMonth, selectDate]
  )

  /** 清空时回传 null */
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.value === '' && latestValue.current !== null) {
        if (!isControlled) setInnerValue(null)
        latestOnChange.current?.(null)
      }
    },
    [isControlled, setInnerValue, latestValue, latestOnChange]
  )

  const text = current ? formatDate(current, format) : ''

  return (
    <span
      ref={pop.anchorRef}
      className={className('sofa-datepicker', cls)}
      style={style}
      onFocus={() => {
        if (!pop.open) handleOpen()
      }}
      onClick={() => {
        if (!pop.open) handleOpen()
      }}
      onBlur={(e) => {
        // 焦点离开（Tab 或点击外部）时关闭
        if (e.relatedTarget && !pop.popRef.current?.contains(e.relatedTarget as Node)) {
          handleClose()
        }
      }}
    >
      <Input
        readOnly
        value={text}
        placeholder={placeholder}
        disabled={disabled}
        allowClear={allowClear && !disabled}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        aria-label={placeholder}
        suffix={<Icon type="calendar" size={14} />}
      />

      {open && (
        <div
          ref={pop.popRef}
          className={className('sofa-popup', 'sofa-datepicker-popup')}
        >
          <div className="sofa-datepicker-header">
            <button
              type="button"
              tabIndex={-1}
              className="sofa-datepicker-header-btn"
              aria-label="上个月"
              onClick={() => moveMonth(-1)}
            >
              <Icon type="chevron-left" size={14} />
            </button>
            <span className="sofa-datepicker-title">
              {viewYear}年{viewMonth + 1}月
            </span>
            <button
              type="button"
              tabIndex={-1}
              className="sofa-datepicker-header-btn"
              aria-label="下个月"
              onClick={() => moveMonth(1)}
            >
              <Icon type="chevron-right" size={14} />
            </button>
          </div>

          <div className="sofa-datepicker-week">
            {WEEK_HEADERS.map((w) => (
              <span key={w}>{w}</span>
            ))}
          </div>

          <div className="sofa-datepicker-grid">
            {grid.map((d) => {
              const out = d.getMonth() !== viewMonth
              const cellDisabled = isDisabled(d)
              const selected = current !== null && sameDay(d, current)
              const isToday = sameDay(d, today)
              const highlight = sameDay(d, focusDate)
              return (
                <button
                  key={d.getTime()}
                  type="button"
                  tabIndex={-1}
                  disabled={cellDisabled}
                  aria-disabled={cellDisabled}
                  className={className('sofa-datepicker-cell', {
                    'sofa-datepicker-cell-out': out,
                    'sofa-datepicker-cell-today': isToday,
                    'sofa-datepicker-cell-selected': selected,
                    'sofa-datepicker-cell-highlight': highlight
                  })}
                  onClick={() => selectDate(d)}
                >
                  {d.getDate()}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </span>
  )
}

export default DatePicker
